import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Merge } from 'type-fest'
import { z } from 'zod'
import { AttendingShift, Shift, StartShiftInput, StartShiftMutationVariables, TimeRange } from 'API'
import { useIProcessState } from 'contexts/iProcessContext'
import { startShift } from 'graphql/mutations'
import { call } from 'services/client'
import { TimeRangeSchema } from 'shared'

const Schema: z.ZodType<StartShiftInput> = z.object({
  unitId: z.string(),
  partId: z.string(),
  shiftModelId: z.string(),
  shiftType: z.nativeEnum(Shift),
  attendingShift: z.nativeEnum(AttendingShift),
  timeRange: TimeRangeSchema,
  timeZone: z.string(),
  shiftTarget: z.number().nullish(),
  cycleTime: z.number().nullish(),
  speedMode: z.number().nullish()
})

export type MutateStartShiftInput = Merge<Partial<StartShiftInput>, { timeRange: Partial<TimeRange> }>

const startShiftMutation = async (data: MutateStartShiftInput) => {
  const input = Schema.parse(data)
  await call<unknown, StartShiftMutationVariables>(startShift, { input })
}

const useMutateStartShift = () => {
  const queryClient = useQueryClient()
  const { shiftTimeRange } = useIProcessState()
  const timeRange = { startDateTime: shiftTimeRange?.dateTimeStartUTC, endDateTime: shiftTimeRange?.dateTimeEndUTC }

  return useMutation({
    mutationFn: (data: Partial<MutateStartShiftInput>) => startShiftMutation({ ...data, timeRange }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['FetchCalculationPerScheduleSlot']
      })
      queryClient.invalidateQueries({
        queryKey: ['ValidConfigurationByUnit']
      })
      queryClient.invalidateQueries({
        queryKey: ['FetchRejectedCount']
      })
    },
    onError: (error, data) => console.error('Error starting shift', { error, data: { ...data, timeRange } })
  })
}

export default useMutateStartShift
