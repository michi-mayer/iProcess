import { suite, it, assert } from 'vitest'

import { zodMomentParser } from '../utils/zod.js'

suite('ZodMoment parser', () => {
  it('should work with a valid date time', () => {
    const result = zodMomentParser('aGivenField').parse('2022-01-01T00:00:00.000Z')

    assert.ok(result.isValid())
  })

  it('should fail if it not includes the ms block', () => {
    const parser = zodMomentParser('aGivenField')

    assert.throws(() => parser.parse('2022-01-01T00:00:00Z'), Error)
  })
})
