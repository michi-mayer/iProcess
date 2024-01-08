import { afterEach, assert, describe, expect, it, vi } from 'vitest'
import { validateDuplicatedNames } from '../validate'

describe(validateDuplicatedNames.name, () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should call the callback for each index of duplicated names and return its index', () => {
    const array = [{ name: 'John' }, { name: 'Jane' }, { name: 'John' }, { name: 'Alice' }, { name: 'Jane' }]
    const expected = [0, 2, 1, 4]
    const callback = vi.fn()

    validateDuplicatedNames(array, callback)
    const result = callback.mock.calls.flat()

    expect(callback).toHaveBeenCalled()
    assert.deepStrictEqual(result, expected)
  })

  it('should not call the callback if there are no duplicate names', () => {
    const array = [{ name: 'John' }, { name: 'Jane' }, { name: 'Alice' }]
    const expected: number[] = []
    const callback = vi.fn()

    validateDuplicatedNames(array, callback)
    const result = callback.mock.calls.flat()

    expect(callback).not.toHaveBeenCalled()
    assert.deepStrictEqual(result, expected)
  })

  it('should handle an empty array without calling the callback', () => {
    const array: { name: string }[] = []
    const expected: number[] = []
    const callback = vi.fn()

    validateDuplicatedNames(array, callback)
    const result = callback.mock.calls.flat()

    expect(callback).not.toHaveBeenCalled()
    assert.deepStrictEqual(result, expected)
  })

  it('should handle an array with only one item without calling the callback', () => {
    const array = [{ name: 'John' }]
    const expected: number[] = []
    const callback = vi.fn()

    validateDuplicatedNames(array, callback)
    const result = callback.mock.calls.flat()

    expect(callback).not.toHaveBeenCalled()
    assert.deepStrictEqual(result, expected)
  })
})
