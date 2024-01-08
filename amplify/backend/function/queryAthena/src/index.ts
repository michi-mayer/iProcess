// 3rd party libs
import log from 'loglevel'

// Lambda layer
import { lambdaHandlerBuilder, getLogLevel } from 'iprocess-shared'

// Local modules
import { EventSchema } from './types.js'
import { queryAthena } from './mapper.js'

log.setLevel(getLogLevel())

export const lambdaHandler = lambdaHandlerBuilder('queryAthena', async (inputEvent) => {
  const event = EventSchema.parse(inputEvent)
  return event ? await queryAthena(event) : []
})
