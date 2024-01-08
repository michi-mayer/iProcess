import log from 'loglevel'

import { AppError, getLogLevel, invalidDateTime, lambdaHandlerBuilder } from 'iprocess-shared'
import { TimeRange } from 'iprocess-shared/graphql/API.js'

import { EventSchema, ScheduleHour } from './types.js'
import { listScheduleHours } from './mapper.js'
import { ShiftSlot } from './shift.js'

log.setLevel(getLogLevel())

export const lambdaHandler = lambdaHandlerBuilder('startShift', async (inputEvent) => {
  const event = EventSchema.parse(inputEvent)
  const { shiftModelId, unitId, timeRange, shiftType } = event
  const shiftSlot = new ShiftSlot(unitId, invalidDateTime(), shiftType)

  await checkIsNewShift(shiftSlot, timeRange)

  const scheduleHours = await listScheduleHours(shiftModelId, shiftType)
  checkScheduleHours(scheduleHours)

  await shiftSlot.start(scheduleHours, event)

  return shiftSlot.configuration?.id
})

const checkIsNewShift = async (shift: ShiftSlot, timeRange: TimeRange) => {
  if (await shift.exists(timeRange)) {
    throw new AppError('Shift already started!', 409)
  }
}

const checkScheduleHours = (values: ScheduleHour[]) => {
  if (values.length === 0) {
    throw new AppError('List of ScheduleHour items is empty')
  }
}
