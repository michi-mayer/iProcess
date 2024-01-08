import log from 'loglevel'
import { LambdaArguments, getLogLevel, lambdaHandlerBuilder } from 'iprocess-shared'

import { DeleteEvent } from './types.js'
import { deleteGrouping } from './events/delete.js'

log.setLevel(getLogLevel())

export const handler = lambdaHandlerBuilder('UpdateGrouping', async (inputEvent: LambdaArguments<DeleteEvent>) => {
  return await deleteGrouping(inputEvent.arguments)
})
