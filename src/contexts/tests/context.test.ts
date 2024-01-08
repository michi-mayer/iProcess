import { assert, describe, it } from 'vitest'
import { CLOUD_IDP, getRoles } from 'contexts/utils'

describe('getRoles', () => {
  it('should return roles for admin userGroups', () => {
    const userGroups = ['admin']
    const userGroupsCloudIDP = undefined
    const roles = getRoles(userGroups, userGroupsCloudIDP)
    assert.deepEqual(roles, ['Admin', 'Manager', 'Standard'])
  })
  it('should return roles for VWAG_IPROCESS_ADMIN_PROD userGroupsCloudIDP', () => {
    const userGroups: string[] = []
    const userGroupsCloudIDP = [CLOUD_IDP.ADMIN]
    const roles = getRoles(userGroups, userGroupsCloudIDP)
    assert.deepEqual(roles, ['Admin', 'Manager', 'Standard'])
  })

  it('should return roles for manager userGroups', () => {
    const userGroups = ['manager']
    const userGroupsCloudIDP = undefined
    const roles = getRoles(userGroups, userGroupsCloudIDP)
    assert.deepEqual(roles, ['Manager', 'Standard'])
  })

  it('should return roles for VWAG_IPROCESS_MANAGER_PROD userGroupsCloudIDP', () => {
    const userGroups: string[] = []
    const userGroupsCloudIDP = [CLOUD_IDP.MANAGER]
    const roles = getRoles(userGroups, userGroupsCloudIDP)
    assert.deepEqual(roles, ['Manager', 'Standard'])
  })

  it('should return roles for standard userGroups', () => {
    const userGroups = ['standard']
    const userGroupsCloudIDP = undefined
    const roles = getRoles(userGroups, userGroupsCloudIDP)
    assert.deepEqual(roles, ['Standard'])
  })

  it('should return roles for VWAG_IPROCESS_USER_PROD userGroupsCloudIDP', () => {
    const userGroups: string[] = []
    const userGroupsCloudIDP = [CLOUD_IDP.STANDARD]
    const roles = getRoles(userGroups, userGroupsCloudIDP)
    assert.deepEqual(roles, ['Standard'])
  })

  it('should return empty roles for unknown userGroups and unknown userGroupsCloudIDP', () => {
    const userGroups = ['unknown']
    const userGroupsCloudIDP = ['unknown']
    const roles = getRoles(userGroups, userGroupsCloudIDP)
    assert.deepEqual(roles, [])
  })

  it('should return empty roles when userGroupsCloudIDP is undefined and userGroups is empty', () => {
    const userGroups: string[] = []
    const userGroupsCloudIDP = undefined
    const roles = getRoles(userGroups, userGroupsCloudIDP)
    assert.deepEqual(roles, [])
  })
})
