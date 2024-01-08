// 3rd party libraries
import log from 'loglevel'

// Lambda layer
import { getEvent, getLogLevel, lambdaHandlerBuilder } from 'iprocess-shared'

import { InputEvent } from './types.js'
import { updateTemplates } from './events/update.js'

// Local modules

log.setLevel(getLogLevel())

export const handler = lambdaHandlerBuilder('DisruptionResolver', async (inputEvent: InputEvent) => {
  const event = getEvent(inputEvent)

  return await updateTemplates(event)
})
