import log from 'loglevel'

import { CreateUnitInput, UnitType } from 'iprocess-shared/graphql/API.js'

import { batchCreateCycleStations, createTeamItems, createUnitItem, createUnitUserSettingItem } from '../mapper.js'
import { CreateEvent } from '../types.js'
import { getCurrentDateTime } from 'iprocess-shared'

const buildCreateUnitInput = (
  name: string,
  shortName: string,
  type: UnitType,
  machineId: string,
  otherFields: Partial<Omit<CreateUnitInput, 'id'>>
): CreateUnitInput => ({
  ...otherFields,
  shortName,
  type,
  name,
  machineId
})

export const createUnit = async ({ put: { cycleStations, teams, ...unit } }: CreateEvent) => {
  log.info(`Creating new Unit with name ${unit.name} with ${cycleStations.length} cycle stations`)
  const now = getCurrentDateTime({ utc: true }).toISOString()

  const unitUserSettingId = await createUnitUserSettingItem()
  const unitId = await createUnitItem(
    buildCreateUnitInput(unit.name, unit.shortName, unit.type, unit.machineId, { ...unit, unitUserSettingId })
  )

  if (unit.type === UnitType.productionUnit) {
    await batchCreateCycleStations(
      cycleStations.map((_) => ({ ..._, unitId, __typename: 'CycleStation', createdAt: now, updatedAt: now }))
    )
  } else {
    await createTeamItems(teams, unitId, now)
  }

  return unitId
}
