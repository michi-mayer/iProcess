import { describe, expect, it } from 'vitest'

import { dateTimeParser, timeParser } from 'iprocess-shared'
import { Shift, SplitPosition } from 'iprocess-shared/graphql/index.js'

import {
  checkSplitPosition,
  filterByTimeRange,
  buildDateTimeWithShift,
  dateTimeRangeIsBetween,
  timeRangeOverlaps,
  setDateTimeRange
} from '../time.js'
import { ScheduleHourSchema } from '../types.js'

import { scheduleHours } from './mocks.test.js'

describe(dateTimeRangeIsBetween.name, () => {
  it('should be truthy if the 1st time range is inclusively within the 2nd time range', () => {
    const scheduleSlotTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T06:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T09:30:00.000Z')
    }
    const configurationTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T06:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T14:30:00.000Z')
    }
    const result = dateTimeRangeIsBetween(scheduleSlotTimeRange, configurationTimeRange)

    expect(result).toBeTruthy()
  })

  it('should be truthy if the 1st time range is exclusively within the 2nd time range', () => {
    const scheduleSlotTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T08:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T09:30:00.000Z')
    }
    const configurationTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T06:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T14:30:00.000Z')
    }
    const result = dateTimeRangeIsBetween(scheduleSlotTimeRange, configurationTimeRange, true)
    expect(result).toBeTruthy()
  })

  it('should be falsy if the 1st time range is not exclusively within the 2nd time range', () => {
    const scheduleSlotTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T06:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T09:30:00.000Z')
    }
    const configurationTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T06:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T14:30:00.000Z')
    }
    const result = dateTimeRangeIsBetween(scheduleSlotTimeRange, configurationTimeRange, true)
    expect(result).toBeFalsy()
  })

  it('should be truthy if the 1st time range is within the 2nd time range, at night shift', () => {
    const configurationTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-09T21:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T03:30:00.000Z')
    }
    const shiftTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-09T21:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T05:30:00.000Z')
    }

    const result = dateTimeRangeIsBetween(configurationTimeRange, shiftTimeRange)
    expect(result).toBeTruthy()
  })
})

describe(timeRangeOverlaps.name, () => {
  it('should be truthy if the 1st start timedate (but not the end timedate) overlaps with the 2nd time range', () => {
    const scheduleSlotTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T09:00:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T10:30:00.000Z')
    }
    const configurationTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T06:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T09:30:00.000Z')
    }
    const result = timeRangeOverlaps(scheduleSlotTimeRange, configurationTimeRange)
    expect(result).toBeTruthy()
  })

  it('should be truthy if the 1st end timedate (but not the start timedate) overlaps with the 2nd time range', () => {
    const scheduleSlotTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T05:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T07:30:00.000Z')
    }
    const configurationTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T06:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T09:30:00.000Z')
    }
    const result = timeRangeOverlaps(scheduleSlotTimeRange, configurationTimeRange)
    expect(result).toBeTruthy()
  })

  it('should be truthy if the 1st time range is within 2nd time range', () => {
    const scheduleSlotTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T09:00:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T09:15:00.000Z')
    }
    const configurationTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T06:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T09:30:00.000Z')
    }
    const result = timeRangeOverlaps(scheduleSlotTimeRange, configurationTimeRange)
    expect(result).toBeTruthy()
  })
})

describe(filterByTimeRange.name, () => {
  it('should be truthy if the shift is the same and the 1st time range is within the 2nd time range and overlaps with the 3rd time range', () => {
    const valueTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T09:00:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T10:30:00.000Z')
    }
    const shiftTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T06:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T14:30:00.000Z')
    }
    const configurationTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T06:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T09:30:00.000Z')
    }

    const result = filterByTimeRange(valueTimeRange, shiftTimeRange, configurationTimeRange)
    expect(result).toBeTruthy()
  })
})

