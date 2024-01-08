import moment, { Moment } from 'moment-timezone'
import { isNumber } from 'remeda'
import { z } from 'zod'
import { Shift as ShiftAPI } from 'API'
import { ExtendedScheduleSlot, GetStartEndDateForShift, Shift, ShiftTimeRange } from 'contexts/iProcessContext'
import { DATE_FORMAT, DateTimeRange, DURATION_FORMAT, durationIn, isAfterMidnight } from 'shared'

// Time query helper functions
const inputFormat = 'DD.MM.YYYY HH:mm:ss'
export const awsUtcDateTimeFormat = 'YYYY-MM-DD[T]HH:mm:ss.sss[Z]'
const utcDateTimeFormat = 'YYYY-MM-DD[T]HH:mm:ss[Z]'
export const globalLocalDateTimeFormat = 'YYYY-MM-DD[T]HH:mm:ss'
export const localDateTimeFormatTimePicker = 'YYYY-MM-DD[T]HH:mm'
export const localTimeFormat = 'HH:mm:ss'
export const formLocalTimeFormat = 'HH:mm'
const timeStampFormat = 'DD.MM.YYYY, HH:mm'

export const TWO_MINUTES_IN_MS = 1000 * 60 * 2

// Compare formats and determine wether is utc or not
const isWrongUtcFormat = (time: string) => {
  const isUtcFormat = moment(time, utcDateTimeFormat, true).isValid()
  if (isUtcFormat) {
    console.warn(`[UTCTimeConversion]: The utc date-time format received is incorrect => ${utcDateTimeFormat}`, {
      time
    })
    return true
  }
  return false
}

// Receives date and time and returns dateTime in awsUtcDateTimeFormat
export function getDateTimeForDateAndTime(currentDate: string, currentTime: string, timeZone: string): string {
  const [day, month, year] = currentDate.split('.')
  const newLocalDateTime = `${year}/${month}/${day} ${currentTime}`
  const localDateTime = new Date(newLocalDateTime)

  if (isDayLightSavingsTime(localDateTime, timeZone)) {
    return moment(localDateTime, inputFormat).utc().utcOffset(60).format(awsUtcDateTimeFormat)
  }
  return moment(localDateTime, inputFormat).utc().format(awsUtcDateTimeFormat)
}

// Receives local timeTabStart and returns utc time -8hours (awsUtcDateTimeFormat)
export function getUTCDateTimeEightHoursEarlier(timeTabStart: string, timeZone: string): string {
  if (isWrongUtcFormat(timeTabStart)) {
    if (isDayLightSavingsTime(moment(timeTabStart), timeZone)) {
      return moment(timeTabStart, utcDateTimeFormat)
        .utc()
        .utcOffset(60)
        .subtract(8, 'hours')
        .format(awsUtcDateTimeFormat)
    }
    return moment(timeTabStart, utcDateTimeFormat).utc().subtract(8, 'hours').format(awsUtcDateTimeFormat)
  }
  if (isDayLightSavingsTime(moment(timeTabStart), timeZone)) {
    return moment(timeTabStart, awsUtcDateTimeFormat)
      .utc()
      .utcOffset(60)
      .subtract(8, 'hours')
      .format(awsUtcDateTimeFormat)
  }
  return moment(timeTabStart, awsUtcDateTimeFormat).utc().subtract(8, 'hours').format(awsUtcDateTimeFormat)
}

export function getEightHoursEarlierForDateTime(dateTimeStartUTC: string) {
  return moment(dateTimeStartUTC, utcDateTimeFormat).subtract(8, 'hours').format(awsUtcDateTimeFormat)
}

const subtractFromDateTime = (hours: number, dateTime: string) => {
  return moment(dateTime, awsUtcDateTimeFormat).subtract(hours, 'hours').format(awsUtcDateTimeFormat)
}

export const subtractTwentyFourHours = (dateTime: string) => {
  return moment(dateTime, awsUtcDateTimeFormat).subtract(24, 'hours').format(awsUtcDateTimeFormat)
}

