import log from 'loglevel'

import { createShiftModelItem, createShiftModelUnitItem, createScheduleHourItem } from "../mapper.js"
import { CreateEvent } from "../types.js"

export const createShiftModel = async ({ put: { unitIds, scheduleHours, ...rest } }: CreateEvent) => {
  log.debug(`Creating Shift model: ${JSON.stringify(rest)}`)

  const shiftModelId = await createShiftModelItem(rest)

  await Promise.all([
    ...unitIds.map(async (unitId) => await createShiftModelUnitItem({ unitId, shiftModelId })),
    ...scheduleHours.map(async (_) => await createScheduleHourItem({ ..._, shiftModelId }))
  ])

  return shiftModelId
}
