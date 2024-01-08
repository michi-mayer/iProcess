import log from 'loglevel'

import { definedArray } from 'iprocess-shared'

import { deleteShiftModelUnitItem, deleteScheduleHourItem, deleteShiftModelItem } from '../mapper.js'
import { checkShiftModelExists } from '../utils.js'
import { DeleteEvent } from '../types.js'

export const deleteShiftModel = async ({ delete: { id } }: DeleteEvent) => {
  log.debug(`Deleting Shift model with ID ${id}`)
  
  const { units, scheduleHours } = await checkShiftModelExists(id)

  await Promise.all([
    ...definedArray(units?.items).map(async ({ id }) => await deleteShiftModelUnitItem({ id })),
    ...definedArray(scheduleHours?.items).map(async ({ id }) => await deleteScheduleHourItem({ id })),
    deleteShiftModelItem({ id })
  ])

  return id
}
