import { assert, describe, it } from 'vitest'
import { Type } from 'API'
import {
  calculateActualCount,
  findNextProductionSlot,
  findPreviousProductionSlot,
  PickScheduleSlot
} from 'helper/actualCount'

const scheduleSlots: PickScheduleSlot[] = [
  { id: '0', type: Type.Production },
  { id: '1', type: Type.Pause },
  { id: '2', type: Type.Production },
  { id: '3', type: Type.Pause },
  { id: '4', type: Type.Production },
  { id: '5', type: Type.Production },
  { id: '6', type: Type.Production },
  { id: '7', type: Type.ShiftChange }
]

describe('Test calculateActualCount()', () => {
  const minRange = 1
  const maxRange = 999
  it('calculateActualCount returns 0 when previousVehicleNumber equals currentVehicleNumber', () => {
    const result = calculateActualCount({ from: 5, until: 5, minRange, maxRange })
    return assert.strictEqual(result, 0)
  })

  it('calculateActualCount returns correct actual count when previousVehicleNumber is less than currentVehicleNumber', () => {
    const result = calculateActualCount({ from: 5, until: 7, minRange, maxRange })
    return assert.strictEqual(result, 2)
  })

  it('calculateActualCount returns correct actual count when previousVehicleNumber is greater than currentVehicleNumber and maxRange and minRange are used', () => {
    const result = calculateActualCount({ from: 9, until: 6, minRange, maxRange })
    return assert.strictEqual(result, 996)
  })

  it('calculateActualCount returns undefined when from is lower than minRange', () => {
    const result = calculateActualCount({ from: 1, until: 5, minRange: 2, maxRange })
    return assert.strictEqual(result, undefined)
  })

  it('calculateActualCount returns undefined when until is higher than maxRange', () => {
    const result = calculateActualCount({ from: 5, until: 1000, minRange, maxRange })
    return assert.strictEqual(result, undefined)
  })

  it('calculateActualCount returns correct actual count when previousVehicleNumber is greater than currentVehicleNumber and maxRange and minRange are used', () => {
    const result = calculateActualCount({ from: 9, until: 6, minRange: 6, maxRange })
    return assert.strictEqual(result, 991)
  })
})

describe('findPreviousProductionSlot', () => {
  it('should return the previous production slot when findSecond is false', () => {
    const result = findPreviousProductionSlot(scheduleSlots, 4)
    return assert.deepStrictEqual(result, scheduleSlots[2])
  })

  it('should return the previous production slot when findSecond is false', () => {
    const result = findPreviousProductionSlot(scheduleSlots, 6)
    return assert.deepStrictEqual(result, scheduleSlots[5])
  })

  it('should return the second previous production slot when findSecond is true', () => {
    const result = findPreviousProductionSlot(scheduleSlots, 4, true)
    return assert.deepStrictEqual(result, scheduleSlots[0])
  })

  it('should return the second previous production slot when findSecond is true', () => {
    const result = findPreviousProductionSlot(scheduleSlots, 6, true)
    return assert.deepStrictEqual(result, scheduleSlots[4])
  })

  it('should return undefined if scheduleSlots is undefined', () => {
    const result = findPreviousProductionSlot(undefined, 2)
    return assert.deepStrictEqual(result, undefined)
  })

  it('should return undefined if no production slot is found', () => {
    const result = findPreviousProductionSlot(scheduleSlots, 0)
    return assert.deepStrictEqual(result, undefined)
  })
  it('should return undefined if no production slot is found', () => {
    const result = findPreviousProductionSlot(scheduleSlots, 2, true)
    return assert.deepStrictEqual(result, undefined)
  })
})

describe('findNextProductionSlot', () => {
  it('should return undefined if scheduleSlots is undefined', () => {
    const result = findNextProductionSlot(undefined, 0)
    return assert.deepStrictEqual(result, undefined)
  })

  it('should return the next production schedule slot', () => {
    const result = findNextProductionSlot(scheduleSlots, 0)
    return assert.deepStrictEqual(result, scheduleSlots[2])
  })

  it('should return the next production schedule slot', () => {
    const result = findNextProductionSlot(scheduleSlots, 2)
    return assert.deepStrictEqual(result, scheduleSlots[4])
  })
  it('should return undefined when selectedShiftTab is the last Production item', () => {
    const result = findNextProductionSlot(scheduleSlots, 6)
    return assert.deepStrictEqual(result, undefined)
  })
})
