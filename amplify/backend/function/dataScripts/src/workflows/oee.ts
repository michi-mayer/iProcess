import { fromEnvironment, getCurrentDateTime, toNumber } from 'iprocess-shared'
import { OEE, UpdateOEEInput } from 'iprocess-shared/graphql/API.js'

import { ScanOperation, ScriptInfo, UpdateOperation, client, updateTableBuilder } from './base.js'

const TABLE_NAME = fromEnvironment('API_ERFASSUNGSAPP_OEETABLE_NAME')

const scriptInfo: ScriptInfo = {
  tableName: TABLE_NAME,
  version: 'v23.8.1-5',
  updatedAt: '2023-05-11'
}

interface LegacyOEE extends OEE { }

interface UpdateOEEWithIndexesInput extends UpdateOEEInput {
  'startTimeDateUTC#endTimeDateUTC': string
}
const scanOEEs: ScanOperation<LegacyOEE> = async () => await client.scan({ TableName: TABLE_NAME })

const toValidItem = ({ availability, overall, performance, quality, startTimeDateUTC, endTimeDateUTC, ...rest }: LegacyOEE): UpdateOEEWithIndexesInput => ({
  ...rest,
  availability: toNumber(availability),
  performance: toNumber(performance),
  quality: toNumber(quality),
  overall: toNumber(overall),
  'startTimeDateUTC#endTimeDateUTC': `${startTimeDateUTC}#${endTimeDateUTC}`
})

const updateOEEItem: UpdateOperation<LegacyOEE> = async (oee) => {
  const { id, availability, performance, quality, overall, ..._ } = toValidItem(oee)

  await client.update({
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression:
      'set availability=:availability, overall=:overall, performance=:performance, quality=:quality, #indexCol=:indexCol, #updatedAt=:updatedAt',
    ExpressionAttributeNames: {
      '#updatedAt': 'updatedAt',
      '#indexCol': 'startTimeDateUTC#endTimeDateUTC'
    },
    ExpressionAttributeValues: {
      ':availability': availability,
      ':overall': overall,
      ':performance': performance,
      ':quality': quality,
      ':indexCol': _['startTimeDateUTC#endTimeDateUTC'],
      ':updatedAt': getCurrentDateTime({ utc: true }).toISOString()
    }
  })
}

export const updateOEETable = async (persistToDB: boolean) =>
  await updateTableBuilder(scriptInfo, scanOEEs, (_) => updateOEEItem(_, persistToDB))