// Receives local dateTime and returns local dateTime + 23 hours and 59 minutes
export function getEndDateTimeForStartDateTime(startDateTime: string | undefined): string | undefined {
  if (startDateTime) {
    if (isWrongUtcFormat(startDateTime)) {
      return moment(startDateTime, utcDateTimeFormat)
        .add(24, 'hours')
        .subtract(1, 'minute')
        .format(globalLocalDateTimeFormat)
    }
    return moment(startDateTime, globalLocalDateTimeFormat)
      .add(24, 'hours')
      .subtract(1, 'minute')
      .format(globalLocalDateTimeFormat)
  }
}

function getEndDateTimeUTCForStartDateTimeUTC(startDateTimeUTC: string | undefined): string | undefined {
  if (startDateTimeUTC) {
    return moment(startDateTimeUTC, awsUtcDateTimeFormat)
      .add(24, 'hours')
      .subtract(1, 'minute')
      .format(awsUtcDateTimeFormat)
  }
}

// Receives local dateTime and returns local dateTime -1 minute
export function getOneMinuteEarlierForDateTime(dateTime: string, dateTimeFormat: 'local' | 'utc'): string {
  if (dateTimeFormat === 'local')
    return moment(dateTime, globalLocalDateTimeFormat).subtract(1, 'minute').format(globalLocalDateTimeFormat)
  return moment(dateTime, awsUtcDateTimeFormat).subtract(1, 'minute').format(awsUtcDateTimeFormat)
}

// Receives current local date and time and returns (utc dateTime -1 day) and (current utc dateTime - 1 minute) in awsUtcDateTimeFormat
export function getUTCStartEndDateForDay(
  currentDate: string,
  currentTime: string,
  timeZone: string
): GetStartEndDateForShift {
  // const now = new Date()
  const now = moment(currentDate, 'DD.MM.YYYY')
  const dateYesterday = moment(currentDate, 'DD.MM.YYYY').subtract(1, 'days').format('DD.MM.YYYY')
  let startDateTime = ''
  let endDateTime = ''
  if (isDayLightSavingsTime(now, timeZone)) {
    startDateTime = moment(`${dateYesterday} ${currentTime}`, inputFormat)
      .utc()
      .utcOffset(60)
      .format(awsUtcDateTimeFormat)
    endDateTime = moment(`${currentDate} ${currentTime}`, inputFormat)
      .utc()
      .utcOffset(60)
      .subtract(1, 'minute')
      .format(awsUtcDateTimeFormat)
  } else {
    startDateTime = moment(`${dateYesterday} ${currentTime}`, inputFormat).utc().format(awsUtcDateTimeFormat)
    endDateTime = moment(`${currentDate} ${currentTime}`, inputFormat)
      .utc()
      .subtract(1, 'minute')
      .format(awsUtcDateTimeFormat)
  }
  return { startDateTime, endDateTime }
}

// Receives local time (without offset) and returns utcDateTimeFormat
export function getUtcDateTimeFromLocalDateTime(time: string | undefined, timeZone: string) {
  const now = moment(time, 'YYYY-MM-DD[T]HH:mm:ss')
  if (time) {
    if (isDayLightSavingsTime(now, timeZone)) {
      return moment(time).utc().tz(timeZone).utc().utcOffset(60).format(awsUtcDateTimeFormat)
    }
    return moment(time).utc().tz(timeZone).utc().format(awsUtcDateTimeFormat)
  }
}

// Receives utc dateTime and returns local dateTime
export function getLocalDateTimeFromUtcDateTime(
  time: string | null | undefined,
  timeZone: string | null | undefined,
  shouldReadOffSet?: boolean
): string {
  if (time && timeZone) {
    const now = moment(time, utcDateTimeFormat)
    if (isDayLightSavingsTime(now, timeZone) && shouldReadOffSet)
      return moment(time).tz(timeZone).utcOffset(60).format(globalLocalDateTimeFormat)
    return moment(time).tz(timeZone).format(globalLocalDateTimeFormat)
  }
  console.warn('[getLocalDateTimeFromUtcDateTime] is receiving an incorrect date', {
    time,
    timeZone
  })
  return ''
}

