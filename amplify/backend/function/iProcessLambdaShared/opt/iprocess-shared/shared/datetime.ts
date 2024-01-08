import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import duration from 'dayjs/plugin/duration.js'
import isBetween from 'dayjs/plugin/isBetween.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import minMax from 'dayjs/plugin/minMax.js'
import utc from 'dayjs/plugin/utc.js'

dayjs.extend(utc)
dayjs.extend(minMax)
dayjs.extend(duration)
dayjs.extend(isSameOrBefore)
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

export const DayJS = dayjs.Dayjs

export type DayJS = dayjs.Dayjs
export type Duration = duration.Duration
export type DurationUnitType = duration.DurationUnitType

export { dayjs } // eslint-disable-line unicorn/prefer-export-from
