import { NIL as NIL_UUID } from 'uuid'

import { createMeasureReportItem } from '../mapper.js'
import { CreateEvent } from '../types.js'

export const createMeasureReport = async ({ put: { measures, ...report } }: CreateEvent) => {
  const reportId = await createMeasureReportItem({ ...report, reportId: NIL_UUID })
  const unitId = report.unitId

  await Promise.all(measures.map(async (_) => await createMeasureReportItem({ ..._, reportId, unitId })))

  return reportId
}
