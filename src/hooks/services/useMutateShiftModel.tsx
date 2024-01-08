import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ROUTER } from 'routes/routing'
import { DeleteInput, DuplicateInput, MutateShiftModelMutationVariables, ScheduleHourInput, ShiftModelInput } from 'API'
import { IShiftModel } from 'components/Dialogs/Admin/ShiftModelForm'
import { mutateShiftModel } from 'graphql/mutations'
import { getISOUtcTimeFromLocalTime } from 'helper/time'
import { convertBooleanToBool } from 'helper/utils'
import { call } from 'services/client'
import { definedArray, isDefined, WithID } from 'shared'

const buildShiftModel = ({
  id,
  name,
  isActive,
  morningShift,
  afternoonShift,
  nightShift,
  selectedUnits
}: IShiftModel): ShiftModelInput => {
  const scheduleHours = [...morningShift, ...afternoonShift, ...nightShift].map(
    ({ id, hoursStart, hoursEnd, timeZone, downtime, shiftType, type }, index): ScheduleHourInput => {
      return {
        id,
        i: index,
        hoursStartUTC: getISOUtcTimeFromLocalTime(hoursStart, timeZone),
        hoursEndUTC: getISOUtcTimeFromLocalTime(hoursEnd, timeZone),
        downtime,
        shiftType,
        timeZone,
        type
      }
    }
  )

  return {
    id,
    name,
    scheduleHours,
    isActive: convertBooleanToBool(isActive),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    unitIds: definedArray(selectedUnits.map((_) => _.id))
  }
}

const putShiftModel = async (data: IShiftModel) => {
  const input = buildShiftModel(data)
  await call<unknown, MutateShiftModelMutationVariables>(mutateShiftModel, { put: input })
}

const duplicateShiftModel = async (input: DuplicateInput) => {
  await call<unknown, MutateShiftModelMutationVariables>(mutateShiftModel, { duplicate: input })
}

const deleteShiftModel = async (input: DeleteInput) => {
  await call<unknown, MutateShiftModelMutationVariables>(mutateShiftModel, { delete: input })
}

type ShiftModelMutationType = 'put' | 'delete' | 'duplicate'

interface UseMutateShiftModelProps {
  operation: ShiftModelMutationType
  id?: string
}

const useMutateShiftModel = ({ operation, id }: UseMutateShiftModelProps) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: IShiftModel | Partial<WithID>) => {
      switch (true) {
        case operation === 'put' && 'name' in input && isDefined(input.name):
          // FIXME: Shouldn't 'input.id' and 'id' be the same in this case?
          return putShiftModel({ ...input, id })
        case operation === 'delete' && isDefined(input.id):
          return deleteShiftModel({ id: input.id })
        case operation === 'duplicate' && isDefined(input.id):
          return duplicateShiftModel({ id: input.id })
        default:
          return Promise.resolve(console.warn(`Unexpected operation ${operation} didn't meet the conditions`))
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ListShiftModels']
      })
      queryClient.invalidateQueries({
        queryKey: ['GetShiftModel', { id }]
      })
      navigate(ROUTER.ADMIN_SHIFT_MODEL_PATH)
    },
    onError: (error, data) => console.error('[useMutateShiftModel]:', error, data)
  })
}

export default useMutateShiftModel
