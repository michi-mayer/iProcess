import log from 'loglevel'

import { fromEnvironment, getCurrentDateTime } from 'iprocess-shared'
import { Unit, UnitType } from 'iprocess-shared/graphql/API.js'

import { ScanOperation, ScriptInfo, UpdateOperation, client, updateTableBuilder } from './base.js'
import { NIL, v4 as UUIDv4 } from 'uuid'

const TABLE_NAME_UNIT = fromEnvironment('API_ERFASSUNGSAPP_UNITTABLE_NAME')
const TABLE_NAME_TEAM = fromEnvironment('API_ERFASSUNGSAPP_TEAMTABLE_NAME')
const DEFAULT_TEAM_NAME = 'Default Team'

const scriptInfo: ScriptInfo = {
  tableName: TABLE_NAME_TEAM,
  version: 'v23.30.4-1',
  updatedAt: '2023-08-07'
}

interface LegacyUnit extends Unit { }

const scanUnits: ScanOperation<LegacyUnit> = async () =>
  await client.scan({
    TableName: TABLE_NAME_UNIT,
    FilterExpression: 'unitId=:unitId AND #type=:type',
    ExpressionAttributeNames: {
      '#type': 'type'
    },
    ExpressionAttributeValues: {
      ':unitId': NIL,
      ':type': UnitType.assemblyLine
    }
  })

const updateTeamItem: UpdateOperation<LegacyUnit> = async ({ id, type }) => {
  log.info(`Create Team from unit Table with id (${id}) and type (${type})`)
  const dateTime = getCurrentDateTime({ utc: true }).toISOString()

  await client.put({
    TableName: TABLE_NAME_TEAM,
    Item: {
      id: UUIDv4(),
      __typename: 'Team',
      index: 1,
      name: DEFAULT_TEAM_NAME,
      unitId: id,
      createdAt: dateTime,
      updatedAt: dateTime
    }
  })
}

export const updateTeamTable = async (persistToDB: boolean) => await updateTableBuilder(scriptInfo, scanUnits, (_) => updateTeamItem(_, persistToDB))
