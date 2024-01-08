import log from 'loglevel'

import { getLogLevel, lambdaHandlerBuilder } from 'iprocess-shared'

import { EventSchema } from './types.js'
import { scanScheduleHours } from './mapper.js'
import { calculateShiftTarget } from './ops.js'

log.setLevel(getLogLevel())

export const lambdaHandler = lambdaHandlerBuilder('calculateShiftTarget', async (inputEvent) => {
  const event = EventSchema.parse(inputEvent)

  const scheduleHours = await scanScheduleHours(event.shiftModelId, event.shiftType)
  return calculateShiftTarget(scheduleHours, event)
})
