import { assert, it, suite } from 'vitest'
import {
  buildDateTime,
  dateParser,
  dateTimeParser,
  durationIn,
  durationInMinutesParser,
  getTime,
  isAfterMidnight,
  momentDateParser,
  momentDateTimeParser,
  momentTimeParser,
  timeParser
} from 'shared/time'

suite(durationIn.name, () => {
  const startDateTime = momentDateTimeParser('2021-11-10T06:30:00.000Z')
  const endDateTime = momentDateTimeParser('2021-11-10T09:30:00.000Z')

  it('should return 0 minutes if the DateTime values are the same', () => {
    const result = durationIn(startDateTime, startDateTime, { granularity: 'minutes' })

    assert.strictEqual(result, 0)
  })

  it('should return the schedule duration in minutes', () => {
    const result = durationIn(startDateTime, endDateTime, { granularity: 'minutes' })

    assert.strictEqual(result, 180)
  })

  it('should return the schedule duration in seconds', () => {
    const startDateTime = dateTimeParser('2021-11-10T06:30:00.000Z')
    const endDateTime = dateTimeParser('2021-11-10T09:30:00.000Z')

    const result = durationIn(startDateTime, endDateTime, { granularity: 'seconds' })

    assert.strictEqual(result, 10_800)
  })

  it('should return the schedule duration in milliseconds', () => {
    const result = durationIn(startDateTime, endDateTime, { granularity: 'milliseconds' })

    assert.strictEqual(result, 10_800_000)
  })
})

suite('durationInMinutesParser', () => {
  it('should return the duration in minutes of a Duration string', () => {
    const result = durationInMinutesParser('01:15')

    assert.strictEqual(result, 75)
  })
})

suite('DateTime parser', () => {
  it('should work with a valid date', () => {
    const result = momentDateTimeParser('2022-01-01T00:00:00.000Z')

    assert(result.isValid())
  })

  // ! FIXME Remove when VDD-560 is done
  it('should work with a temporarily valid date', () => {
    const result = momentDateTimeParser('2022-01-01T00:00:00.0000Z')

    assert(result.isValid())
  })

  it('should fail if the date-time separator is not "T"', () => {
    const result = momentDateTimeParser('2022-01-01 00:00:00.000Z')

    assert.notOk(result.isValid())
  })
})

suite(momentDateParser.name, () => {
  it('should work with a valid date', () => {
    const result = momentDateParser('2022-01-01')

    assert(result.isValid())
  })

  it('should fail if the date separator is not `-`', () => {
    const result = momentDateParser('2022/01/01')

    assert.notOk(result.isValid())
  })
})

suite(momentTimeParser.name, () => {
  it('should work with a valid date', () => {
    const result = momentTimeParser('12:30:07.000')

    assert(result.isValid())
  })

  // ! FIXME Remove when VDD-560 is done
  it('should work with a temporarily valid date', () => {
    const result = momentTimeParser('12:30:07.0000')

    assert(result.isValid())
  })

  it('should fail if it not includes the ms block', () => {
    const result = momentTimeParser('12:30:07')

    assert.notOk(result.isValid())
  })
})

suite(isAfterMidnight.name, () => {
  it('should validate if a datetime is before or after midnight', () => {
    const validInput = dateTimeParser('1970-01-02T01:30:00.000Z')
    assert.ok(isAfterMidnight(validInput))

    const invalidInput = dateTimeParser('1970-01-01T23:00:00.000Z')
    assert.notOk(isAfterMidnight(invalidInput))
  })
})

suite(buildDateTime.name, () => {
  it(`should return a new Date instance with one date's date info. and another date's time info.`, () => {
    const dateData = dateParser('1989-11-09')
    const timeData = timeParser('23:00:00.000')
    const result = buildDateTime(dateData, timeData)

    assert.strictEqual(result.toISOString(), '1989-11-09T23:00:00.000Z')
  })
})

suite(getTime.name, () => {
  it(`should return the current local time`, () => {
    const now = new Date()
    const expected = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    const result = getTime()

    assert.strictEqual(result, expected)
  })
})
