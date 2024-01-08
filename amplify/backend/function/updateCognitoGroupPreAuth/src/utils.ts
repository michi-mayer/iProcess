import { CognitoRoles, definedArray, fromEnvironment } from 'iprocess-shared/index.js'

import { minBy } from 'remeda'

import { Event, UserAttributesSchema } from './types.js'

export const DEFAULT_CLOUDIDP_ADMIN_ROLE = 'VWAG_IPROCESS_ADMIN_PROD'
const CLOUDIDP_ADMIN_ROLE = fromEnvironment('CLOUDIDP_ADMIN_ROLE', () => DEFAULT_CLOUDIDP_ADMIN_ROLE)

export const DEFAULT_CLOUDIDP_MANAGER_ROLE = 'VWAG_IPROCESS_MANAGER_PROD'
const CLOUDIDP_MANAGER_ROLE = fromEnvironment('CLOUDIDP_ADMIN_ROLE', () => DEFAULT_CLOUDIDP_MANAGER_ROLE)

export const DEFAULT_CLOUDIDP_STANDARD_ROLE = 'VWAG_IPROCESS_USER_PROD'
const CLOUDIDP_STANDARD_ROLE = fromEnvironment('CLOUDIDP_ADMIN_ROLE', () => DEFAULT_CLOUDIDP_STANDARD_ROLE)

interface RoleWithPriority {
  role: string
  priority: number
}

const ROLES: Record<string, RoleWithPriority> = {
  [CLOUDIDP_ADMIN_ROLE]: { role: CognitoRoles.Admin, priority: 0 },
  [CLOUDIDP_MANAGER_ROLE]: { role: CognitoRoles.Manager, priority: 1 },
  [CLOUDIDP_STANDARD_ROLE]: { role: CognitoRoles.Standard, priority: 2 }
}

const parseRoles = (userAttributes: Partial<Event['request']['userAttributes']>) => {
  const result = UserAttributesSchema.safeParse(userAttributes)
  return result.success ? definedArray(result.data.profile.map((_) => ROLES[_])) : []
}

export const getUserRole = (userAttributes: Partial<Event['request']['userAttributes']>) => {
  const roles = parseRoles(userAttributes)
  return minBy(roles, ({ priority }) => priority)?.role
}
