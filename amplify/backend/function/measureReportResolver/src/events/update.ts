import log from 'loglevel'

import { WithID, compareItems } from 'iprocess-shared'

import { getMeasureIDs, deleteMeasureReportItem, updateMeasureReportItem, createMeasureReportItem } from '../mapper.js'
import { UpdateEvent } from '../types.js'
import { checkMeasureReportExists } from '../utils.js'
import { CreateMeasureReportInput, MeasureInput, UpdateMeasureReportInput } from 'iprocess-shared/graphql/API.js'

interface WithReportID {
  reportId: string
}

interface WithReportIDAndUnitID extends WithReportID {
  unitId: string
}

const addUpdateMeasureReportItem = (
  item: MeasureInput,
  { reportId }: WithReportID,
  { id }: WithID
): UpdateMeasureReportInput => ({ ...item, reportId, id })

const addCreateMeasureReportItem = (
  item: MeasureInput,
  { reportId, unitId }: WithReportIDAndUnitID
): CreateMeasureReportInput => ({ ...item, reportId, unitId })

export const updateMeasureReport = async ({ put: { measures, ...report } }: UpdateEvent) => {
  await checkMeasureReportExists(report.id)

  const attributes = { reportId: report.id, unitId: report.unitId }
  const itemsFromDatabase = await getMeasureIDs(report.id)

  const { itemsToCreate, itemsToUpdate, itemsToDelete } = compareItems(
    measures,
    itemsFromDatabase,
    attributes,
    addCreateMeasureReportItem,
    addUpdateMeasureReportItem
  )

  log.debug('Measures to create: ', JSON.stringify({ itemsToCreate }))
  log.debug('Measures to update: ', JSON.stringify({ itemsToUpdate }))
  log.debug('Measures to delete: ', JSON.stringify({ itemsToDelete }))
  log.debug('Measure Report to update', JSON.stringify({ report }))

  await Promise.all([
    ...itemsToCreate.map(createMeasureReportItem),
    ...itemsToUpdate.map(updateMeasureReportItem),
    ...itemsToDelete.map(deleteMeasureReportItem),
    updateMeasureReportItem(report)
  ])

  return report.id
}
