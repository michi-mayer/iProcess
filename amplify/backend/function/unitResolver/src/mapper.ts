import { Get } from 'type-fest'

import {
  defined,
  AppSyncClient,
  getScanParameters,
  DynamoDBClient,
  fromEnvironment,
  TableInfo,
  getCurrentDateTime,
  WithID
} from 'iprocess-shared'
import {
  Bool,
  CreateUnitInput,
  CreateUnitMutation,
  CreateUnitMutationVariables,
  CreateUnitUserSettingMutation,
  CreateUnitUserSettingMutationVariables,
  CycleStationsByUnitIdQuery,
  CycleStationsByUnitIdQueryVariables,
  DeletePartUnitMutationVariables,
  DeleteShiftModelUnitMutationVariables,
  DeleteUnitInput,
  DeleteUnitMutationVariables,
  DeleteUnitUserSettingMutationVariables,
  GetUnitQuery,
  GetUnitQueryVariables,
  ListPartUnitsQuery,
  ListPartUnitsQueryVariables as ListPartUnitsVariables,
  ListShiftModelUnitsQuery,
  ListShiftModelUnitsQueryVariables as ListShiftModelUnitsVariables,
  UpdateUnitInput,
  UpdateUnitMutationVariables,
  CreateCycleStationInput,
  UpdateCycleStationInput,
  DeleteCycleStationInput,
  CycleStationsByUnitQueryVariables,
  CycleStationsByUnitQuery,
  CreateTeamMutation,
  CreateTeamMutationVariables,
  CreateTeamInput,
  TeamsByUnitIdQuery,
  TeamsByUnitIdQueryVariables,
  CycleStationsByTeamIdQuery,
  CycleStationsByTeamIdQueryVariables,
  DeleteTeamInput,
  TeamsInput,
  UpdateTeamInput,
  UpdateTeamMutation,
  UpdateTeamMutationVariables,
  GetCompleteUnitQueryVariables,
  GetCompleteUnitQuery,
  TemplatesByUnitQuery,
  TemplatesByUnitQueryVariables
} from 'iprocess-shared/graphql/index.js'
import {
  listPartUnits,
  getUnit,
  listShiftModelUnits,
  cycleStationsByUnit,
  cycleStationsByUnitId,
  teamsByUnitId,
  cycleStationsByTeamId,
  getCompleteUnit,
  templatesByUnit
} from 'iprocess-shared/graphql/queries/index.js'
import {
  createTeam,
  createUnit,
  createUnitUserSetting,
  deletePartUnit,
  deleteShiftModelUnit,
  deleteUnit,
  deleteUnitUserSetting,
  updateTeam,
  updateUnit
} from 'iprocess-shared/graphql/mutations/index.js'

type TeamByUnitIDValues = Get<TeamsByUnitIdQuery, ['teamsByUnit', 'items', '0']>
type TemplatesByUnitValues = Get<TemplatesByUnitQuery, ['listTemplatesByUnit', 'items', '0']>
type CycleStationsByTeamIDValues = Get<CycleStationsByTeamIdQuery, ['cycleStationsByTeam', 'items', '0']>
type CycleStationsByUnitIDValues = Get<CycleStationsByUnitIdQuery, ['cycleStationsByUnit', 'items', '0']>
type CycleStationsValues = Get<CycleStationsByUnitQuery, ['cycleStationsByUnit', 'items', '0']>
type ListPartUnitsValues = Get<ListPartUnitsQuery, ['listPartUnits', 'items', '0']>
type ListShiftModelUnitsValues = Get<ListShiftModelUnitsQuery, ['listShiftModelUnits', 'items', '0']>

const CYCLESTATION_TABLE = fromEnvironment('API_ERFASSUNGSAPP_CYCLESTATIONTABLE_NAME')
const TEAM_TABLE = fromEnvironment('API_ERFASSUNGSAPP_TEAMTABLE_NAME')
const DISRUPTION_TABLE = fromEnvironment('API_ERFASSUNGSAPP_DISRUPTIONTABLE_NAME')