// Receives utc dateTime and returns local dateTime
export function getLocalTimeFromUtcDateTime(time: string, timeZone: string | null | undefined) {
  if (time && timeZone) {
    const now = moment(time, utcDateTimeFormat)
    if (isDayLightSavingsTime(now, timeZone)) return moment(time).tz(timeZone).utcOffset(60).format(localTimeFormat)
    return moment(time).tz(timeZone).format(localTimeFormat)
  }
}

interface GetLocalTimeFromISOUtcProps {
  time: string
  timeZone: string
  isAdminApp?: boolean
  shouldReadOffSet?: boolean
}
// Receives utc time under HH:mm:ss:sss format and returns local time under HH:mm:ss:sss format
export function getLocalTimeFromISOUtc({
  time,
  timeZone,
  isAdminApp = false,
  shouldReadOffSet
}: GetLocalTimeFromISOUtcProps): string {
  const isoUtcString = `${time}Z`
  const now = new Date()
  if (isDayLightSavingsTime(now, timeZone) && shouldReadOffSet) {
    return moment(isoUtcString, 'HH:mm:ss.sssZ')
      .tz(timeZone)
      .utcOffset(60)
      .format(isAdminApp ? 'HH:mm' : localTimeFormat)
  }
  return moment(isoUtcString, 'HH:mm:ss.sssZ')
    .tz(timeZone)
    .format(isAdminApp ? 'HH:mm' : localTimeFormat)
}

export function getISOUtcTimeFromLocalTime(time: string, timeZone: string, date: Date = new Date()) {
  if (isDayLightSavingsTime(date, timeZone)) {
    return moment(time, formLocalTimeFormat).utc().tz(timeZone).utc().utcOffset(60).format('HH:mm:ss.sss')
  }
  return moment(time, formLocalTimeFormat).utc().tz(timeZone).utc().format('HH:mm:ss.sss')
}

interface GetStartEndDateForShiftParams {
  currentSchedule: ExtendedScheduleSlot | undefined
}

// receives currentDate, currentTime, currentSchedule (GetStartEndDateForShiftParams) and returns {startDateTime, endDateTime}
export function getStartEndDateForTime({ currentSchedule }: GetStartEndDateForShiftParams): GetStartEndDateForShift {
  return {
    startDateTime: currentSchedule?.dateTimeStart ?? '',
    endDateTime: currentSchedule?.dateTimeEnd ?? ''
  }
}

/**
 *
 * @param timeDifference It is the time difference be passed in the inputs e.g.("01:00") hour:min
 * @param hour integer and can be negative
 * @param min integer and can be negative
 * @returns  boolean
 */

const hasNegativeTime = (hour: number, min: number): boolean => {
  return hour < 0 || min < 0
}

interface CalculateTimeDifferenceValue {
  hoursStart: string
  hoursEnd: string
  downtime?: string
  shiftType: ShiftAPI
}

interface CalculateTimeDifferenceProps<T extends object> {
  timeReference?: string
  scheduleHour?: T
  today?: Date
}

const getCalculateTimeDifferenceDefault = () => ({ timeDifference: '00:00', hour: 0, min: 0, hasNegativeTime: false })

