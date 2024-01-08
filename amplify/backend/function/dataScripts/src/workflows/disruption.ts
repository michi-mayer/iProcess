import log from 'loglevel'

import { fromEnvironment, getCurrentDateTime } from 'iprocess-shared'
import { disruption as Disruption } from 'iprocess-shared/graphql/API.js'

import { ScanOperation, ScriptInfo, client, updateTableBuilder } from './base.js'

const TABLE_NAME_DISRUPTION = fromEnvironment('API_ERFASSUNGSAPP_DISRUPTIONTABLE_NAME')

const scriptInfo: ScriptInfo = {
  tableName: TABLE_NAME_DISRUPTION,
  version: 'v23.44.5-8',
  updatedAt: '2023-11-07'
}

const scanDisruptions: ScanOperation<Disruption> = async () => {
  const disruptions: Disruption[] = await client.scan({
    TableName: TABLE_NAME_DISRUPTION
  })

  log.info(`Number of disruptions: "${disruptions.length}"`)

  return disruptions
}

const updateDisruptionItem = async (id: string, persistToDB: boolean) => {
  if (persistToDB) {
    await client.update({
      TableName: TABLE_NAME_DISRUPTION,
      Key: { id },
      UpdateExpression: 'SET #updatedAt=:updatedAt REMOVE segmentId',
      ExpressionAttributeNames: {
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':updatedAt': getCurrentDateTime({ utc: true }).toISOString()
      }
    })
  }
  log.info(`Updating disruption with id "${id}"`)
}

export const updateDisruptionTable = async (persistToDB: boolean) =>
  await updateTableBuilder(scriptInfo, scanDisruptions, ({ id }) => updateDisruptionItem(id, persistToDB))
