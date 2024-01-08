import { fromEnvironment, getCurrentDateTime, toNumber } from 'iprocess-shared'
import { Configuration, UpdateConfigurationInput } from 'iprocess-shared/graphql/API.js'

import { ScanOperation, ScriptInfo, UpdateOperation, client, updateTableBuilder } from './base.js'

const TABLE_NAME = fromEnvironment('API_ERFASSUNGSAPP_CONFIGURATIONTABLE_NAME')

const scriptInfo: ScriptInfo = {
  tableName: TABLE_NAME,
  version: 'v23.8.1-5',
  updatedAt: '2023-05-11'
}

interface LegacyConfiguration extends Configuration { }

const scanConfigurations: ScanOperation<LegacyConfiguration> = async () => await client.scan({ TableName: TABLE_NAME })

const toValidItem = ({ cycleTime, shiftTarget, ...rest }: LegacyConfiguration): UpdateConfigurationInput => ({
  ...rest,
  shiftTarget,
  cycleTime: toNumber(cycleTime),
  target: shiftTarget
})

const updateConfigurationItem: UpdateOperation<LegacyConfiguration> = async (configuration) => {
  const { id, cycleTime, target } = toValidItem(configuration)

  await client.update<UpdateConfigurationInput>({
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set cycleTime=:cycleTime, target=:target, #updatedAt=:updatedAt',
    ExpressionAttributeNames: {
      '#updatedAt': 'updatedAt'
    },
    ExpressionAttributeValues: {
      ':cycleTime': cycleTime,
      ':target': target,
      ':updatedAt': getCurrentDateTime({ utc: true }).toISOString()
    }
  })
}

export const updateConfigurationTable = async (persistToDB: boolean) =>
  await updateTableBuilder(scriptInfo, scanConfigurations, (_) => updateConfigurationItem(_, persistToDB))