export const calculateTimeDifference = <T extends CalculateTimeDifferenceValue>({
  timeReference,
  scheduleHour,
  today = new Date()
}: CalculateTimeDifferenceProps<T>) => {
  // TODO VDD-333: properly validate 'scheduleHour'
  if (!scheduleHour) {
    return getCalculateTimeDifferenceDefault()
  }

  const { hoursStart, hoursEnd, downtime, shiftType } = scheduleHour

  if (!hoursStart || !hoursEnd) {
    return getCalculateTimeDifferenceDefault()
  }

  const tomorrow = today.setDate(today.getDate() + 1)
  const todayDate = moment.utc().format(DATE_FORMAT)
  const tomorrowDate = moment.utc(tomorrow).format(DATE_FORMAT)

  // If firstStartTime is lower than startTime, then we use today's date. Otherwise, we use tomorrow's date
  const isFirstMorningScheduleHour = timeReference === hoursStart && shiftType === ShiftAPI.morningShift
  const isTodayStartTime = (timeReference && hoursStart && timeReference <= hoursStart) || isFirstMorningScheduleHour
  // Add 1 minute to the startTime of first shift so the last endTime can match the startTime of the first Shift
  const startTimeOfFirstShift = moment(timeReference, DURATION_FORMAT).add(1, 'minute').format(DURATION_FORMAT)
  const isTodayEndTime = (hoursEnd && startTimeOfFirstShift <= hoursEnd) || isFirstMorningScheduleHour
  const convertedStartTime = isTodayStartTime ? `${todayDate}T${hoursStart}` : `${tomorrowDate}T${hoursStart}`
  const convertedEndTime = isTodayEndTime ? `${todayDate}T${hoursEnd}` : `${tomorrowDate}T${hoursEnd}`

  // Get difference between both dates and return the time difference, hour and minutes
  const timeDifferenceInMilliseconds = durationIn(
    moment(convertedEndTime, globalLocalDateTimeFormat),
    moment(convertedStartTime, globalLocalDateTimeFormat),
    { granularity: 'milliseconds', absolute: false }
  )
  const downtimeInMilliseconds = moment.duration(downtime || '00:00').asMilliseconds()
  const duration = moment.duration(timeDifferenceInMilliseconds - downtimeInMilliseconds)
  const hour = duration.hours()
  const min = duration.minutes()
  // convert negative numbers to positive
  const positiveMin = Math.abs(min)
  const positiveHour = Math.abs(hour)
  const timeDifference = [positiveHour.toString().padStart(2, '0'), positiveMin.toString().padStart(2, '0')].join(':')
  return {
    timeDifference,
    hour,
    min,
    hasNegativeTime: hasNegativeTime(hour, min)
  }
}

export const formatCreatedAtDate = (createdAt?: string | null) => {
  if (createdAt) {
    const date = new Date(createdAt)
    return `${moment(date).format('DD')}.${date.getMonth() + 1}.${date.getFullYear()}`
  }
}

// Receives a moment dateTime format and returns utc dateTime in awsUtcDateTimeFormat
export const getUTCDateTimeFromMomentDateTimeFormat = (dateTime: moment.Moment, timeZone: string, now = new Date()) => {
  if (isDayLightSavingsTime(now, timeZone)) return moment(dateTime).utc().utcOffset(60).format(awsUtcDateTimeFormat)
  return moment(dateTime).utc().format(awsUtcDateTimeFormat)
}

export const addTwentyFourHours = (dateTime: string) => {
  return moment(dateTime, awsUtcDateTimeFormat).add(24, 'hours').format(awsUtcDateTimeFormat)
}

export const addOneMinute = (dateTime: string) => {
  return moment(dateTime, awsUtcDateTimeFormat).add(1, 'minute').format(awsUtcDateTimeFormat)
}

interface GetShiftStartEndDateTimeUTCProps {
  morningShiftStart: moment.Moment
  afternoonShiftStart: moment.Moment
  nightShiftStart: moment.Moment
  selectedShift: Shift
  currentShift: Shift
  timeZone: string
  now?: Date
}

