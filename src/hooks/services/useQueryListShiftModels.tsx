import { useQuery } from '@tanstack/react-query'
import { Get } from 'type-fest'
import { UnitBasicInfoSchema } from 'zodSchemas'
import { Shift, ShiftModelsWithUnitQuery, Type } from 'API'
import { IScheduleHour, IShiftModel } from 'components/Dialogs/Admin/ShiftModelForm'
import { shiftModelsWithUnit } from 'graphql/queriesCustom'
import { sortByDate } from 'helper/sortData'
import { getLocalTimeFromISOUtc } from 'helper/time'
import { convertBoolToBoolean } from 'helper/utils'
import { call } from 'services/client'
import { definedArray } from 'shared'

type ShiftModel = NonNullable<Get<ShiftModelsWithUnitQuery, ['listShiftModels', 'items', '0']>>
type ScheduleHour = NonNullable<
  Get<ShiftModelsWithUnitQuery, ['listShiftModels', 'items', '0', 'scheduleHours', 'items', '0']>
>

export const getShiftsFromShiftModelQuery = (scheduleHours: ScheduleHour[]) => {
  const morningShift: IScheduleHour[] = []
  const afternoonShift: IScheduleHour[] = []
  const nightShift: IScheduleHour[] = []

  scheduleHours?.sort((a, b) => {
    if ((a?.i ?? 0) < (b?.i ?? 0)) {
      return -1
    }
    if ((a?.i ?? 0) > (b?.i ?? 0)) {
      return 1
    }
    return 0
  })

  for (const scheduleHour of scheduleHours) {
    const newMorningShift = {
      id: scheduleHour?.id ?? '',
      hoursStart: getLocalTimeFromISOUtc({
        time: scheduleHour?.hoursStartUTC ?? '',
        timeZone: scheduleHour?.timeZone ?? '',
        isAdminApp: true,
        shouldReadOffSet: true
      }),
      hoursEnd: getLocalTimeFromISOUtc({
        time: scheduleHour?.hoursEndUTC ?? '',
        timeZone: scheduleHour?.timeZone ?? '',
        isAdminApp: true,
        shouldReadOffSet: true
      }),
      i: scheduleHour?.i,
      type: scheduleHour?.type ?? Type.Inactive,
      shiftType: scheduleHour?.shiftType,
      timeZone: scheduleHour?.timeZone ?? '',
      downtime: scheduleHour?.downtime ?? undefined
    }
    if (scheduleHour?.shiftType === Shift.morningShift) {
      morningShift.push(newMorningShift)
    }
    if (scheduleHour?.shiftType === Shift.afternoonShift) {
      afternoonShift.push(newMorningShift)
    }
    if (scheduleHour?.shiftType === Shift.nightShift) {
      nightShift.push(newMorningShift)
    }
  }

  return { morningShift, afternoonShift, nightShift }
}

export const parseShiftModel = (shiftModel: ShiftModel): IShiftModel => {
  const { morningShift, afternoonShift, nightShift } = getShiftsFromShiftModelQuery(
    definedArray(shiftModel.scheduleHours?.items)
  )
  const selectedUnits = definedArray(shiftModel?.units?.items).map(({ unit }) =>
    UnitBasicInfoSchema.parse({
      id: unit?.id,
      name: unit?.name,
      type: unit?.type,
      shortName: unit?.shortName ?? ''
    })
  )

  return {
    selectedUnits,
    morningShift,
    afternoonShift,
    nightShift,
    id: shiftModel?.id,
    name: shiftModel?.name,
    timeZone: shiftModel?.timeZone,
    createdAt: shiftModel?.createdAt,
    updatedAt: shiftModel?.updatedAt,
    isActive: convertBoolToBoolean(shiftModel?.isActive)
  }
}

export const fetchShiftModelList = async () => {
  const response = await call<ShiftModelsWithUnitQuery>(shiftModelsWithUnit)
  const { nextToken, items } = response.data?.listShiftModels ?? {}

  return { items: sortByDate(definedArray(items).map((_) => parseShiftModel(_))), nextToken }
}

const useQueryListShiftModels = () => {
  return useQuery({
    queryKey: ['ListShiftModels'],
    queryFn: fetchShiftModelList,
    throwOnError: true
  })
}

export default useQueryListShiftModels
