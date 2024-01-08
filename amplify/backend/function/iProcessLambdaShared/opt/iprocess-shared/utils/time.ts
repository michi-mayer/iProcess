import { Shift, TimeRange } from '../graphql/API.js'
import { defined, definedArray } from '../shared/types.js'
import { buildDateTime, dateTimeParser, isAfterMidnight } from '../shared/time.js'
import { DayJS, DurationUnitType, dayjs } from '../shared/datetime.js'
import { toNumber } from '../shared/utils.js'

import { fromEnvironment } from './utils.js'

const CLOUDWATCH_RULE_REGEX = /rate\((\d+) ([a-z]+)\)/gi

export const extractValues = (value: string, regularExpression: RegExp) =>
  definedArray([...value.matchAll(regularExpression)][0])

export const getScheduleRate = (cloudWatchRule?: string) => {
  const input = cloudWatchRule ?? fromEnvironment('CLOUDWATCH_RULE', () => 'rate(24 hours)')
  const [, quantity, scale] = extractValues(input, CLOUDWATCH_RULE_REGEX)

  return dayjs.duration(toNumber(quantity), defined(scale) as DurationUnitType)
}

/**
 * Adjusts the date difference for two Time instances, when they're linked to a night shift
 *
 * * Assumptions:
 * *  - 'startTime' goes before 'endTime' e.g. the start and end of a ScheduleHour item
 * *  - Both Time instances have the same Date info e.g. they've been parsed with 'timeParser'
 */
export const adjustDateDifference = (startTime: DayJS, endTime: DayJS, shift: Shift) => {
  if (shift === Shift.nightShift && startTime.hour() >= 12 && endTime.hour() < 12) {
    // * when 'startTime' is before midnight and 'endTime' is after midnight
    return { startTime, endTime: endTime.add(1, 'day') }
  } else {
    return { startTime, endTime }
  }
}

/**
 * * Assumptions:
 * *  - One given day can only have one morningShift, one afternoonShift, and one nightShift
 * *  - Only considers a single ShiftPeriod
 *
 * @param timeRange {startDateTime, endDateTime}
 * @param time DateTime instance to get the time info. from
 * @param shift
 */
export const extendTimeWithDate = ({ startDateTime, endDateTime }: TimeRange, time: DayJS, shift: Shift) =>
  shift === Shift.nightShift && isAfterMidnight(time)
    ? buildDateTime(dateTimeParser(endDateTime), time)
    : buildDateTime(dateTimeParser(startDateTime), time)
