import { suite, assert, it } from 'vitest'

import { Shift } from '../graphql/API.js'
import { adjustDateDifference, extendTimeWithDate, getScheduleRate } from '../utils/time.js'
import { dateTimeParser, timeParser } from '../shared/time.js'
import { DayJS } from '../shared/datetime.js'

const assertDateTimeEquals = (firstValue: DayJS, secondValue: DayJS) =>
  assert.strictEqual(firstValue.toISOString(), secondValue.toISOString())

suite('getInvocationRate', () => {
  it('should return a default value if it is not defined in the environment', () => {
    const result = getScheduleRate()

    assert.strictEqual(result.asHours(), 24)
  })
})

suite('extendTimeWithCurrentDateTime', () => {
  it(`If the shift is not a night one, it should return the same inputted values`, () => {
    const startTimeInput = timeParser('14:30:00.000')
    const endTimeInput = timeParser('17:30:00.000')

    for (const shift of [Shift.morningShift, Shift.afternoonShift]) {
      const { startTime, endTime } = adjustDateDifference(startTimeInput, endTimeInput, shift)

      assertDateTimeEquals(startTime, startTimeInput)
      assertDateTimeEquals(endTime, endTimeInput)
    }
  })

  it(`If the shift is a night one, it should return the same startTime but the endTime should have one extra day`, () => {
    const startTimeInput = timeParser('23:30:00.000')
    const endTimeInput = timeParser('01:30:00.000')

    const { startTime, endTime } = adjustDateDifference(startTimeInput, endTimeInput, Shift.nightShift)

    assertDateTimeEquals(startTime, startTimeInput)
    assertDateTimeEquals(endTime, endTimeInput.add(1, 'day'))
  })
})

suite('extendTimeWithDate', () => {
  it(`should return a join of the date and time values if it's not a night shift`, () => {
    const timeRange = {
      startDateTime: '2023-06-15T06:30:00.000Z',
      endDateTime: '2023-06-15T14:30:00.000Z'
    }
    const time = timeParser('07:00:00.000')
    const expected = dateTimeParser('2023-06-15T07:00:00.000Z')

    for (const shift of [Shift.morningShift, Shift.afternoonShift]) {
      const result = extendTimeWithDate(timeRange, time, shift)
      assertDateTimeEquals(result, expected)
    }
  })

  it(`should return a join of the date and time values plus 1 day if it's a night shift`, () => {
    const timeRange = {
      startDateTime: '2023-06-15T22:30:00.000Z',
      endDateTime: '2023-06-16T06:30:00.000Z'
    }
    const time = timeParser('05:30:00.000')
    const expected = dateTimeParser('2023-06-16T05:30:00.000Z')

    const result = extendTimeWithDate(timeRange, time, Shift.nightShift)
    assertDateTimeEquals(result, expected)
  })
})
