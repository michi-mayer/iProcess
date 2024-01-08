import { AppError } from 'iprocess-shared'

import {
  getGroupingItem,
  getUnitIDsByGrouping,
  updateUnits,
  updateGroupingItem,
  deleteAttachedUnits
} from '../mapper.js'
import { UpdateEvent } from '../types.js'

export const updateGrouping = async ({ put: { id, name, unitsIds, subDepartmentIds } }: UpdateEvent) => {
  try {
    const grouping = await getGroupingItem(id)

    if (!grouping) {
      throw new AppError("Grouping doesn't exist!", 204)
    }

    const groupingUnitIds = await getUnitIDsByGrouping(grouping.id)

    await Promise.all([
      updateGroupingItem({ id, groupingName: name, allowedDepartments: subDepartmentIds }),
      deleteAttachedUnits(groupingUnitIds)
    ])

    if (unitsIds.length > 0) {
      await updateUnits(id, unitsIds)
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError('Unable to handle error', { error })
  }

  return id
}
