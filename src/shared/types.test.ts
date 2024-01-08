import { anything, Arbitrary, assert as prove, option, property, record, string } from 'fast-check'
import { assert, describe, it } from 'vitest'
import { defined, definedArray, isDefined, removeTableInfo, TableInfo } from 'shared/types'

describe(defined.name, () => {
  it('should return a value if it is defined', () => {
    const result = defined(3, () => undefined)
    assert.strictEqual(result, 3)
  })

  it('should return a default value if the value is undefined or null', () => {
    const result1 = defined(undefined, () => 3)
    const result2 = defined(null, () => 3) // eslint-disable-line unicorn/no-null

    assert.strictEqual(result1, 3)
    assert.strictEqual(result1, result2)
  })

  it('should throw an error if the value is undefined or null', () => {
    assert.throws(() => defined<number>(undefined), Error)
    assert.throws(() => defined<number>(null), Error) // eslint-disable-line unicorn/no-null
  })
})

describe(isDefined.name, () => {
  it('should return whether a value is defined or not', () => {
    assert(isDefined(3))
    assert.isFalse(isDefined(undefined))
  })
})

describe(definedArray.name, () => {
  it('should return an array if it is defined', () => {
    assert.deepEqual(definedArray([]), [])
  })

  it('should return an array without any element that is undefined or null', () => {
    assert.deepEqual(definedArray([1, undefined]), [1])
  })

  it('should not fail if an array is undefined or null', () => {
    assert.deepEqual(definedArray(undefined), [])
    assert.deepEqual(definedArray(null), []) // eslint-disable-line unicorn/no-null
  })
})

describe(removeTableInfo.name, () => {
  const generator: Arbitrary<TableInfo> = record(
    {
      __typename: string(),
      id: string(),
      createdAt: option(string(), { nil: undefined }),
      updatedAt: option(string(), { nil: undefined }),
      anyOtherField: anything()
    },
    { requiredKeys: ['__typename', 'anyOtherField', 'id'] }
  )

  it(`GIVEN an object
      WHEN it includes table info. attributes
      THEN the function should return the same object without hte table info. attributes`, () => {
    prove(
      property(generator, (input) => {
        const result = removeTableInfo(input)

        assert.doesNotHaveAnyKeys(result, ['__typename', 'id', 'createdAt', 'updatedAt'])
        assert.hasAnyKeys(result, ['anyOtherField'])
      })
    )
  })
})
