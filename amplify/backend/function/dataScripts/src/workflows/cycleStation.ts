import log from 'loglevel'

import { fromEnvironment, getCurrentDateTime, prettify } from 'iprocess-shared'
import { CycleStation, Team, Unit, UnitType } from 'iprocess-shared/graphql/API.js'

import { ScanOperation, ScriptInfo, UpdateOperation, client, updateTableBuilder } from './base.js'
import { NIL } from 'uuid'

const TABLE_NAME_UNIT = fromEnvironment('API_ERFASSUNGSAPP_UNITTABLE_NAME')
const TABLE_NAME_CYCLESTATION = fromEnvironment('API_ERFASSUNGSAPP_CYCLESTATIONTABLE_NAME')
const TABLE_NAME_TEAM = fromEnvironment('API_ERFASSUNGSAPP_TEAMTABLE_NAME')

const scriptInfo: ScriptInfo = {
  tableName: TABLE_NAME_CYCLESTATION,
  version: 'v23.28.4-3',
  updatedAt: '2023-07-26'
}

interface LegacyUnit extends Unit { }

type BaseTeam = Omit<Team, 'cycleStations' | 'unit' | 'templates'>

const scanUnits: ScanOperation<LegacyUnit> = async () =>
  await client.scan({
    TableName: TABLE_NAME_UNIT,
    FilterExpression: 'unitId=:unitId, type=:type',
    ExpressionAttributeValues: {
      ':unitId': NIL,
      ':type': UnitType.assemblyLine
    }
  })

// TODO figure out a better way to pass parameters instead of typing it as unknown
const scanCycleStations: ScanOperation<CycleStation> = async (unitId: unknown) =>
  await client.scan({
    TableName: TABLE_NAME_CYCLESTATION,
    FilterExpression: 'unitId=:unitId',
    ExpressionAttributeValues: {
      ':unitId': unitId
    }
  })

const scanTeams: ScanOperation<BaseTeam> = async (unitId: unknown) =>
  await client.scan({
    TableName: TABLE_NAME_TEAM,
    FilterExpression: 'unitId=:unitId AND #name=:name',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':unitId': unitId,
      ':name': 'Default Team'
    }
  })

const updateCycleStationItem: UpdateOperation<LegacyUnit> = async ({ id }) => {
  const dateTime = getCurrentDateTime({ utc: true }).toISOString()
  const teams = await scanTeams(id)
  const defaultTeam = teams[0]
  const cycleStations = await scanCycleStations(id)

  log.info(
    `Adding teamId "${defaultTeam?.id}" to cyclestation table from unit ${id}`,
    prettify(cycleStations)
  )

  await client.batchUpdateOrDelete(
    TABLE_NAME_CYCLESTATION,
    cycleStations.map((_) => ({ PutRequest: { Item: { ..._, teamId: defaultTeam?.id, updatedAt: dateTime } } }))
  )
}

export const updateCycleStationTable = async (persistToDB: boolean) =>
  await updateTableBuilder(scriptInfo, scanUnits, (_) => updateCycleStationItem(_, persistToDB))
