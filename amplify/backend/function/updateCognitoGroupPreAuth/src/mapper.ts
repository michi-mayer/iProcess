import log from 'loglevel'
import {
  AdminAddUserToGroupCommand,
  AdminListGroupsForUserCommand,
  CognitoIdentityProviderClient
} from '@aws-sdk/client-cognito-identity-provider'
import { definedArray, fromEnvironment } from 'iprocess-shared'

const client = new CognitoIdentityProviderClient({ region: fromEnvironment('REGION') })

const listCognitoGroupsFromUser = async (userName: string, userPoolId: string) => {
  const response = await client.send(new AdminListGroupsForUserCommand({ Username: userName, UserPoolId: userPoolId }))
  return definedArray(response.Groups?.map((_) => _.GroupName))
}

export const addUserToGroup = async (userName: string, userPoolId: string, groupName: string) =>
  await client.send(
    new AdminAddUserToGroupCommand({
      Username: userName,
      UserPoolId: userPoolId,
      GroupName: groupName
    })
  )

export const assignUserToGroup = async (userName: string, userPoolId: string, cloudIDPGroup: string) => {
  const cognitoGroups = await listCognitoGroupsFromUser(userName, userPoolId)

  log.debug(`Groups the user ${userName} is currently assigned to: ${JSON.stringify(cognitoGroups)}`)
  const isCloudIDPGroupInCognitoGroups = cognitoGroups.includes(cloudIDPGroup)
  const otherUserGroups = cognitoGroups.filter((_) => _ !== cloudIDPGroup)

  log.warn(`User ${userName} belongs to additional Cognito groups: ${JSON.stringify(otherUserGroups)}`)

  if (!isCloudIDPGroupInCognitoGroups) {
    log.debug(`Adding user ${userName} to group ${cloudIDPGroup} on user pool with ID ${userPoolId}`)
    await addUserToGroup(userName, userPoolId, cloudIDPGroup)
  }
}