export const getShiftStartEndDateTimeUTC = ({
  morningShiftStart,
  afternoonShiftStart,
  nightShiftStart,
  selectedShift,
  currentShift,
  timeZone,
  now = new Date()
}: GetShiftStartEndDateTimeUTCProps): {
  dateTimeStartUTC: string | undefined
  dateTimeEndUTC: string | undefined
  workStartDateTimeUTC: string | undefined
  workEndDateTimeUTC: string | undefined
} => {
  let dateTimeStartUTC: string | undefined
  let dateTimeEndUTC: string | undefined
  let workStartDateTimeUTC: string | undefined
  const momentNow = moment(now)
  const midDay = moment(now).startOf('day').add(12, 'hours')

  // Convert all shifts times to UTC format
  const morningShiftStartUTC = getUTCDateTimeFromMomentDateTimeFormat(morningShiftStart, timeZone, now)
  const afternoonShiftStartUTC = getUTCDateTimeFromMomentDateTimeFormat(afternoonShiftStart, timeZone, now)
  const nightShiftStartUTC = getUTCDateTimeFromMomentDateTimeFormat(nightShiftStart, timeZone, now)
  const nightShiftEndUTC = addTwentyFourHours(getOneMinuteEarlierForDateTime(morningShiftStartUTC, 'utc'))

  /**
   * Since midNight is determined by the end of the nightShiftStartUTC,
   * the midNight is off by 1 extra day, therefore momentNow.isBefore(midNight) is true in any case.
   * This is why we add the midDay which is taken by the value => now = new Date() to determine whether
   * we are after the midnight of the nightshift or not
   *
   * If we are at 5 AM .. first case
   * If we are at 11 PM .. else case
   */
  switch (Shift[selectedShift]) {
    // Morning Shift is SELECTED
    case Shift[Shift.morningShift]: {
      switch (Shift[currentShift]) {
        case Shift[Shift.morningShift]:
        case Shift[Shift.afternoonShift]:
          dateTimeStartUTC = morningShiftStartUTC
          dateTimeEndUTC = getOneMinuteEarlierForDateTime(afternoonShiftStartUTC, 'utc')
          workStartDateTimeUTC = morningShiftStartUTC
          break

        case Shift[Shift.nightShift]:
          // midDay is 25 May 12:00 PM
          if (momentNow.isBefore(midDay)) {
            // momentNow is 25 May 03:00 PM
            dateTimeStartUTC = subtractTwentyFourHours(morningShiftStartUTC)
            dateTimeEndUTC = subtractTwentyFourHours(getOneMinuteEarlierForDateTime(afternoonShiftStartUTC, 'utc'))
            workStartDateTimeUTC = subtractTwentyFourHours(morningShiftStartUTC)
          } else {
            // momentNow is 25 May 23:00 PM
            dateTimeStartUTC = morningShiftStartUTC
            dateTimeEndUTC = getOneMinuteEarlierForDateTime(afternoonShiftStartUTC, 'utc')
            workStartDateTimeUTC = morningShiftStartUTC
          }
          break

        default:
          dateTimeStartUTC = undefined
          dateTimeEndUTC = undefined
          workStartDateTimeUTC = undefined
          break
      }

      break
    }

    // Afternoon Shift is SELECTED
    case Shift[Shift.afternoonShift]: {
      switch (Shift[currentShift]) {
        // Current Shift is Morning Shift
        case Shift[Shift.morningShift]: {
          // subtract 24 hours
          dateTimeStartUTC = subtractTwentyFourHours(afternoonShiftStartUTC)
          dateTimeEndUTC = subtractTwentyFourHours(getOneMinuteEarlierForDateTime(nightShiftStartUTC, 'utc'))
          workStartDateTimeUTC = morningShiftStartUTC
          break
        }
        // Current Shift is Afternoon Shift
        case Shift[Shift.afternoonShift]: {
          dateTimeStartUTC = afternoonShiftStartUTC
          dateTimeEndUTC = getOneMinuteEarlierForDateTime(nightShiftStartUTC, 'utc')
          workStartDateTimeUTC = morningShiftStartUTC
          break
        }

        // Current Shift is Night Shift
        case Shift[Shift.nightShift]: {
          // midDay is 25 May 12:00 PM
          if (momentNow.isBefore(midDay)) {
            // momentNow is 25 May 03:00 PM
            dateTimeStartUTC = subtractTwentyFourHours(afternoonShiftStartUTC)
            dateTimeEndUTC = subtractTwentyFourHours(getOneMinuteEarlierForDateTime(nightShiftStartUTC, 'utc'))
            workStartDateTimeUTC = subtractTwentyFourHours(morningShiftStartUTC)
          } else {
            // momentNow is 25 May 23:00 PM
            dateTimeStartUTC = afternoonShiftStartUTC
            dateTimeEndUTC = getOneMinuteEarlierForDateTime(nightShiftStartUTC, 'utc')
            workStartDateTimeUTC = morningShiftStartUTC
          }
          break
        }

        default: {
          dateTimeStartUTC = undefined
          dateTimeEndUTC = undefined
          workStartDateTimeUTC = undefined
        }
      }
      break
    }

    // Night Shift is SELECTED
    case Shift[Shift.nightShift]: {
      switch (Shift[currentShift]) {
        // Current Shift is Morning or Afternoon shift
        case Shift[Shift.morningShift]: // switch fall-through
        case Shift[Shift.afternoonShift]:
          // subtract 24 hours
          dateTimeStartUTC = subtractTwentyFourHours(nightShiftStartUTC)
          dateTimeEndUTC = subtractTwentyFourHours(nightShiftEndUTC)
          workStartDateTimeUTC = morningShiftStartUTC
          break

        case Shift[Shift.nightShift]:
          // midDay is 25 May 12:00 PM
          if (momentNow.isBefore(midDay)) {
            // momentNow is 25 May 03:00 PM
            dateTimeStartUTC = subtractTwentyFourHours(nightShiftStartUTC) // 24 May 21:30
            dateTimeEndUTC = subtractTwentyFourHours(nightShiftEndUTC) // 25 May 05:29
            workStartDateTimeUTC = subtractTwentyFourHours(morningShiftStartUTC)
          } else {
            // momentNow is 25 May 23:00 PM
            dateTimeStartUTC = nightShiftStartUTC // 25 May 21:30 PM
            dateTimeEndUTC = nightShiftEndUTC // 26 May 05:29
            workStartDateTimeUTC = morningShiftStartUTC
          }
          break
      }

      break
    }

    default: {
      dateTimeStartUTC = undefined
      dateTimeEndUTC = undefined
      workStartDateTimeUTC = undefined
    }
  }

  const workEndDateTimeUTC = getEndDateTimeUTCForStartDateTimeUTC(workStartDateTimeUTC)
  return { dateTimeStartUTC, dateTimeEndUTC, workStartDateTimeUTC, workEndDateTimeUTC }
}

