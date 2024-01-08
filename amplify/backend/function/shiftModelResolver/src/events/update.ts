import log from 'loglevel'

import { WithID, compareItems, definedArray } from 'iprocess-shared'

import {
  CreateShiftModelUnitInput,
  UpdateShiftModelUnitInput,
  ShiftModelUnit,
  ScheduleHourInput,
  CreateScheduleHourInput,
  UpdateScheduleHourInput
} from 'iprocess-shared/graphql/API.js'

import {
  createShiftModelUnitItem,
  updateShiftModelUnitItem,
  deleteShiftModelUnitItem,
  createScheduleHourItem,
  updateScheduleHourItem,
  deleteScheduleHourItem,
  updateShiftModelItem
} from '../mapper.js'
import { checkShiftModelExists } from '../utils.js'
import { UpdateEvent } from '../types.js'

interface WithShiftModelID {
  shiftModelId: string
}

interface WithUnitID {
  unitId: string
}

const addCreateShiftModelUnitItem = (item: WithUnitID, attributes: WithShiftModelID): CreateShiftModelUnitInput => ({
  ...item,
  ...attributes
})

const addUpdateShiftModelUnitItem = (
  item: WithUnitID,
  attributes: WithShiftModelID,
  { id }: WithID
): UpdateShiftModelUnitInput => ({ ...item, ...attributes, id })

const updateShiftModelUnitItems = async (
  unitIds: WithUnitID[],
  units: ShiftModelUnit[],
  attributes: WithShiftModelID
) => {
  const { itemsToCreate, itemsToUpdate, itemsToDelete } = compareItems(
    unitIds,
    units,
    attributes,
    addCreateShiftModelUnitItem,
    addUpdateShiftModelUnitItem,
    ({ unitId }, items) => items.find((_) => _.unitId === unitId)
  )

  log.debug('ShiftModelUnits to create: ', JSON.stringify(itemsToCreate))
  log.debug('ShiftModelUnits to update: ', JSON.stringify(itemsToUpdate))
  log.debug('ShiftModelUnits to delete: ', JSON.stringify(itemsToDelete))

  await Promise.all([
    ...itemsToCreate.map(createShiftModelUnitItem),
    ...itemsToUpdate.map(updateShiftModelUnitItem),
    ...itemsToDelete.map(deleteShiftModelUnitItem)
  ])
}

const addCreateScheduleHourItem = (item: ScheduleHourInput, attributes: WithShiftModelID): CreateScheduleHourInput => ({
  ...item,
  ...attributes
})

const addUpdateScheduleHourItem = (
  item: ScheduleHourInput,
  attributes: WithShiftModelID,
  { id }: WithID
): UpdateScheduleHourInput => ({ ...item, ...attributes, id })

const updateScheduleHourItems = async (
  itemsFromClient: ScheduleHourInput[],
  itemsInDatabase: WithID[],
  attributes: WithShiftModelID
) => {
  const { itemsToCreate, itemsToUpdate, itemsToDelete } = compareItems(
    itemsFromClient,
    itemsInDatabase,
    attributes,
    addCreateScheduleHourItem,
    addUpdateScheduleHourItem
  )

  log.debug('ShiftModelUnits to create: ', JSON.stringify(itemsToCreate))
  log.debug('ShiftModelUnits to update: ', JSON.stringify(itemsToUpdate))
  log.debug('ShiftModelUnits to delete: ', JSON.stringify(itemsToDelete))

  await Promise.all([
    ...itemsToCreate.map(createScheduleHourItem),
    ...itemsToUpdate.map(updateScheduleHourItem),
    ...itemsToDelete.map(deleteScheduleHourItem)
  ])
}

export const updateShiftModel = async ({ put: { unitIds, scheduleHours, id, ...rest } }: UpdateEvent) => {
  log.debug(`Updating Shift model with ID ${id}: ${JSON.stringify(rest)}`)

  const shiftModelFromDatabase = await checkShiftModelExists(id)

  const unitsFromClient = unitIds.map((unitId) => ({ unitId }))
  const unitsFromDatabase = definedArray(shiftModelFromDatabase.units?.items)
  const scheduleHoursFromDatabase = definedArray(shiftModelFromDatabase.scheduleHours?.items)

  await Promise.all([
    updateShiftModelUnitItems(unitsFromClient, unitsFromDatabase, { shiftModelId: id }),
    updateScheduleHourItems(scheduleHours, scheduleHoursFromDatabase, { shiftModelId: id }),
    updateShiftModelItem({ id, ...rest})
  ])

  return id
}
