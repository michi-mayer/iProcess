import { array, assert as prove, constantFrom, integer, property, record } from 'fast-check'
import { assert, it, suite } from 'vitest'
import { Type } from 'API'
import { zodMomentParser } from 'helper/time'
import {
  defined,
  DurationSchema,
  ExtendedDateTimeRange,
  ExtendedDateTimeRangeSchema,
  nonEmptyArray,
  Nullable
} from 'shared'
import {
  calculateCycleTime,
  calculateCycleTimeForNotApplicable,
  calculateSlotQuota,
  calculateTarget,
  getItemDuration
} from 'shared/operations'

interface ExtendedDateTimeRangeWithRawDowntime extends Omit<ExtendedDateTimeRange<string>, 'downtime'> {
  downtime: Nullable<string>
}

export const currentShiftScheduleSlots: ExtendedDateTimeRangeWithRawDowntime[] = [
  {
    dateTimeStartUTC: '2023-02-02T05:30:00.000Z',
    dateTimeEndUTC: '2023-02-02T07:30:00.000Z',
    downtime: undefined,
    type: Type.Production
  },
  {
    dateTimeStartUTC: '2023-02-02T07:30:00.000Z',
    dateTimeEndUTC: '2023-02-02T09:30:00.000Z',
    downtime: undefined,
    type: Type.Production
  },
  {
    dateTimeStartUTC: '2023-02-02T09:30:00.000Z',
    dateTimeEndUTC: '2023-02-02T11:30:00.000Z',
    downtime: '00:10',
    type: Type.Production
  },
  {
    dateTimeStartUTC: '2023-02-02T11:30:00.000Z',
    dateTimeEndUTC: '2023-02-02T12:30:00.000Z',
    downtime: undefined,
    type: Type.Pause
  },
  {
    dateTimeStartUTC: '2023-02-02T12:30:00.000Z',
    dateTimeEndUTC: '2023-02-02T13:30:00.000Z',
    downtime: undefined,
    type: Type.Production
  }
]

const ExtendedDateTimeRangeWithDowntimeSchema = ExtendedDateTimeRangeSchema.extend({
  downtime: DurationSchema
})

export const ExtendedMomentDateTimeRangeWithDowntimeSchema = ExtendedDateTimeRangeWithDowntimeSchema.extend({
  dateTimeStartUTC: zodMomentParser,
  dateTimeEndUTC: zodMomentParser
})

const parsedSlots = nonEmptyArray(
  structuredClone(currentShiftScheduleSlots).map((_) => ExtendedDateTimeRangeWithDowntimeSchema.parse(_))
)
const parsedSlotsWithMoment = nonEmptyArray(
  structuredClone(currentShiftScheduleSlots).map((_) => ExtendedMomentDateTimeRangeWithDowntimeSchema.parse(_))
)

const slot = parsedSlots[0]

const sumOf = (_: number[]) => {
  let result = 0
  for (const value of _) result += value
  return result
}

const diff = (a: number, b: number) => Math.abs(a - b)

suite(getItemDuration.name, () => {
  it(`should return the item's duration (dates are DayJS instances)`, () => {
    const expected = 7200 // * slot's duration in seconds
    const actual = getItemDuration(slot)

    assert.strictEqual(actual, expected)
  })

  it(`should return the item's duration (dates are Moment instances)`, () => {
    const slot = parsedSlotsWithMoment[0]

    const expected = 7200 // * slot's duration in seconds
    const actual = getItemDuration(slot)

    assert.strictEqual(actual, expected)
  })
})

suite(calculateCycleTimeForNotApplicable.name, () => {
  const output = 630 // * also called 'shiftTarget'

  it('should return the sum of durations for Production timeslots', () => {
    const expected = 39_047.6 // * in milliseconds
    const actual = calculateCycleTimeForNotApplicable(parsedSlots, output)

    assert.isBelow(diff(actual, expected), 0.1)
  })

  it('should return the sum of durations for Production timeslots (with Moment instances)', () => {
    const expected = 39_047.6 // * in milliseconds
    const actual = calculateCycleTimeForNotApplicable(parsedSlotsWithMoment, output)

    assert.isBelow(diff(actual, expected), 0.1)
  })
})

suite(calculateTarget.name, () => {
  const input = record({
    type: constantFrom(...Object.values(Type)),
    quota: integer({ min: 1 })
  })

  it('should compute the shift or timeslot target for a given list of TimeSlot instances', () => {
    prove(
      property(array(input), (items) => {
        const expected = sumOf(items.map((_) => _.quota))
        const actual = calculateTarget(items)

        assert.strictEqual(actual, expected)
      })
    )
  })
})

suite(calculateSlotQuota.name, () => {
  const cycleTime = 30

  it('should return 0 if the type is not Production', () => {
    const actual = calculateSlotQuota(slot, 0)
    assert.strictEqual(actual, 0)
  })

  it('should compute a quota for a given time range', () => {
    const expected = 4 // * 2h in seconds (7200) divided by 30
    const actual = calculateSlotQuota(slot, cycleTime, undefined, 'minutes')

    assert.strictEqual(actual, expected)
  })

  it('should compute a quota for a given time range times the factor value', () => {
    const factor = 2

    const expected = 8
    const actual = calculateSlotQuota(slot, cycleTime, factor, 'minutes')

    assert.strictEqual(actual, expected)
  })

  it('should compute a quota minus idle time for a given time range', () => {
    const slot = defined(parsedSlots.find((_) => _.downtime))

    const expected = 4
    const actual = calculateSlotQuota(slot, cycleTime, undefined, 'minutes')

    assert.strictEqual(actual, expected)
  })
})

suite(calculateCycleTime.name, () => {
  it('should retrieve the cycle time in milliseconds if it is already available', () => {
    prove(
      property(integer({ min: 1 }), (cycleTime) => {
        const expected = cycleTime * 1000 // * cycleTime is provided in seconds but required in milliseconds
        const actual = calculateCycleTime([], cycleTime, undefined)

        assert.strictEqual(actual, expected)
      })
    )
  })

  it(`should return the cycleTime calculated from the input items and the shiftTarget/output if the cycleTime is not provided`, () => {
    const shiftTarget = 360

    const expected = 68_333.3
    const actual = calculateCycleTime(parsedSlots, undefined, shiftTarget)

    assert.isBelow(diff(actual, expected), 0.1)
  })

  it('should throw an error if neither the cycle time nor the shift target are defined', () => {
    assert.throws(() => calculateCycleTime([], undefined, undefined))
  })
})
