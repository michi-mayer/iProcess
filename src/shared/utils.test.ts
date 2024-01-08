import { assert, describe, it } from 'vitest'
import { RealNumber, round, sumAggregation } from 'shared/utils'

describe(sumAggregation.name, () => {
  it('should sum only defined values', () => {
    const result = sumAggregation([1, undefined, 2, null, 3], (_) => _ || 0) // eslint-disable-line unicorn/no-null

    assert.strictEqual(result, 6)
  })

  it('should return 0 if the array is empty', () => {
    const result = sumAggregation([], (_) => _)

    assert.strictEqual(result, 0)
  })
})

describe(RealNumber.name, () => {
  it('should return the same number', () => {
    const result = RealNumber(Math.PI)

    assert.strictEqual(result, Math.PI)
  })

  it('should return 0 if the input is 0', () => {
    const result = RealNumber(0)

    assert.strictEqual(result, 0)
  })

  it('should return the default value if the input is not finite', () => {
    const result = RealNumber(Number.NEGATIVE_INFINITY)

    assert.strictEqual(result, 0)
  })

  it('should return the default value if the input is undefined', () => {
    const result = RealNumber(undefined)

    assert.strictEqual(result, 0)
  })

  it('should return the default value if the input is null', () => {
    const result = RealNumber(null) // eslint-disable-line unicorn/no-null

    assert.strictEqual(result, 0)
  })
})

describe(round.name, () => {
  it('should return the PI number', () => {
    const result = round(Math.PI)
    assert.strictEqual(result, 3.14)
  })

  it('should return an Integer', () => {
    const result = round(Math.PI, 0)

    assert.strictEqual(result, 3)
  })

  it('should return the same number if the no. of digits is bigger than the ones available', () => {
    const result = round(Math.PI, 16)

    assert.strictEqual(result, Math.PI)
  })

  it('should return the default value if the input is not a valid decimal number', () => {
    const result = round(Number.POSITIVE_INFINITY)

    assert.strictEqual(result, 0)
  })
})
