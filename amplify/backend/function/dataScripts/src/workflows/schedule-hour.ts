import { fromEnvironment } from 'iprocess-shared'
import { ScheduleHour } from 'iprocess-shared/graphql/API.js'

import { ScanOperation, ScriptInfo, UpdateOperation, client, updateTableBuilder } from './base.js'

const TABLE_NAME = fromEnvironment('API_ERFASSUNGSAPP_SCHEDULEHOURTABLE_NAME')

const scriptInfo: ScriptInfo = {
  tableName: TABLE_NAME,
  version: 'v23.24.15-16',
  updatedAt: '2023-06-27'
}

interface LegacyScheduleHour extends ScheduleHour {
  quota?: number | null
}

const scanScheduleHours: ScanOperation<LegacyScheduleHour> = async () => await client.scan({ TableName: TABLE_NAME })

const updateScheduleHourItem: UpdateOperation<LegacyScheduleHour> = async ({ id }) => {
  await client.update({ TableName: TABLE_NAME, Key: { id }, UpdateExpression: 'remove quota' })
}

export const updateScheduleHourTable = async (persistToDB: boolean) =>
  await updateTableBuilder(scriptInfo, scanScheduleHours, (_) => updateScheduleHourItem(_, persistToDB))
