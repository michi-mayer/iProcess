import log from 'loglevel'
import { lambdaHandlerBuilder, fromEnvironment, getLogLevel } from 'iprocess-shared'

import { GenerateEmbedUrlForAnonymousUserCommandInput } from '@aws-sdk/client-quicksight'

import { getQuickSightURL } from './mapper.js'
import { EventSchema } from './types.js'

log.setLevel(getLogLevel())

const MAX_SESSION_LIFETIME = 600 // ? In minutes (equivalent is 10h)
const DEFAULT_NAMESPACE = 'default'
const AWS_ACCOUNT_ID = fromEnvironment('ACCOUNT_ID')

export const lambdaHandler = lambdaHandlerBuilder('getQuickSightURL', async (inputEvent) => {
  const { initialDashboardId } = EventSchema.parse(inputEvent)

  const input: GenerateEmbedUrlForAnonymousUserCommandInput = {
    AwsAccountId: AWS_ACCOUNT_ID,
    Namespace: DEFAULT_NAMESPACE,
    SessionLifetimeInMinutes: MAX_SESSION_LIFETIME,
    AuthorizedResourceArns: [`arn:aws:quicksight:eu-west-1:${AWS_ACCOUNT_ID}:dashboard/${initialDashboardId}`],
    ExperienceConfiguration: {
      Dashboard: {
        InitialDashboardId: initialDashboardId
      }
    }
  }

  return await getQuickSightURL(input)
})
