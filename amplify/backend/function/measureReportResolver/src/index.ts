// 3rd party libraries
import log from 'loglevel'

// Lambda layer
import { AppError, getEvent, getLogLevel, lambdaHandlerBuilder } from 'iprocess-shared'

// Local modules
import { InputEvent, isCreateEvent, isDeleteEvent, isUpdateEvent } from './types.js'
import { createMeasureReport } from './events/create.js'
import { deleteMeasureReport } from './events/delete.js'
import { updateMeasureReport } from './events/update.js'

log.setLevel(getLogLevel())

export const lambdaHandler = lambdaHandlerBuilder('MeasureReportResolver', async (inputEvent: InputEvent) => {
  const event = getEvent(inputEvent)

  if (isCreateEvent(event)) {
    return await createMeasureReport(event)
  } else if (isUpdateEvent(event)) {
    return await updateMeasureReport(event)
  } else if (isDeleteEvent(event)) {
    return await deleteMeasureReport(event)
  } else {
    throw new AppError('Unexpected event type')
  }
})
