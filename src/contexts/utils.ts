import { Role } from 'types'
import { CognitoRoles, NonEmptyString } from 'shared'

export const CLOUD_IDP = {
  ADMIN: NonEmptyString.parse(process.env.VITE_CLOUD_IDP_ADMIN),
  MANAGER: NonEmptyString.parse(process.env.VITE_CLOUD_IDP_MANAGER),
  STANDARD: NonEmptyString.parse(process.env.VITE_CLOUD_IDP_STANDARD)
} as const

export const getRoles = (userGroups: string[], userGroupsCloudIDP: string[] | undefined): Role[] => {
  switch (true) {
    case !!(userGroups.includes(CognitoRoles.Admin) || userGroupsCloudIDP?.includes(CLOUD_IDP.ADMIN)):
      return ['Admin', 'Manager', 'Standard']
    case !!(userGroups.includes(CognitoRoles.Manager) || userGroupsCloudIDP?.includes(CLOUD_IDP.MANAGER)):
      return ['Manager', 'Standard']
    case !!(userGroups.includes(CognitoRoles.Standard) || userGroupsCloudIDP?.includes(CLOUD_IDP.STANDARD)):
      return ['Standard']
    default:
      return []
  }
}
