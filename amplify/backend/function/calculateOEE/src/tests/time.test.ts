import { suite, assert, it } from 'vitest'

import { dateTimeParser } from 'iprocess-shared'

import { isShiftOngoing, calculateDurationByTimeRange, TimeRange } from '../time.js'
import { ZodDisruption } from '../types.js'

import { baseDisruption, getTimeRange } from './mocks.test.js'

suite(calculateDurationByTimeRange.name, () => {
  it('should return a reduced duration if the disruption spans over more than a single shift', () => {
    const disruption: ZodDisruption = {
      ...structuredClone(baseDisruption),
      startTimeDateUTC: dateTimeParser('2021-11-10T14:10:00.000Z'),
      endTimeDateUTC: dateTimeParser('2021-11-10T15:10:00.000Z'),
      duration: '01:00'
    }
    const shiftTimeRange = getTimeRange()

    const result = calculateDurationByTimeRange(disruption, shiftTimeRange)
    assert.strictEqual(result, '00:50')
  })
})

suite(isShiftOngoing.name, () => {
  it(`should be truthy for a Shift that is still ongoing`, () => {
    const shiftTimeRange = TimeRange.fromString('2021-11-09T06:30:00.000Z', '2021-11-09T14:30:00.000Z')
    const now = dateTimeParser('2021-11-09T11:00:00.000Z')
    
    const result = isShiftOngoing(shiftTimeRange, now)
    assert.ok(result)
  })

  it(`should be falsy for a Shift that is has already ended`, () => {
    const shiftTimeRange = TimeRange.fromString('2021-11-09T06:30:00.000Z', '2021-11-09T14:30:00.000Z')
    const now = dateTimeParser('2021-11-09T15:00:00.000Z')
    
    const result = isShiftOngoing(shiftTimeRange, now)
    assert.notOk(result)
  })
})