const connector = {
  appsync: new AppSyncClient(),
  dynamo: new DynamoDBClient()
}

// ? Unit table

export const getUnitItem = async (id: string) => {
  const response = await connector.appsync.get<GetCompleteUnitQuery, GetCompleteUnitQueryVariables>(getCompleteUnit, {
    id
  })
  return response.getUnit
}

export const getUnitWithCycleStationIds = async (unitId: string) => {
  const getUnitVariables = { id: unitId }
  const unitResponse = await connector.appsync.get<GetUnitQuery, GetUnitQueryVariables>(getUnit, getUnitVariables)
  const unit = defined(unitResponse?.getUnit)

  const cycleStations = await connector.appsync.scan<
    CycleStationsByUnitQuery,
    CycleStationsByUnitQueryVariables,
    CycleStationsValues
  >(cycleStationsByUnit, getScanParameters, { unitId: unit.id })
  const cycleStationIds = cycleStations.map((_) => _.id)

  return { unit: { id: unit.id, unitUserSettingId: defined(unit.unitUserSettingId) }, cycleStationIds }
}

export const getCycleStationIDsByUnit = async (unitId: string) => {
  const response = await connector.appsync.scan<
    CycleStationsByUnitIdQuery,
    CycleStationsByUnitIdQueryVariables,
    CycleStationsByUnitIDValues
  >(cycleStationsByUnitId, getScanParameters, { unitId })
  return response.map(({ id }) => ({ id }))
}
export const getCycleStationIDsByTeam = async (teamId: string) => {
  const response = await connector.appsync.scan<
    CycleStationsByTeamIdQuery,
    CycleStationsByTeamIdQueryVariables,
    CycleStationsByTeamIDValues
  >(cycleStationsByTeamId, getScanParameters, { teamId })
  return response.map(({ id }) => ({ id }))
}
export const getTeamIDsByUnit = async (unitId: string) => {
  const response = await connector.appsync.scan<TeamsByUnitIdQuery, TeamsByUnitIdQueryVariables, TeamByUnitIDValues>(
    teamsByUnitId,
    getScanParameters,
    { unitId }
  )
  return response.map(({ id }) => ({ id }))
}
export const getTeamIDs = async (unitId: string) => {
  const response = await connector.appsync.scan<TeamsByUnitIdQuery, TeamsByUnitIdQueryVariables, TeamByUnitIDValues>(
    teamsByUnitId,
    getScanParameters,
    { unitId }
  )
  return response.map(({ id }) => ({ id }))
}

export const getTemplatesIDsWithOriginatorId = async (unitId: string, originators: WithID[]) => {
  const results = await Promise.all(
    originators.map(async (originator) => {
      return await connector.appsync.scan<TemplatesByUnitQuery, TemplatesByUnitQueryVariables, TemplatesByUnitValues>(
        templatesByUnit,
        getScanParameters,
        {
          unitId,
          filter: {
            deleted: { eq: Bool.no },
            originatorId: { eq: originator.id }
          },
          template: { eq: Bool.yes }
        }
      )
    })
  )

  return results.flat().map(({ id }) => ({ id }))
}

export const createUnitItem = async (input: CreateUnitInput) => {
  const createUnitResponse = await connector.appsync.mutate<CreateUnitMutation, CreateUnitMutationVariables>(
    createUnit,
    {
      input
    }
  )

  return defined(createUnitResponse?.createUnit?.id)
}

export const createTeamItem = async (input: CreateTeamInput) => {
  const createTeamResponse = await connector.appsync.mutate<CreateTeamMutation, CreateTeamMutationVariables>(
    createTeam,
    {
      input
    }
  )
  return defined(createTeamResponse?.createTeam?.id)
}

export const updateTeamItem = async (input: UpdateTeamInput) => {
  return await connector.appsync.mutate<UpdateTeamMutation, UpdateTeamMutationVariables>(updateTeam, {
    input
  })
}

