// 3rd party libraries
import log from 'loglevel'

// Lambda layer
import { LambdaArguments, getLogLevel, lambdaHandlerBuilder } from 'iprocess-shared'

// Local modules
import { CreateEvent } from './types.js'
import { createGrouping } from './events/create.js'

log.setLevel(getLogLevel())

export const handler = lambdaHandlerBuilder('CreateGrouping', async (inputEvent: LambdaArguments<CreateEvent>) => {
  return await createGrouping(inputEvent.arguments)
})
