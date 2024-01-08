import { CognitoIdentityProviderClient, ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider'

import { definedArray, fromEnvironment } from 'iprocess-shared'

import { AttributeType } from './types.js'

const client = new CognitoIdentityProviderClient({ region: fromEnvironment('REGION') })

export const listUserAttributes = async () => {
  const command = new ListUsersCommand({ UserPoolId: fromEnvironment('AUTH_ERFASSUNGSAPP373264A5_USERPOOLID') })
  const { Users: users } = await client.send(command)

  return definedArray(users?.map((_) => _.Attributes as AttributeType[]))
}
