import log from 'loglevel'
import { NIL } from 'uuid'

import { fromEnvironment } from 'iprocess-shared'
import { MeasureReport, UpdateMeasureReportInput } from 'iprocess-shared/graphql/API.js'

import { ScanOperation, ScriptInfo, UpdateOperation, client, updateTableBuilder } from './base.js'

const TABLE_NAME = fromEnvironment('API_ERFASSUNGSAPP_MEASUREREPORTTABLE_NAME')

const scriptInfo: ScriptInfo = {
  tableName: TABLE_NAME,
  version: 'v23.8.1-5',
  updatedAt: '2023-05-11'
}

interface LegacyMeasureReport extends MeasureReport { }

interface UpdateMeasureReportWithIndexesInput extends UpdateMeasureReportInput { }

const scanMeasureReports: ScanOperation<LegacyMeasureReport> = async () => await client.scan({ TableName: TABLE_NAME })

const toValidItem = ({ ...rest }: LegacyMeasureReport): UpdateMeasureReportWithIndexesInput => ({
  ...rest
})

// eslint-disable-next-line require-await
const updateMeasureReportItem: UpdateOperation<LegacyMeasureReport> = async (item) => {
  const { id, reportId } = toValidItem(item)

  if (reportId === NIL) {
    // * only warn when the item is a Report
    log.warn(`Unit short name is undefined for MeasureReport with ID ${id}`)
  }
}

export const updateMeasureReportTable = async (persistToDB: boolean) =>
  await updateTableBuilder(scriptInfo, scanMeasureReports, (_) => updateMeasureReportItem(_, persistToDB))
