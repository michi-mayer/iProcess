import log from 'loglevel'

import { NoTableInfo, definedArray, removeTableInfo } from 'iprocess-shared'
import {
  ShiftModel,
  CreateShiftModelInput,
  ShiftModelUnit,
  CreateShiftModelUnitInput,
  ScheduleHour,
  CreateScheduleHourInput,
  Bool
} from 'iprocess-shared/graphql/API.js'

import { createShiftModelItem, createShiftModelUnitItem, createScheduleHourItem } from '../mapper.js'
import { checkShiftModelExists } from '../utils.js'
import { DuplicateEvent } from '../types.js'

export const toCreateShiftModel = ({ name, timeZone }: ShiftModel): CreateShiftModelInput => ({
  name: `${name}_copy`,
  isActive: Bool.no,
  timeZone
})

const toCreateShiftModelUnit = ({ unitId, shiftModelId }: ShiftModelUnit): CreateShiftModelUnitInput => ({
  unitId,
  shiftModelId
})

const toCreateScheduleHour = (_: NoTableInfo<ScheduleHour>): CreateScheduleHourInput => _

export const duplicateShiftModel = async ({ duplicate: { id: sourceID } }: DuplicateEvent) => {
  log.debug(`Duplicating Shift Model with ID ${sourceID}`)

  const { units, scheduleHours, ...shiftModel } = await checkShiftModelExists(sourceID)

  const newID = await createShiftModelItem(toCreateShiftModel(shiftModel))

  const newUnits = definedArray(units?.items).map((_) => toCreateShiftModelUnit({ ..._, shiftModelId: newID }))
  const newSchedules = definedArray(scheduleHours?.items).map((_) =>
    toCreateScheduleHour(removeTableInfo({ ..._, shiftModelId: newID }))
  )

  await Promise.all([...newUnits.map(createShiftModelUnitItem), ...newSchedules.map(createScheduleHourItem)])

  return newID
}
