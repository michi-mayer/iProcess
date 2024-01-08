import {
  GenerateEmbedUrlForAnonymousUserCommand,
  GenerateEmbedUrlForAnonymousUserCommandInput,
  QuickSightClient
} from '@aws-sdk/client-quicksight'
import { defaultProvider } from '@aws-sdk/credential-provider-node'
import log from 'loglevel'
import { AppError, fromEnvironment } from 'iprocess-shared'

const NO_RESPONSE_CODE = 444 // ? https://http.cat/444
const client = new QuickSightClient({
  region: fromEnvironment('REGION'),
  credentials: defaultProvider()
})

export const getQuickSightURL = async (input: GenerateEmbedUrlForAnonymousUserCommandInput) => {
  const command = new GenerateEmbedUrlForAnonymousUserCommand(input)
  const response = await client.send(command)
  const status = response.Status ?? NO_RESPONSE_CODE

  log.debug('GetQuickSightURL parameters', JSON.stringify({ input, response }))

  if (status >= 200 && status <= 299) {
    return response.EmbedUrl
  } else {
    throw new AppError('Request failed', { status, response })
  }
}
