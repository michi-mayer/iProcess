import log from 'loglevel'

import { fromEnvironment } from 'iprocess-shared'

import { ScriptInfo } from './base.js'

const TABLE_NAME = fromEnvironment('API_ERFASSUNGSAPP_DEFECTIVETABLE_NAME')

const scriptInfo: ScriptInfo = {
  tableName: TABLE_NAME,
  version: 'v23.8.1-5',
  updatedAt: '2023-05-11'
}

// interface LegacyDefective extends Defective {}

// interface UpdateDefectiveWithIndexesInput extends UpdateDefectiveInput {}

// const scanDefectives: ScanOperation<LegacyDefective> = async () => await client.scan(TABLE_NAME)

// const toValidItem = ({ ...rest }: LegacyDefective): UpdateDefectiveWithIndexesInput => ({
//   ...rest
// })

// const updateDefectiveItem: UpdateOperation<LegacyDefective> = async (_) => {
//   /* Do nothing */
// }

export const updateDefectiveTable = async (persistToDB: boolean) => {
  /* Do nothing */
  await Promise.resolve(log.warn(`Doing nothing: ${JSON.stringify({ scriptInfo, persistToDB },)}`))
}
