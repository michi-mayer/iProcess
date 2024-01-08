import { suite, test, assert, it } from 'vitest'

import { arrayOf, dateTimeParser, zodDateTimeParser } from 'iprocess-shared'
import { DayJS } from 'iprocess-shared/shared/datetime.js'

import {
  getAvailability,
  getPerformance,
  getQuality,
  getCycleTime,
  aggregateTimeSlots,
  sumDurationInBoundaries,
  sumDefectiveCounts,
  sumDurationWithinShift,
  discardShortDisruptions,
  discardShortDisruptionsOnBoundaries,
  toOEE,
  buildOEEItem
} from '../ops.js'
import { TimeRange } from '../time.js'

import {
  defectives,
  disruptions,
  timeSlots,
  longDisruptionOnBoundaries,
  getTimeRange,
  shortDisruptionOnBoundaries,
  defaultTimeRangeInput,
  shift,
  baseOEE
} from './mocks.test.js'

const dateTimeArray = arrayOf(zodDateTimeParser)

const dateTimeValueIsInArray = (value: DayJS, array: DayJS[]) => array.some((_) => value.isSame(_))

it(`${toOEE.name} should return an OEE item with ID and typename information`, () => {
  const expected = '6fef0efe-460e-4ffc-a5c7-3e8e09a637ef'
  const input = structuredClone(baseOEE)

  const actual = toOEE(expected, input)

  assert.strictEqual(actual.id, expected)
  assert.containsAllKeys(actual, ['unitId', 'startTimeDateUTC', '__typename'])
})

it(`${aggregateTimeSlots.name} should return the shift quota, actualCount sum, and net operating time`, () => {
  const expectedValues = { quotaSum: 22, actualCountSum: 22, netOperatingTime: 120 }
  const actual = aggregateTimeSlots(timeSlots)

  assert.deepEqual(actual, expectedValues)
})

it(`${sumDefectiveCounts.name} should return the sum of counts from a list of Defective instances`, () => {
  const result = sumDefectiveCounts(defectives)
  assert.strictEqual(result, 1)
})

it(`${sumDurationWithinShift.name} should return the sum of durations from a list of Defective instances`, () => {
  const result = sumDurationWithinShift(disruptions)
  assert.strictEqual(result, 15)
})

suite(sumDurationInBoundaries.name, () => {
  it('should shorten one disruption that is off the start datetime boundary', () => {
    // ! time diff must be greater than the ENOUGH_TIME_FACTOR times targetCycleTime
    const otherShiftDate = getTimeRange({ ...defaultTimeRangeInput, start: '2021-11-10T06:31:00.000Z' })

    const result = sumDurationInBoundaries(longDisruptionOnBoundaries, otherShiftDate)
    assert.strictEqual(result, 44)
  })

  it('should shorten one disruption that is off the end datetime boundary', () => {
    // ! time diff must be greater than the ENOUGH_TIME_FACTOR times targetCycleTime
    const otherShiftDate = getTimeRange({ ...defaultTimeRangeInput, end: '2021-11-10T14:29:00.000Z' })

    const result = sumDurationInBoundaries(longDisruptionOnBoundaries, otherShiftDate)
    assert.strictEqual(result, 44)
  })
})

test(`${getCycleTime.name} should return correct TargetCycleTime`, () => {
  const netOperatingTimePerShift = 411 // min
  const targetCount = 100

  const targetCycleTime = getCycleTime(netOperatingTimePerShift, targetCount)
  assert.strictEqual(targetCycleTime, 4.11)
})

test(`${getAvailability.name} should return correct AvailabilityOEE`, () => {
  const netOperatingTimePerShift = 100
  const disruptionsDurationSum = 10

  const actual = getAvailability(netOperatingTimePerShift, disruptionsDurationSum)
  assert.strictEqual(actual, 0.9)
})

