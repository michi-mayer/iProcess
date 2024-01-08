// 3rd party libraries
import log from 'loglevel'

// Lambda layer
import { AppError, getEvent, getLogLevel, lambdaHandlerBuilder } from 'iprocess-shared'

// Local modules
import { InputEvent, isCreateEvent, isDeleteEvent, isUpdateEvent } from './types.js'
import { createProduct } from './events/create.js'
import { deleteProduct } from './events/delete.js'
import { updateProduct } from './events/update.js'

log.setLevel(getLogLevel())

export const handler = lambdaHandlerBuilder('ProductResolver', async (inputEvent: InputEvent) => {
  const event = getEvent(inputEvent)

  if (isCreateEvent(event)) {
    return await createProduct(event)
  } else if (isUpdateEvent(event)) {
    return await updateProduct(event)
  } else if (isDeleteEvent(event)) {
    return await deleteProduct(event)
  } else {
    throw new AppError('Unexpected event type')
  }
})
