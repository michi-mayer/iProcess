import log from 'loglevel'
import { AppError, definedArray } from 'iprocess-shared'
import { getGroupingItem, deleteGroupingItem, deleteAttachedUnits } from '../mapper.js'
import { DeleteEvent } from '../types.js'

export const deleteGrouping = async ({ delete: { id } }: DeleteEvent) => {
  try {
    const grouping = await getGroupingItem(id)

    if (!grouping) {
      log.warn(`Grouping with ${id} doesn't exist!`)
      return id
    }

    const units = definedArray(grouping.units?.items)
    log.info(`Deleting grouping with ID ${id}`)

    await Promise.all([deleteGroupingItem({ id }), deleteAttachedUnits(units)])
  } catch (error) {
    throw new AppError('Unable to handle error', { error })
  }

  return id
}
