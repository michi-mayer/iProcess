import { deleteMeasureReportItem, getMeasureIDs } from '../mapper.js'
import { checkMeasureReportExists } from '../utils.js'
import { DeleteEvent } from '../types.js'

export const deleteMeasureReport = async ({ delete: { id } }: DeleteEvent) => {
  await checkMeasureReportExists(id)
  const measureIDs = await getMeasureIDs(id)

  await Promise.all([...measureIDs.map(deleteMeasureReportItem), deleteMeasureReportItem({ id })])

  return id
}
