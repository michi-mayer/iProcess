import { getUnitId, getCurrentActiveActualCount, updateActualCountItem } from '../mapper.js'
import { IOTEvent } from '../types.js'

export const handleIOTEvent = async (event: IOTEvent) => {
  const unitId = await getUnitId(event.clientId)
  const currentActualCount = unitId ? await getCurrentActiveActualCount(unitId, event.NBTimestamp) : undefined

  if (currentActualCount) {
    return await updateActualCountItem(event.OverflowCounter, currentActualCount)
  }

  return undefined
}