describe(buildDateTimeWithShift.name, () => {
  it('should return the start datetime updated with the hour Moment instance', () => {
    const hourMoment = timeParser('08:30:00.000')
    const shiftTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T06:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T14:00:00.000Z')
    }

    const expectedResult = dateTimeParser('2021-11-10T08:30:00.000Z')
    const result = buildDateTimeWithShift(hourMoment, shiftTimeRange, Shift.morningShift)

    expect(result.isSame(expectedResult)).toBeTruthy()
  })

  it('should return the end datetime updated with the hour Moment instance', () => {
    const hourMoment = timeParser('01:30:00.000')
    const shiftTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T22:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-11T03:00:00.000Z')
    }

    const expectedResult = dateTimeParser('2021-11-11T01:30:00.000Z')
    const result = buildDateTimeWithShift(hourMoment, shiftTimeRange, Shift.nightShift)

    expect(result.isSame(expectedResult)).toBeTruthy()
  })
})

describe(checkSplitPosition.name, () => {
  const nightShiftTimeRange = {
    dateTimeStartUTC: dateTimeParser('2021-11-10T21:30:00.000Z'),
    dateTimeEndUTC: dateTimeParser('2021-11-11T05:30:00.000Z')
  }

  it('should return the same time range if it is not split', () => {
    const scheduleHour = ScheduleHourSchema.parse({ ...scheduleHours[1], hoursEndUTC: '12:45:00.000' })

    const shiftTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T06:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T13:00:00.000Z')
    }
    const configurationTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T06:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-10T13:00:00.000Z')
    }

    const result = checkSplitPosition(setDateTimeRange(scheduleHour, shiftTimeRange), configurationTimeRange)

    expect(result.split).toBe(undefined)
    expect(result.dateTimeStartUTC.toISOString()).toBe('2021-11-10T09:15:00.000Z')
    expect(result.dateTimeEndUTC.toISOString()).toBe('2021-11-10T12:45:00.000Z')
  })

  it('should return the same start time but a different end time if it is split and tagged as "First"', () => {
    const scheduleHour = ScheduleHourSchema.parse(scheduleHours[0])

    const configurationTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T21:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-11T00:00:00.000Z')
    }

    const result = checkSplitPosition(setDateTimeRange(scheduleHour, nightShiftTimeRange), configurationTimeRange)

    expect(result.split).toBe(SplitPosition.First)
    expect(result.dateTimeStartUTC.toISOString()).toBe('2021-11-10T22:00:00.000Z')
    expect(result.dateTimeEndUTC.toISOString()).toBe('2021-11-11T00:00:00.000Z')
  })

  it('should return the same end time but a different start time if it is split and tagged as "Last"', () => {
    const scheduleHour = ScheduleHourSchema.parse(scheduleHours[0])
    const configurationTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T22:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-11T03:00:00.000Z')
    }

    const result = checkSplitPosition(setDateTimeRange(scheduleHour, nightShiftTimeRange), configurationTimeRange)

    expect(result.split).toBe(SplitPosition.Last)
    expect(result.dateTimeStartUTC.toISOString()).toBe('2021-11-10T22:30:00.000Z')
    expect(result.dateTimeEndUTC.toISOString()).toBe('2021-11-11T00:15:00.000Z')
  })

  it('should return a different time range if it is split and tagged as "Middle"', () => {
    const scheduleHour = ScheduleHourSchema.parse(scheduleHours[0])

    const configurationTimeRange = {
      dateTimeStartUTC: dateTimeParser('2021-11-10T23:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2021-11-11T00:00:00.000Z')
    }

    const result = checkSplitPosition(setDateTimeRange(scheduleHour, nightShiftTimeRange), configurationTimeRange)

    expect(result.split).toBe(SplitPosition.Middle)
    expect(result.dateTimeStartUTC.toISOString()).toBe('2021-11-10T23:30:00.000Z')
    expect(result.dateTimeEndUTC.toISOString()).toBe('2021-11-11T00:00:00.000Z')
  })
})