export const getCurrentDateTimeUTC = (timeZone: string, date: Date = new Date()) => {
  if (isDayLightSavingsTime(date, timeZone)) {
    return moment(date).utc().utcOffset(60).format(awsUtcDateTimeFormat)
  }
  return moment(date).utc().format(awsUtcDateTimeFormat)
}

// true: DaylightSavings time, false: Winter time
export const isDayLightSavingsTime = (date: Date | moment.Moment, timeZone: string) => {
  return moment(date, timeZone).isDST()
}

export const getWorkStartDateTime = (hoursStart: string, now: moment.Moment = moment()) => {
  const [date] = now.format().split('T')
  const workStartDateTime = `${date}T${hoursStart}`
  return workStartDateTime
}

/**
 *
 * @param {string} localTime - The value to check if it's within interval - 08:30:00
 * @param {string | undefined } startDateTime - The start of the interval - '2022-07-26T08:00:00'
 * @param {string | undefined } endDateTime - The end of the interval - '2022-07-26T10:30:00'
 * @returns {boolean} true | false
 */
export const isTimeBetween = (
  localTime: string,
  startDateTime: string | undefined,
  endDateTime: string | undefined
) => {
  return moment(localTime, localTimeFormat)
    .utc()
    .isBetween(
      moment(startDateTime, globalLocalDateTimeFormat).utc(),
      moment(endDateTime, globalLocalDateTimeFormat).utc(),
      undefined,
      '[]'
    )
}

