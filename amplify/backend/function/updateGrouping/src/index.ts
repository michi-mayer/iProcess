import log from 'loglevel'
import { LambdaArguments, getLogLevel, lambdaHandlerBuilder } from 'iprocess-shared'

import { UpdateEvent } from './types.js'
import { updateGrouping } from './events/update.js'

log.setLevel(getLogLevel())

export const handler = lambdaHandlerBuilder('UpdateGrouping', async (inputEvent: LambdaArguments<UpdateEvent>) => {
  return await updateGrouping(inputEvent.arguments)
})
