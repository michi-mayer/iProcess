import { it, assert, suite } from 'vitest'
import { calculateActualCount } from '../utils.js'

suite(calculateActualCount.name, () => {
  it('should receive the same numbers and return 0', () => {
    const OverflowCounter = 100
    const initialActualCount = 100
    const actualCountCalculation = calculateActualCount(OverflowCounter, initialActualCount)

    assert.strictEqual(actualCountCalculation, 0)
  })

  it('should receive an increased OverflowCounter and return a positive actualCount', () => {
    const OverflowCounter = 107
    const initialActualCount = 105
    const actualCountCalculation = calculateActualCount(OverflowCounter, initialActualCount)

    assert.strictEqual(actualCountCalculation, 2)
  })

  it('should receive OverflowCounter smaller than the initialActualCount and return a positive actualCount', () => {
    const OverflowCounter = 10
    const initialActualCount = 999_995
    const actualCountCalculation = calculateActualCount(OverflowCounter, initialActualCount)

    assert.strictEqual(actualCountCalculation, 14)
  })

  it('should receive the initialActualCount as the COUNTER_LIMIT and return the correct calculation', () => {
    const OverflowCounter = 1
    const initialActualCount = 999_999
    const actualCountCalculation = calculateActualCount(OverflowCounter, initialActualCount)

    assert.strictEqual(actualCountCalculation, 1)
  })
})
