import log from 'loglevel'
import { Shift, SplitPosition } from 'iprocess-shared/graphql/index.js'

import { DateTimeRange, isAfterMidnight, buildDateTime } from 'iprocess-shared'
import { DayJS } from 'iprocess-shared/shared/datetime.js'

import { ScheduleHourEnriched, ZodScheduleHour } from './types.js'

const { First, Middle, Last } = SplitPosition

export function filterByTimeRange(
  timeRange: DateTimeRange<DayJS>,
  shiftTimeRange: DateTimeRange<DayJS>,
  configurationTimeRange: DateTimeRange<DayJS>
): boolean {
  if (!dateTimeRangeIsBetween(timeRange, shiftTimeRange) || !timeRangeOverlaps(timeRange, configurationTimeRange)) {
    log.debug(
      `The slot's time range is not within the configuration or shift time ranges`,
      JSON.stringify({
        timeRange,
        shiftTimeRange,
        configurationTimeRange
      })
    )

    return false
  }

  return true
}

export const setDateTimeRange = (
  { hoursStartUTC, hoursEndUTC, shiftType, ...rest }: ZodScheduleHour,
  shiftTimeRange: DateTimeRange<DayJS>
): ScheduleHourEnriched => ({
  ...rest,
  shiftType,
  dateTimeStartUTC: buildDateTimeWithShift(hoursStartUTC, shiftTimeRange, shiftType),
  dateTimeEndUTC: buildDateTimeWithShift(hoursEndUTC, shiftTimeRange, shiftType)
})

/**
 * Checks whether it has an split type or not, because it affects the datetime range
 *
 * ! TODO VDD-1000: Use case -> downtime set to undefined when scheduleSlot is splitted, to avoid negative quota.
 */
export const checkSplitPosition = (
  scheduleHour: ScheduleHourEnriched,
  configurationTimeRange?: DateTimeRange<DayJS>
) => {
  if (configurationTimeRange) {
    const { dateTimeStartUTC, dateTimeEndUTC } = scheduleHour
    const { dateTimeStartUTC: configurationStart, dateTimeEndUTC: configurationEnd } = configurationTimeRange

    // ? Configuration time range (dateTimeStartUTC, dateTimeEndUTC): |----|
    // ? ScheduleHour time range (hoursStartUTC, hoursEndUTC): [ ]
    if (dateTimeRangeIsBetween(configurationTimeRange, scheduleHour, true)) {
      // * 3rd case: [ |------| ]
      return {
        ...scheduleHour,
        split: Middle,
        dateTimeStartUTC: configurationStart,
        dateTimeEndUTC: configurationEnd,
        downtime: undefined
      }
    } else if (dateTimeStartUTC.isBefore(configurationStart)) {
      // * 2nd case: [ |-]-----|
      return { ...scheduleHour, split: Last, dateTimeStartUTC: configurationStart, downtime: undefined }
    } else if (dateTimeEndUTC.isAfter(configurationEnd)) {
      // * 1st case: |-----[-| ]
      return { ...scheduleHour, split: First, dateTimeEndUTC: configurationEnd, downtime: undefined }
    }
  }

  // * Otherwise do nothing ('split' is already undefined)
  return scheduleHour
}

/**
 * Builds a DateTime object by joining a Time value from 'ScheduleHour' and a Date value from the Shift's DateTime range
 * @param scheduleHourTime A Time value from an ScheduleHour item
 * @param shiftTimeRange The DateTime range of a {@link Shift}
 * @param shiftType The {@link Shift} type
 */
export const buildDateTimeWithShift = (
  scheduleHourTime: DayJS,
  { dateTimeStartUTC: shiftStart, dateTimeEndUTC: shiftEnd }: DateTimeRange<DayJS>,
  shiftType: Shift
) => {
  if (shiftType === Shift.nightShift && isAfterMidnight(scheduleHourTime)) {
    return buildDateTime(shiftEnd, scheduleHourTime)
  } else {
    return buildDateTime(shiftStart, scheduleHourTime)
  }
}

/**
 *
 * @param dateTimeRange Date time range to be compared within the dateTimeRangeRef
 * @param dateTimeRangeRef Date time range reference
 * @param isExclusive
 * @returns {boolean}
 */
export function dateTimeRangeIsBetween(
  { dateTimeStartUTC, dateTimeEndUTC }: DateTimeRange<DayJS>,
  { dateTimeStartUTC: referenceStart, dateTimeEndUTC: referenceEnd }: DateTimeRange<DayJS>,
  isExclusive: boolean = false
): boolean {
  return (
    dateTimeStartUTC.isBetween(referenceStart, referenceEnd, undefined, isExclusive ? '(]' : '[]') &&
    dateTimeEndUTC.isBetween(referenceStart, referenceEnd, undefined, isExclusive ? '[)' : '[]')
  )
}

export function timeRangeOverlaps(
  { dateTimeStartUTC, dateTimeEndUTC }: DateTimeRange<DayJS>,
  { dateTimeStartUTC: referenceStart, dateTimeEndUTC: referenceEnd }: DateTimeRange<DayJS>
): boolean {
  return (
    dateTimeStartUTC.isBetween(referenceStart, referenceEnd, undefined, '[]') ||
    dateTimeEndUTC.isBetween(referenceStart, referenceEnd, undefined, '[]') ||
    dateTimeRangeIsBetween(
      { dateTimeStartUTC: referenceStart, dateTimeEndUTC: referenceEnd },
      { dateTimeStartUTC, dateTimeEndUTC }
    )
  )
}
