import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ScheduleStateProps } from 'APIcustom'
import moment from 'moment-timezone'
import { z } from 'zod'
import { DisruptionDialogSchema } from 'zodSchemas'
import {
  Bool,
  CreateDisruptionInput,
  CreateDisruptionMutation,
  CreateDisruptionMutationVariables,
  Shift,
  UpdateDisruptionMutation,
  UpdateDisruptionMutationVariables
} from 'API'
import { IDisruptionFormState } from 'components/Dialogs/DisruptionDialogs/DisruptionDialog'
import { useIProcessState } from 'contexts/iProcessContext'
import { createDisruption, updateDisruption } from 'graphql/mutations'
import { getShiftFromDateTime, getUtcDateTimeFromLocalDateTime, globalLocalDateTimeFormat } from 'helper/time'
import { convertBooleanToBool } from 'helper/utils'
import { call } from 'services/client'

const CreateDisruptionMutationSchema: z.ZodType<CreateDisruptionInput> = DisruptionDialogSchema.omit({
  startDateTime: true,
  durationInMinutes: true,
  categoryClassification: true,
  typeClassification: true,
  reasonClassification: true,
  deletedFiles: true
}).extend({
  disLocation: z.string(),
  disLocationSpecification: z.string(),
  disLocationType: z.string().nullish(),
  startTimeDateUTC: z.string().datetime(),
  endTimeDateUTC: z.string().datetime(),
  timeZone: z.string(),
  partId: z.string(),
  unitId: z.string(),
  template: z.nativeEnum(Bool),
  deleted: z.nativeEnum(Bool),
  shiftType: z.nativeEnum(Shift),
  isSolved: z.nativeEnum(Bool)
})

const DateSchema = z.string().datetime()

interface Props {
  scheduleState: ScheduleStateProps
  disruptionFormData: IDisruptionFormState
  isUpdatingDisruption: boolean
}

const mutateDisruptionCount = async ({ disruptionFormData, scheduleState, isUpdatingDisruption }: Props) => {
  const disruptionEndDateTime = moment(disruptionFormData.startDateTime)
    .add(disruptionFormData.durationInMinutes, 'minutes')
    .format(globalLocalDateTimeFormat)
  // second format transforms e.g. 3:7 --> 03:07
  const endTimeDateUTC = DateSchema.parse(
    getUtcDateTimeFromLocalDateTime(disruptionEndDateTime, scheduleState.timeZone)
  )
  const startTimeDateUTC = DateSchema.parse(
    getUtcDateTimeFromLocalDateTime(disruptionFormData.startDateTime, scheduleState.timeZone)
  )

  const input = CreateDisruptionMutationSchema.parse({
    disLocation: disruptionFormData.categoryClassification,
    disLocationSpecification: disruptionFormData.reasonClassification,
    disLocationType: disruptionFormData.typeClassification || undefined,
    description: disruptionFormData.description,
    startTimeDateUTC,
    endTimeDateUTC,
    timeZone: scheduleState.timeZone,
    duration: disruptionFormData.duration,
    measures: disruptionFormData.measures,
    partId: scheduleState.productSelected.id,
    unitId: scheduleState.unitSelected?.id,
    templateId: disruptionFormData.templateId,
    cycleStationId: disruptionFormData.cycleStationId,
    deleted: Bool.no,
    template: Bool.no,
    issues: disruptionFormData.issues,
    shiftType: getShiftFromDateTime(
      disruptionFormData.startDateTime,
      scheduleState.shiftTimeRange?.morningShiftStart,
      scheduleState.shiftTimeRange?.afternoonShiftStart,
      scheduleState.shiftTimeRange?.nightShiftStart
    ),
    lostVehicles: disruptionFormData.lostVehicles,
    attachments: disruptionFormData.attachments,
    teamId: disruptionFormData.teamId,
    m100: disruptionFormData.m100,
    originatorId: disruptionFormData.originatorId,
    isSolved: convertBooleanToBool(disruptionFormData.isSolved)
  })

  if (isUpdatingDisruption) {
    const disruptionId = z.string().parse(disruptionFormData.id)
    await call<UpdateDisruptionMutation, UpdateDisruptionMutationVariables>(updateDisruption, {
      input: {
        ...input,
        id: disruptionId
      }
    })
  } else {
    await call<CreateDisruptionMutation, CreateDisruptionMutationVariables>(createDisruption, {
      input
    })
  }
}

interface UseMutationProps {
  isUpdatingDisruption: boolean
}

const useMutateDisruptionCount = ({ isUpdatingDisruption }: UseMutationProps) => {
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
    mutationFn: (disruptionFormData: IDisruptionFormState) =>
      mutateDisruptionCount({
        disruptionFormData,
        scheduleState,
        isUpdatingDisruption
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['FetchTemplates']
      })
      queryClient.invalidateQueries({
        queryKey: ['FetchDisruptionsByTemplateId']
      })
      queryClient.invalidateQueries({
        queryKey: ['FetchDisruptionsByTime']
      })
    },
    onError: (error) => console.error(error)
  })
}

export default useMutateDisruptionCount
