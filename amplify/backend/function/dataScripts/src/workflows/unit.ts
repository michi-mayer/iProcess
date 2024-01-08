import log from 'loglevel'

import { fromEnvironment, getCurrentDateTime } from 'iprocess-shared'
import { Unit, UpdateUnitInput } from 'iprocess-shared/graphql/API.js'

import { ScanOperation, ScriptInfo, client, updateTableBuilder } from './base.js'

const TABLE_NAME = fromEnvironment('API_ERFASSUNGSAPP_UNITTABLE_NAME')

const scriptInfo: ScriptInfo = {
  tableName: TABLE_NAME,
  version: 'v23.44.5-8',
  updatedAt: '2023-11-07'
}

const scanUnits: ScanOperation<Unit> = async () => {
  const units: Unit[] = await client.scan({
    TableName: TABLE_NAME
  })

  log.info(`Number of units: "${units.length}"`)

  return units
}

const updateUnitItem = async (id: string, persistToDB: boolean) => {
  if (persistToDB) {
    await client.update<UpdateUnitInput>({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: 'SET #updatedAt=:updatedAt REMOVE isActive',
      ExpressionAttributeNames: {
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':updatedAt': getCurrentDateTime({ utc: true }).toISOString()
      }
    })
  }

  log.info(`Updating unit with id "${id}"`)
}

export const updateUnitTable = async (persistToDB: boolean) =>
  await updateTableBuilder(scriptInfo, scanUnits, ({ id }) => updateUnitItem(id, persistToDB))