export const sumDuration = (previousDuration: string, duration: string | null | undefined = '00:00') => {
  const hours = moment(duration, formLocalTimeFormat).hours()
  const minutes = moment(duration, formLocalTimeFormat).minutes()
  return moment(previousDuration, formLocalTimeFormat)
    .add(hours, 'hours')
    .add(minutes, 'minutes')
    .format(formLocalTimeFormat)
}

const getMinutesFromMomentDateTime = (momentDateTime: moment.Moment | undefined) => {
  if (momentDateTime) return momentDateTime.hours() * 60 + momentDateTime.minute()
}

// morningShift starts at 06:30 or at 390 minutes
// afternoonShift starts at 14:30 or at 870 minutes
// nightShift starts at 22:30 or at 1.350 minutes
export const getShiftFromDateTime = (
  dateTime: string | undefined,
  morningShiftStart: moment.Moment | undefined,
  afternoonShiftStart: moment.Moment | undefined,
  nightShiftStart: moment.Moment | undefined
) => {
  const dateTimeMoment = moment(dateTime, localDateTimeFormatTimePicker)

  const currentMinutes = getMinutesFromMomentDateTime(dateTimeMoment)
  const morningShiftStartMinutes = getMinutesFromMomentDateTime(morningShiftStart)
  const afternoonShiftStartMinutes = getMinutesFromMomentDateTime(afternoonShiftStart)
  const nightShiftStartMinutes = getMinutesFromMomentDateTime(nightShiftStart)

  if (
    isNumber(currentMinutes) &&
    isNumber(morningShiftStartMinutes) &&
    isNumber(afternoonShiftStartMinutes) &&
    isNumber(nightShiftStartMinutes)
  ) {
    switch (true) {
      case currentMinutes >= morningShiftStartMinutes && currentMinutes < afternoonShiftStartMinutes:
        return ShiftAPI.morningShift
      case currentMinutes >= afternoonShiftStartMinutes && currentMinutes < nightShiftStartMinutes:
        return ShiftAPI.afternoonShift
      case currentMinutes < morningShiftStartMinutes || currentMinutes >= nightShiftStartMinutes:
        return ShiftAPI.nightShift

      default:
        break
    }
  }
  console.error('[getShiftFromDateTime]: no case was covered and "shiftType" is undefined', {
    currentMinutes,
    morningShiftStartMinutes,
    afternoonShiftStartMinutes,
    nightShiftStartMinutes
  })
}

/**
 *
 * @param {Shift} selectedShift Selected Shift (e.g. Morningshift, Afternooshift, Nightshift)
 * @param {ShiftTimeRange | undefined} shiftTimeRange This is stored in the scheduleContext and you need to pass the whole object as it is
 * @param {Shift} currentShift Current Shift (e.g. Morningshift, Afternooshift, Nightshift)
 * @param {string} timeZone
 * @param {moment.Moment} now Optional param and can be passed for testing purposes
 * @returns It returns a dateTimeUTC string. Per default it assume each shift last for 8 hours because we just want to get the disruptions that happen in the previous shift and finish in the current shift, so we don't need to be exact on the start time. Therefore it subtract 8 hours to the start of the current shift. In some cases (e.g. after midnight) there is a need to subtract 24 hours on top of the default 8 hours.
 */