export const createTeamItems = async (teams: TeamsInput[], unitId: string, now: string) =>
  await Promise.all(
    teams.map(async ({ cycleStations, id: _id, ...restOfInput }) => {
      const teamId = await createTeamItem({ ...restOfInput, unitId })
      await batchCreateCycleStations(
        cycleStations.map((_) => ({ ..._, teamId, unitId, __typename: 'CycleStation', createdAt: now, updatedAt: now }))
      )
    })
  )

export const batchDeleteTeams = async (input: DeleteTeamInput[]) =>
  await connector.dynamo.batchUpdateOrDelete(
    TEAM_TABLE,
    input.map((_) => ({
      DeleteRequest: {
        Key: _
      }
    }))
  )

export const batchUpdateTemplates = async (templatesIDs: WithID[]) => {
  const now = getCurrentDateTime({ utc: true })
  const statements = templatesIDs.map(({ id }) => ({
    Statement: `UPDATE "${DISRUPTION_TABLE}" SET "deleted"='yes' SET "updatedAt"='${now.toISOString()}' WHERE "id"='${id}'`
  }))
  await connector.dynamo.batchExecute(statements)
}

export const updateUnitItem = async (input: UpdateUnitInput) =>
  await connector.appsync.mutate<unknown, UpdateUnitMutationVariables>(updateUnit, { input })

export const deleteUnitItem = async (input: DeleteUnitInput) =>
  await connector.appsync.mutate<unknown, DeleteUnitMutationVariables>(deleteUnit, { input })

export const batchCreateCycleStations = async (input: (CreateCycleStationInput & TableInfo<'CycleStation'>)[]) =>
  await connector.dynamo.batchUpdateOrDelete(
    CYCLESTATION_TABLE,
    input.map((_) => ({ PutRequest: { Item: _ } }))
  )

export const batchUpdateCycleStations = async (input: (UpdateCycleStationInput & TableInfo<'CycleStation'>)[]) =>
  await connector.dynamo.batchUpdateOrDelete(
    CYCLESTATION_TABLE,
    input.map((_) => ({ PutRequest: { Item: _ } }))
  )

export const batchDeleteCycleStations = async (input: DeleteCycleStationInput[]) =>
  await connector.dynamo.batchUpdateOrDelete(
    CYCLESTATION_TABLE,
    input.map((_) => ({
      DeleteRequest: {
        Key: _
      }
    }))
  )

// ? UnitUserSetting table

export const createUnitUserSettingItem = async () => {
  const response = await connector.appsync.mutate<
    CreateUnitUserSettingMutation,
    CreateUnitUserSettingMutationVariables
  >(createUnitUserSetting, {
    input: {
      replacer: Bool.no
    }
  })

  return defined(response?.createUnitUserSetting?.id)
}

export const deleteUnitUserSettingItem = async (id: string) =>
  await connector.appsync.mutate<unknown, DeleteUnitUserSettingMutationVariables>(deleteUnitUserSetting, {
    input: { id }
  })

// ? PartUnit table

export const listPartUnitIds = async (unitId: string) => {
  const variables = { filter: { unitId: { eq: unitId } } }
  const items = await connector.appsync.scan<ListPartUnitsQuery, ListPartUnitsVariables, ListPartUnitsValues>(
    listPartUnits,
    getScanParameters,
    variables
  )

  return items.map((_) => _.id)
}

export const deletePartUnitItem = async (id: string) =>
  await connector.appsync.mutate<unknown, DeletePartUnitMutationVariables>(deletePartUnit, { input: { id } })

// ? ShiftModelUnit table

export const listShiftModelUnitIds = async (unitId: string) => {
  const variables = { filter: { unitId: { eq: unitId } } }
  const items = await connector.appsync.scan<
    ListShiftModelUnitsQuery,
    ListShiftModelUnitsVariables,
    ListShiftModelUnitsValues
  >(listShiftModelUnits, getScanParameters, variables)

  return items.map((_) => _.id)
}

export const deleteShiftModelUnitItem = async (id: string) =>
  await connector.appsync.mutate<unknown, DeleteShiftModelUnitMutationVariables>(deleteShiftModelUnit, {
    input: { id }
  })
