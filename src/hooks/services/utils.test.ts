import { assert, describe, it } from 'vitest'
import { isUserAllowedToSeeGrouping } from './utils'

describe(isUserAllowedToSeeGrouping.name, () => {
  it('user is allowed', () => {
    const result = isUserAllowedToSeeGrouping(['PWD', 'PWK'], 'PWD-1/2')

    assert.strictEqual(result, true)
  })

  it('user is not allowed due to undefined subDepartment', () => {
    const result = isUserAllowedToSeeGrouping(['PWD', 'PWK'], undefined)

    assert.strictEqual(result, false)
  })

  it('user is not allowed', () => {
    const result = isUserAllowedToSeeGrouping(['PWD', 'PWK'], 'NOT')

    assert.strictEqual(result, false)
  })

  it('user is not allowed, departments undefined', () => {
    const result = isUserAllowedToSeeGrouping(undefined, 'PWD-1/2')

    assert.strictEqual(result, false)
  })

  it('user is not allowed, departments null', () => {
    const result = isUserAllowedToSeeGrouping(null, 'PWD-1/2') // eslint-disable-line unicorn/no-null

    assert.strictEqual(result, false)
  })

  it('none one can', () => {
    const result = isUserAllowedToSeeGrouping([], 'PWD-1/2')

    assert.strictEqual(result, false)
  })
})