export const previousShiftFirstHour = (
  selectedShift: Shift,
  shiftTimeRange: ShiftTimeRange | undefined,
  currentShift: Shift,
  timeZone: string,
  now: moment.Moment = moment()
) => {
  const isNowAfterMidnight = isAfterMidnight(now)
  const isNightShift = currentShift === Shift.nightShift
  const isAfternoonShift = currentShift === Shift.afternoonShift
  const isMorningShift = currentShift === Shift.morningShift

  let momentDateTime = moment()
  switch (selectedShift) {
    case Shift.morningShift:
      if (isNightShift && isNowAfterMidnight) {
        momentDateTime = moment(shiftTimeRange?.morningShiftStart)
          .subtract(8, 'hours')
          .subtract(1, 'day')
      } else {
        momentDateTime = moment(shiftTimeRange?.morningShiftStart).subtract(8, 'hours')
      }
      break
    case Shift.afternoonShift:
      if ((isNightShift && isNowAfterMidnight) || isMorningShift) {
        momentDateTime = moment(shiftTimeRange?.afternoonShiftStart)
          .subtract(8, 'hours')
          .subtract(1, 'day')
      } else {
        momentDateTime = moment(shiftTimeRange?.afternoonShiftStart).subtract(8, 'hours')
      }
      break
    case Shift.nightShift:
      if ((isNightShift && isNowAfterMidnight) || isAfternoonShift || isMorningShift) {
        momentDateTime = moment(shiftTimeRange?.nightShiftStart)
          .subtract(8, 'hours')
          .subtract(1, 'day')
      } else {
        momentDateTime = moment(shiftTimeRange?.nightShiftStart).subtract(8, 'hours')
      }
      break
  }

  return getUTCDateTimeFromMomentDateTimeFormat(momentDateTime, timeZone, new Date(now.format()))
}

export const formatTimeStamp = (dateTime: string) => {
  // This throws a warning if the format is not correct
  return moment(dateTime, globalLocalDateTimeFormat, true).format(timeStampFormat)
}

interface SelectedTabStartTimeProps {
  currentShiftScheduleSlots: Pick<ExtendedScheduleSlot, 'dateTimeStart'>[] | undefined
  selectedShiftTab: number
  currentShiftTab: number
  now?: string
}

export const getSelectedTabStartTime = ({
  currentShiftScheduleSlots,
  selectedShiftTab,
  currentShiftTab,
  now
}: SelectedTabStartTimeProps) => {
  const isEverythingDefined =
    currentShiftScheduleSlots &&
    selectedShiftTab !== currentShiftTab &&
    selectedShiftTab >= 0 &&
    currentShiftTab >= 0 &&
    currentShiftScheduleSlots[selectedShiftTab]

  if (isEverythingDefined) {
    return currentShiftScheduleSlots[selectedShiftTab]?.dateTimeStart
  }
  return now
}

interface GetTimeRangeProps {
  hours: number
  shiftTimeRange: ShiftTimeRange | undefined
  shouldReadPreviousShift: boolean
}

export const getTimeRange = ({
  hours,
  shiftTimeRange,
  shouldReadPreviousShift
}: GetTimeRangeProps): Partial<DateTimeRange<string>> => {
  if (shiftTimeRange) {
    if (shouldReadPreviousShift) {
      return {
        dateTimeStartUTC: subtractFromDateTime(hours, shiftTimeRange.dateTimeStartUTC),
        dateTimeEndUTC: getOneMinuteEarlierForDateTime(shiftTimeRange.dateTimeStartUTC, 'utc')
      }
    }

    return { dateTimeStartUTC: shiftTimeRange.dateTimeStartUTC, dateTimeEndUTC: shiftTimeRange.dateTimeEndUTC }
  }

  return {}
}

export type DateTimeParser<O = Moment> = (_: string | number | undefined | null) => O

export const durationTimeParser: DateTimeParser = (value) => moment(value, formLocalTimeFormat, true)
export const zodMomentParser = z
  .string()
  .transform((_) => moment.utc(_, 'YYYY-MM-DD[T]HH:mm:ss.sss[Z]', true))
  .refine((_) => _.isValid(), { message: 'field is not a valid DateTime' })

/**
 *
 * @param milliseconds
 * @returns hh:mm:ss
 */
export const millisecondsToTime = (milliseconds: number) => {
  const seconds = Math.floor((milliseconds / 1000) % 60)

  const minutes = Math.floor((milliseconds / 1000 / 60) % 60)

  const hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24)

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':')
}
