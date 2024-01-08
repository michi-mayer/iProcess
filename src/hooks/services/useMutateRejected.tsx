import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ScheduleStateProps } from 'APIcustom'
import { z } from 'zod'
import {
  Bool,
  CreateDefectiveInput,
  CreateDefectiveMutationVariables,
  Shift,
  UpdateDefectiveInput,
  UpdateDefectiveMutationVariables
} from 'API'
import { Classification, useIProcessState } from 'contexts/iProcessContext'
import { createDefective, updateDefective } from 'graphql/mutations'
import { assertNever } from 'helper/assertNever'
import { getShiftFromDateTime, getUtcDateTimeFromLocalDateTime } from 'helper/time'
import { convertBooleanToBool, defined } from 'helper/utils'
import { call } from 'services/client'

type Action = 'create' | 'update' | 'delete'

interface RejectedForm {
  id?: string
  count?: number
  timeStamp: string
  location?: string
  errorSource?: Classification[]
  damageType?: string
  isGridSelected?: boolean
  gridImageA?: number[]
  gridImageB?: number[]
  defectiveGrid?: string
  radioTextField?: string
  selectedLocationIndex?: number
  checkedErrorIds?: string[]
}

const RejectedSchema: z.ZodType<CreateDefectiveInput> = z.object({
  dateTimeUTC: z.string().optional(),
  shift: z.nativeEnum(Shift),
  partId: z.string(),
  unitId: z.string(),
  timeZone: z.string(),
  deleted: z.nativeEnum(Bool),
  count: z.number(),
  defectiveGrid: z.string().optional(),
  defectiveLocation: z.string().optional(),
  defectiveType: z.string().optional(),
  defectiveCause: z.string().optional()
})

export const convertToDefectiveGrid = (gridA?: number[], gridB?: number[]) => {
  if (gridA || gridB) {
    const defectiveGridA = gridA?.map((item) => 'A' + item).join(';')
    const defectiveGridB = gridB?.map((item) => 'B' + item).join(';')
    return [defectiveGridA, defectiveGridB].join(';')
  }
}

interface UpdateRejectedProps {
  rejectedFormData: RejectedForm
  action: Action
  scheduleState: ScheduleStateProps
}

const mutateRejected = async ({ rejectedFormData, action, scheduleState }: UpdateRejectedProps) => {
  const dateTimeUTC = getUtcDateTimeFromLocalDateTime(rejectedFormData?.timeStamp, scheduleState.timeZone)

  const shift = getShiftFromDateTime(
    rejectedFormData?.timeStamp,
    scheduleState.shiftTimeRange?.morningShiftStart,
    scheduleState.shiftTimeRange?.afternoonShiftStart,
    scheduleState.shiftTimeRange?.nightShiftStart
  )

  const defectiveGrid = convertToDefectiveGrid(rejectedFormData.gridImageA, rejectedFormData.gridImageB)

  const data = {
    dateTimeUTC,
    shift,
    partId: scheduleState?.productSelected.id,
    unitId: scheduleState?.unitSelected?.id,
    timeZone: scheduleState?.timeZone,
    deleted: convertBooleanToBool(false),
    count: rejectedFormData.count || 1,
    defectiveGrid,
    defectiveLocation: rejectedFormData.location,
    defectiveType: rejectedFormData.damageType,
    defectiveCause: rejectedFormData.errorSource?.map((item) => item.value).join('; ')
  }

  const input = RejectedSchema.parse(data)

  switch (action) {
    case 'create':
      return await call<CreateDefectiveInput, CreateDefectiveMutationVariables>(createDefective, {
        input
      })

    case 'update':
    case 'delete':
      return await call<UpdateDefectiveInput, UpdateDefectiveMutationVariables>(updateDefective, {
        input: {
          ...input,
          id: defined('id in mutateRejected', rejectedFormData.id),
          deleted: convertBooleanToBool(action === 'delete')
        }
      })

    default:
      assertNever(action)
      break
  }
}

const useMutateRejected = (action: Action) => {
  const { selectedShift, unitSelected, productSelected, timeZone, shiftTimeRange } = useIProcessState()
  const queryClient = useQueryClient()

  const scheduleState: ScheduleStateProps = {
    selectedShift,
    unitSelected,
    productSelected,
    timeZone,
    shiftTimeRange
  }

  return useMutation({
    mutationFn: (rejectedFormData: RejectedForm) => mutateRejected({ rejectedFormData, action, scheduleState }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['FetchRejectedCount']
      })
    },
    onError: (error, data) => console.error('[useMutateRejected]:', error, data)
  })
}

export default useMutateRejected
