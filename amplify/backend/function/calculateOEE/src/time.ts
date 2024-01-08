import { DURATION_FORMAT, durationIn, invalidDateTime, dateTimeParser, sortByDateTime } from 'iprocess-shared'
import { DayJS, dayjs } from 'iprocess-shared/shared/datetime.js'

import { ZodDisruption, ZodOEE } from './types.js'

const ENOUGH_DURATION_FACTOR = 3

export class TimeRange {
  readonly start: DayJS
  readonly end: DayJS
  readonly isValid: boolean

  constructor(start: DayJS, end: DayJS) {
    this.start = start
    this.end = end

    this.isValid = this.start.isValid() && this.end.isValid()
  }

  toString() {
    return `${this.start.toISOString()} - ${this.end.toISOString()}`
  }

  static fromString(startDate: string, endDate: string) {
    return new TimeRange(dateTimeParser(startDate), dateTimeParser(endDate))
  }

  static empty() {
    return new TimeRange(invalidDateTime(), invalidDateTime())
  }
}

export const isShiftOngoing = ({ end }: TimeRange, now: DayJS): boolean => now.isSameOrBefore(end)

export const sortByUpdatedAt = sortByDateTime<ZodOEE>((_) => _.updatedAt)

export const updateDuration = (item: ZodDisruption, shiftTimeRange: TimeRange) => {
  item.duration = calculateDurationByTimeRange(item, shiftTimeRange)
  return item
}

export const calculateDurationByTimeRange = (disruption: ZodDisruption, timeRange: TimeRange) => {
  const start = dayjs.max(disruption.startTimeDateUTC, timeRange.start)
  const end = dayjs.min(disruption.endTimeDateUTC, timeRange.end)
  const diff = Math.abs(end.diff(start, 'milliseconds'))

  return dayjs.utc(diff).format(DURATION_FORMAT)
}

export const durationIsEnough = (value: number, targetCycleTime: number) =>
  value > ENOUGH_DURATION_FACTOR * targetCycleTime

export const durationFromTimeRange = (disruption: ZodDisruption, shiftTimeRange: TimeRange) => {
  if (disruption.startTimeDateUTC.isBefore(shiftTimeRange.start)) {
    return durationIn(disruption.endTimeDateUTC, shiftTimeRange.start, { granularity: 'minutes' })
  } else if (disruption.endTimeDateUTC.isAfter(shiftTimeRange.end)) {
    return durationIn(shiftTimeRange.end, disruption.startTimeDateUTC, { granularity: 'minutes' })
  } else {
    return durationIn(disruption.endTimeDateUTC, disruption.startTimeDateUTC, { granularity: 'minutes' })
  }
}