test(`${getPerformance.name} should return correct PerformanceOEE`, () => {
  const targetCount = 100
  const availability = 0.8
  const shiftActualCount = 90

  const actual = getPerformance(availability, shiftActualCount, targetCount)
  assert.strictEqual(actual, 1.13)
})

test(`${getQuality.name} should return correct QualityOEE`, () => {
  const shiftActualCount = 90
  const shiftNIO = 2
  const actual = getQuality(shiftActualCount, shiftNIO)

  assert.strictEqual(actual, 0.98)
})

suite(discardShortDisruptions.name, () => {
  it(`should return an empty list if the duration of all disruptions aren't enough`, () => {
    const cycleTime = 5
    const result = discardShortDisruptions(disruptions, cycleTime)

    assert.lengthOf(result, 0)
  })

  it(`should not discard any disruption if their duration is enough`, () => {
    const cycleTime = 1.5
    const result = discardShortDisruptions(disruptions, cycleTime)

    assert.lengthOf(result, disruptions.length)
  })
})

suite(discardShortDisruptionsOnBoundaries.name, () => {
  const targetCycleTime = 5
  const timeRange = getTimeRange()

  it(`should not discard any disruption if all happen within the Shift's timerange`, () => {
    const expectedResult = dateTimeArray.parse(['2021-11-10T06:15:00.000Z', '2021-11-10T14:15:00.000Z'])
    const result = discardShortDisruptionsOnBoundaries(longDisruptionOnBoundaries, targetCycleTime, timeRange)

    assert.ok(result.every((_) => dateTimeValueIsInArray(_.startTimeDateUTC, expectedResult)))
  })

  it(`should discard any disruption if it's off the start datetime boundary'`, () => {
    const expectedResult = dateTimeArray.parse(['2021-11-10T14:15:00.000Z'])

    // ! time diff must be < ENOUGH_DURATION_FACTOR * targetCycleTime
    const otherShiftDate = new TimeRange(dateTimeParser('2021-11-10T06:31:00.000Z'), timeRange.end)
    const result = discardShortDisruptionsOnBoundaries(longDisruptionOnBoundaries, targetCycleTime, otherShiftDate)

    assert.ok(result.every((_) => dateTimeValueIsInArray(_.startTimeDateUTC, expectedResult)))
  })

  it(`should discard any disruption if it's off the start datetime boundary'`, () => {
    const expectedResult = dateTimeArray.parse(['2021-11-10T06:15:00.000Z'])

    // ! time diff must be < ENOUGH_DURATION_FACTOR * targetCycleTime
    const otherShiftDate = new TimeRange(timeRange.start, dateTimeParser('2021-11-10T14:29:00.000Z'))
    const result = discardShortDisruptionsOnBoundaries(longDisruptionOnBoundaries, targetCycleTime, otherShiftDate)

    assert.ok(result.every((_) => dateTimeValueIsInArray(_.startTimeDateUTC, expectedResult)))
  })

  it(`should return an empty list if the duration of all disruptions aren't enough`, () => {
    const result = discardShortDisruptionsOnBoundaries(shortDisruptionOnBoundaries, targetCycleTime, timeRange)

    assert.notStrictEqual(result.length, shortDisruptionOnBoundaries.length)
  })
})

suite(buildOEEItem.name, () => {
  it(`should compute all the KPIs related to an OEE item`, () => {
    const actual = buildOEEItem(shift, defectives, disruptions, longDisruptionOnBoundaries)

    assert.isDefined(actual)
  })

  it(`should compute all the KPIs even if the lists of disruptions and defective items are empty`, () => {
    const actual = buildOEEItem(shift, [], [], [])

    assert.strictEqual(actual.netOperatingTimeInMinutes, 60)
    assert.strictEqual(actual.targetCycleTimeInMinutes, 5)
    assert.strictEqual(actual.availability, 1)
    assert.strictEqual(actual.performance, 0.55)
    assert.strictEqual(actual.quality, 1)
    assert.strictEqual(actual.overall, 0.55)
  })
})
