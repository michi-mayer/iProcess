// 3rd party libraries
import log from 'loglevel'

// Lambda layer
import { AppError, getEvent, getLogLevel, lambdaHandlerBuilder } from 'iprocess-shared'

// Local modules
import { InputEvent, isCreateEvent, isDeleteEvent, isUpdateEvent } from './types.js'
import { createUnit } from './events/create.js'
import { deleteUnit } from './events/delete.js'
import { updateUnit } from './events/update.js'

log.setLevel(getLogLevel())

export const handler = lambdaHandlerBuilder('UnitResolver', async (inputEvent: InputEvent) => {
  const event = getEvent(inputEvent)

  if (isCreateEvent(event)) {
    return await createUnit(event)
  } else if (isUpdateEvent(event)) {
    return await updateUnit(event)
  } else if (isDeleteEvent(event)) {
    return await deleteUnit(event)
  } else {
    throw new AppError('Unexpected event type')
  }
})
