import log from 'loglevel'

import { defined, definedArray } from 'iprocess-shared'

import {
  batchDeleteCycleStations,
  batchDeleteTeams,
  deletePartUnitItem,
  deleteShiftModelUnitItem,
  deleteUnitItem,
  deleteUnitUserSettingItem,
  getCycleStationIDsByUnit,
  getTeamIDsByUnit
} from '../mapper.js'
import { checkUnitExists } from '../utils.js'
import { DeleteEvent } from '../types.js'

export const deleteUnit = async ({ delete: { id } }: DeleteEvent) => {
  const unit = await checkUnitExists(id)
  const cycleStationIDs = await getCycleStationIDsByUnit(id)
  const teamIDs = await getTeamIDsByUnit(id)
  log.info(`Deleting Unit with name ${unit.name} and ID ${unit.id} with ${cycleStationIDs.length} cycleStations`)

  const shiftModelUnitIDs = definedArray(unit.shiftModels?.items.map((_) => _?.id))
  const partUnitIDs = definedArray(unit.parts?.items.map((_) => _?.id))
  const unitUserSettingID = defined(unit.unitUserSettingId)

  await Promise.all([
    ...shiftModelUnitIDs.map(deleteShiftModelUnitItem),
    ...partUnitIDs.map(deletePartUnitItem),
    batchDeleteCycleStations(cycleStationIDs),
    batchDeleteTeams(teamIDs),
    deleteUnitUserSettingItem(unitUserSettingID),
    deleteUnitItem({ id })
  ])

  return id
}
