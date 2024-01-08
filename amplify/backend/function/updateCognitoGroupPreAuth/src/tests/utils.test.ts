import { it, describe, expect } from 'vitest'
import { CognitoRoles } from 'iprocess-shared'
import {
  DEFAULT_CLOUDIDP_ADMIN_ROLE,
  DEFAULT_CLOUDIDP_MANAGER_ROLE,
  DEFAULT_CLOUDIDP_STANDARD_ROLE,
  getUserRole
} from '../utils.js'
import developerLoginEvent from './event-dev-login.json'
import cloudIdpLoginEvent from './event-cloudidp-login.json'

describe(getUserRole.name, () => {
  it(`should get no Cognito roles for an user who doesn't have CloudIDP roles`, () => {
    const role = getUserRole({ profile: undefined })
    expect(role).toBeUndefined()
  })

  it(`should get the most relevant Cognito role for an user who has one CloudIDP role`, () => {
    const role = getUserRole({ profile: JSON.stringify([DEFAULT_CLOUDIDP_ADMIN_ROLE]) })
    expect(role).toBe(CognitoRoles.Admin)
  })

  it(`should get the most relevant Cognito role for an user who has two or more CloudIDP role`, () => {
    const role = getUserRole({
      profile: JSON.stringify([DEFAULT_CLOUDIDP_MANAGER_ROLE, DEFAULT_CLOUDIDP_STANDARD_ROLE])
    })
    expect(role).toBe(CognitoRoles.Manager)
  })

  it(`should get the most relevant Cognito role for an user who has two or more roles, including non-CloudIDP ones`, () => {
    const role = getUserRole({
      profile: JSON.stringify([DEFAULT_CLOUDIDP_STANDARD_ROLE, DEFAULT_CLOUDIDP_ADMIN_ROLE, 'VIP_USER'])
    })
    expect(role).toBe(CognitoRoles.Admin)
  })

  it(`should no Cognito roles for an user who uses the development login`, () => {
    const role = getUserRole(developerLoginEvent.request.userAttributes)
    expect(role).toBeUndefined()
  })

  it(`should at least one Cognito role for an user who uses the CloudIDP login`, () => {
    const role = getUserRole(cloudIdpLoginEvent.request.userAttributes)
    expect(role).toBe(CognitoRoles.Manager)
  })
})
