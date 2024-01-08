// 3rd party libraries
import log from 'loglevel'

// Lambda layer
import { AppError, getEvent, getLogLevel, lambdaHandlerBuilder } from 'iprocess-shared'

// Local modules
import { InputEvent, isCreateEvent, isDeleteEvent, isDuplicateEvent, isUpdateEvent } from './types.js'
import { createShiftModel } from './events/create.js'
import { deleteShiftModel } from './events/delete.js'
import { updateShiftModel } from './events/update.js'
import { duplicateShiftModel } from './events/duplicate.js'

log.setLevel(getLogLevel())

export const handler = lambdaHandlerBuilder('ShiftModelResolver', async (inputEvent: InputEvent) => {
  const event = getEvent(inputEvent)

  if (isCreateEvent(event)) {
    return await createShiftModel(event)
  } else if (isUpdateEvent(event)) {
    return await updateShiftModel(event)
  } else if (isDeleteEvent(event)) {
    return await deleteShiftModel(event)
  } else if (isDuplicateEvent(event)) {
    return await duplicateShiftModel(event)
  } else {
    throw new AppError('Unexpected event type')
  }
})
