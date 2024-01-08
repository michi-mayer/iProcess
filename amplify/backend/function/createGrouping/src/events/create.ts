import log from 'loglevel'
import { AppError } from 'iprocess-shared'
import { createGroupingItem, updateUnitsWithGroupingId } from '../mapper.js'
import { CreateEvent } from '../types.js'

export const createGrouping = async ({ put: { name, subDepartmentIds, unitsIds } }: CreateEvent) => {
  try {
    log.info(`Creating new Groping with name ${name} with ${unitsIds?.length} units`)
    const groupingId = await createGroupingItem({ groupingName: name, allowedDepartments: subDepartmentIds })

    if (unitsIds && unitsIds.length > 0) {
      await updateUnitsWithGroupingId(groupingId, unitsIds)
    }

    return groupingId
  } catch (error) {
    throw new AppError('Unable to handle error', { error })
  }
}
