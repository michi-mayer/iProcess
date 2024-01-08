import log from 'loglevel'

import { WithID, compareItems, getCurrentDateTime } from 'iprocess-shared'
import {
  CreateCycleStationInput,
  CycleStationInput,
  TeamsInput,
  UnitType,
  UpdateCycleStationInput
} from 'iprocess-shared/graphql/API.js'

import { UpdateEvent } from '../types.js'
import {
  batchCreateCycleStations,
  batchDeleteCycleStations,
  batchDeleteTeams,
  batchUpdateCycleStations,
  getCycleStationIDsByTeam,
  getCycleStationIDsByUnit,
  getTeamIDs,
  updateUnitItem,
  createTeamItems,
  updateTeamItem,
  batchUpdateTemplates,
  getTemplatesIDsWithOriginatorId
} from '../mapper.js'

interface WithUnitID {
  unitId: string
}

// ! FIX: tried to do this with function overload, but the method compareItems is not infering the types correctly for the first param
const addCreateTeamItem = (item: TeamsInput, attributes: WithUnitID): TeamsInput => ({
  ...item,
  ...attributes
})
const addCreateCycleStationItem = (
  item: CycleStationInput,
  attributes: WithUnitID
): CreateCycleStationInput & WithID => ({
  ...item,
  ...attributes
})
const addUpdateTeamItem = (item: TeamsInput, attributes: WithUnitID, { id }: WithID): TeamsInput => {
  return {
    ...item,
    ...attributes,
    id
  }
}
const addUpdateCycleStationItem = (
  item: CycleStationInput,
  attributes: WithUnitID,
  { id }: WithID
): UpdateCycleStationInput => ({
  ...item,
  ...attributes,
  id
})

export const updateTeamItems = async (teams: TeamsInput[], unitId: string, now: string) =>
  await Promise.all(
    teams.map(async ({ id, cycleStations, ...restOfInput }) => {
      await updateTeamItem({ ...restOfInput, unitId, id })
      const itemsFromDatabase = await getCycleStationIDsByTeam(id)
      const { itemsToCreate, itemsToUpdate, itemsToDelete } = compareItems(
        cycleStations,
        itemsFromDatabase,
        { unitId },
        addCreateCycleStationItem,
        addUpdateCycleStationItem
      )

      log.debug('CycleStations to create: ', { itemsToCreate })
      log.debug('CycleStations to update: ', { itemsToUpdate })
      log.debug('CycleStations to delete: ', { itemsToDelete })

      await Promise.all([
        batchCreateCycleStations(
          itemsToCreate.map((_) => ({
            ..._,
            __typename: 'CycleStation',
            teamId: id,
            unitId,
            createdAt: now,
            updatedAt: now
          }))
        ),
        batchUpdateCycleStations(
          itemsToUpdate.map((_) => ({
            ..._,
            __typename: 'CycleStation',
            teamId: id,
            unitId,
            createdAt: now,
            updatedAt: now
          }))
        ),
        batchDeleteCycleStations(itemsToDelete)
      ])
    })
  )

export const updateUnit = async ({ put: { cycleStations, teams, ...unit } }: UpdateEvent) => {
  log.info(`Updating Unit with name ${unit.name} and ID ${unit.id} with ${cycleStations.length} cycleStations`)
  const now = getCurrentDateTime({ utc: true }).toISOString()

  if (unit.type === UnitType.productionUnit) {
    const itemsFromDatabase = await getCycleStationIDsByUnit(unit.id)

    // * Cycle stations to create, update, and delete
    const { itemsToCreate, itemsToUpdate, itemsToDelete } = compareItems(
      cycleStations,
      itemsFromDatabase,
      { unitId: unit.id },
      addCreateCycleStationItem,
      addUpdateCycleStationItem
    )

    log.debug('CycleStations to create: ', { itemsToCreate })
    log.debug('CycleStations to update: ', { itemsToUpdate })
    log.debug('CycleStations to delete: ', { itemsToDelete })

    await Promise.all([
      updateUnitItem(unit),
      batchCreateCycleStations(
        itemsToCreate.map((_) => ({ ..._, __typename: 'CycleStation', createdAt: now, updatedAt: now }))
      ),
      batchUpdateCycleStations(
        itemsToUpdate.map((_) => ({ ..._, __typename: 'CycleStation', createdAt: now, updatedAt: now }))
      ),
      batchDeleteCycleStations(itemsToDelete)
    ])
  } else {
    const teamItemsFromDatabase = await getTeamIDs(unit.id)
    // * Teams to create, update, and delete
    const { itemsToCreate, itemsToUpdate, itemsToDelete } = compareItems(
      teams,
      teamItemsFromDatabase,
      { unitId: unit.id },
      addCreateTeamItem,
      addUpdateTeamItem
    )
    const cycleStationsToDelete = await Promise.all(
      itemsToDelete.map(async (team) => await getCycleStationIDsByTeam(team.id))
    )
    log.debug('Teams to create: ', { itemsToCreate })
    log.debug('Teams to update: ', { itemsToUpdate })
    log.debug('Teams to delete: ', { itemsToDelete })

    const templatesIDs = await getTemplatesIDsWithOriginatorId(unit.id, itemsToDelete)

    log.debug('Templates to update', { templatesIDs })

    await Promise.all([
      updateUnitItem(unit),
      createTeamItems(itemsToCreate, unit.id, now),
      updateTeamItems(itemsToUpdate, unit.id, now),
      batchDeleteTeams(itemsToDelete),
      batchUpdateTemplates(templatesIDs),
      batchDeleteCycleStations(cycleStationsToDelete.flat())
    ])
  }
  return unit.id
}
