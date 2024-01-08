import log from 'loglevel'
import { lambdaHandlerBuilder, getLogLevel, AppError } from 'iprocess-shared'

import { assignUserToGroup } from './mapper.js'
import { getUserRole } from './utils.js'
import { Event } from './types.js'

log.setLevel(getLogLevel())

export const handler = lambdaHandlerBuilder('updateCognitoPreAuth', async (event: Event) => {
  const userRole = getUserRole(event.request.userAttributes)

  if (!userRole) {
    throw new AppError(`User is missing role from CloudIDP`)
  }

  await assignUserToGroup(event.userName, event.userPoolId, userRole)
  return event
})
