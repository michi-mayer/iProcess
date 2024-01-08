import { difference } from 'remeda'
import { listAvailableMachines, listUsedMachines } from '../mapper.js'

export const handleAppSyncEvent = async () => {
  const availableMachines = await listAvailableMachines()
  const usedMachines = await listUsedMachines()

  return difference(availableMachines, usedMachines)
}
