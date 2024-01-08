import moment from 'moment-timezone'
import { assert, describe, it } from 'vitest'
import { Shift as ShiftAPI, Type } from 'API'
import { IScheduleHour } from 'components/Dialogs/Admin/ShiftModelForm'
import { ExtendedScheduleSlot, Shift, ShiftTimeRange } from 'contexts/iProcessContext'
import {
  addTwentyFourHours,
  calculateTimeDifference,
  formatCreatedAtDate,
  getCurrentDateTimeUTC,
  getDateTimeForDateAndTime,
  getEightHoursEarlierForDateTime,
  getEndDateTimeForStartDateTime,
  getISOUtcTimeFromLocalTime,
  getLocalDateTimeFromUtcDateTime,
  getLocalTimeFromISOUtc,
  getOneMinuteEarlierForDateTime,
  getSelectedTabStartTime,
  getShiftFromDateTime,
  getShiftStartEndDateTimeUTC,
  getTimeRange,
  getUTCDateTimeEightHoursEarlier,
  getUtcDateTimeFromLocalDateTime,
  getUTCDateTimeFromMomentDateTimeFormat,
  getUTCStartEndDateForDay,
  getWorkStartDateTime,
  globalLocalDateTimeFormat,
  isDayLightSavingsTime,
  isTimeBetween,
  localTimeFormat,
  millisecondsToTime,
  previousShiftFirstHour,
  subtractTwentyFourHours,
  sumDuration
} from 'helper/time'

const timeZone = 'Europe/Berlin'
// const timeZone = "America/New_York"
// const timeZone = "Australia/Melbourne"

const date = '28.01.2022'
const dateDaylightSavings = '28.04.2022'
const time = '10:12:00'
const dateTimeUtcFormat = '2022-01-28T10:12:00Z'
const dateTimeUtcFormatDaylightSavings = '2022-04-28T10:12:00Z'
const dateTimeUtcFormatWinter = '2022-01-28T10:12:00Z'
const dateTimeAwsUtcFormat = '2022-01-28T10:12:00.000Z'
const dateTimeLocalFormat = '2022-01-28T10:12:00'
const winterDate = new Date('January 31, 2022 10:00:00')
const daylightSavingsDate = new Date('May 1, 2022 10:00:00')
const shouldReadOffSet = true
const shiftTimeRange: ShiftTimeRange = {
  startTime: '06:30:00',
  endTime: '14:30:00',
  dateTimeStart: '2022-12-16T06:30:00',
  dateTimeEnd: '2022-12-16T14:30:00',
  dateTimeStartUTC: '2022-12-16T05:30:00.000Z',
  dateTimeEndUTC: '2022-12-16T13:29:00.000Z',
  workStartDateTimeUTC: '2022-12-16T05:30:00.000Z',
  workEndDateTimeUTC: '2022-12-17T05:29:00.000Z',
  workStartDateTime: '2022-12-16T06:30:00',
  workEndDateTime: '2022-12-17T06:29:00',
  morningShiftStart: moment('2022-12-16T06:30:00'),
  afternoonShiftStart: moment('2022-12-16T14:30:00'),
  nightShiftStart: moment('2022-12-16T22:30:00')
}

export const calculateTimeDifferenceSchedule: IScheduleHour[] = [
  {
    id: '0',
    type: Type.Production,
    hoursStart: '06:30',
    hoursEnd: '07:30',
    shiftType: ShiftAPI.morningShift,
    timeZone: 'Europe/Berlin'
  },
  {
    id: '1',
    type: Type.Pause,
    hoursStart: '15:30',
    hoursEnd: '15:00',
    shiftType: ShiftAPI.afternoonShift,
    timeZone: 'Europe/Berlin'
  },
  {
    id: '2',
    type: Type.Inactive,
    hoursStart: '22:30',
    hoursEnd: '23:30',
    shiftType: ShiftAPI.nightShift,
    timeZone: 'Europe/Berlin'
  },
  {
    id: '3',
    type: Type.Production,
    hoursStart: '04:30',
    hoursEnd: '05:30',
    shiftType: ShiftAPI.nightShift,
    timeZone: 'Europe/Berlin'
  },
  {
    id: '4',
    type: Type.Production,
    hoursStart: '06:30',
    hoursEnd: '05:30',
    downtime: '00:05',
    shiftType: ShiftAPI.morningShift,
    timeZone: 'Europe/Berlin'
  },
  {
    id: '5',
    type: Type.Production,
    hoursStart: '23:30',
    hoursEnd: '01:30',
    shiftType: ShiftAPI.nightShift,
    timeZone: 'Europe/Berlin'
  }
]

export const currentShiftScheduleSlots: Pick<ExtendedScheduleSlot, 'dateTimeStart'>[] = [
  { dateTimeStart: '2023-02-02T06:30:00' },
  { dateTimeStart: '2023-02-02T08:30:00' },
  { dateTimeStart: '2023-02-02T10:30:00' },
  { dateTimeStart: '2023-02-02T12:30:00' },
  { dateTimeStart: '2023-02-02T13:30:00' }
]

describe(getDateTimeForDateAndTime.name, function () {
  it('Receives winter date and time and returns dateTime in awsUtcFormat', function () {
    const expected = '2022-01-28T09:12:00.000Z'
    const result = getDateTimeForDateAndTime(date, time, timeZone)
    return assert.strictEqual(result, expected)
  })
  it('Receives summer date and time and returns dateTime in awsUtcFormat', function () {
    const expected = '2022-04-28T09:12:00.000Z'
    const result = getDateTimeForDateAndTime(dateDaylightSavings, time, timeZone)
    return assert.strictEqual(result, expected)
  })
})

describe(getEndDateTimeForStartDateTime.name, function () {
  it('Receives local dateTime (utcFormat) and returns local dateTime + 23 hours and 59 minutes', function () {
    const expected = '2022-01-29T10:11:00'
    const result = getEndDateTimeForStartDateTime(dateTimeUtcFormat)
    return assert.strictEqual(result, expected)
  })

  it('Receives local dateTime (localFormat) and returns local dateTime + 23 hours and 59 minutes', function () {
    const expected = '2022-01-29T10:11:00'
    const result = getEndDateTimeForStartDateTime(dateTimeLocalFormat)
    return assert.strictEqual(result, expected)
  })
})

describe(getUTCDateTimeEightHoursEarlier.name, function () {
  it('Receives local timeTabStart (utcformat) and returns utc time -8hours (awsUtcFormat)', function () {
    const expected = '2022-01-28T01:12:00.000Z'
    const result = getUTCDateTimeEightHoursEarlier(dateTimeUtcFormat, timeZone)
    return assert.strictEqual(result, expected)
  })

  it('Receives local timeTabStart (awsUtcformat) and returns utc time -8hours (awsUtcFormat)', function () {
    const expected = '2022-01-28T01:12:00.000Z'
    const result = getUTCDateTimeEightHoursEarlier(dateTimeAwsUtcFormat, timeZone)
    return assert.strictEqual(result, expected)
  })

  it('Receives local timeTabStart (utcformat) and returns utc time -8hours (awsUtcFormat)', function () {
    const expected = '2022-01-28T01:12:00.000Z'
    const result = getUTCDateTimeEightHoursEarlier(dateTimeUtcFormatWinter, timeZone)
    return assert.strictEqual(result, expected)
  })

  it('Receives local timeTabStart (awsUtcformat) and returns utc time -8hours (awsUtcFormat)', function () {
    const expected = '2022-04-28T01:12:00.000Z'
    const result = getUTCDateTimeEightHoursEarlier(dateTimeUtcFormatDaylightSavings, timeZone)
    return assert.strictEqual(result, expected)
  })
})

describe(getEightHoursEarlierForDateTime.name, function () {
  it('Receives dateTimeStart (awsUtcFormat) and returns utc time -8hours (awsUtcFormat)', function () {
    const expected = '2022-01-28T02:12:00.000Z'
    const result = getEightHoursEarlierForDateTime(dateTimeAwsUtcFormat)
    return assert.strictEqual(result, expected)
  })
})

describe(getOneMinuteEarlierForDateTime.name, function () {
  it('Receives local dateTime (localFormat) and returns local dateTime -1 minute (localFormat)', function () {
    const expected = '2022-01-28T10:11:00'
    const result = getOneMinuteEarlierForDateTime(dateTimeLocalFormat, 'local')
    return assert.strictEqual(result, expected)
  })

  it('Receives local dateTime (awsUtcFormat) and returns local dateTime -1 minute (awsUtcFormat)', function () {
    const expected = '2022-01-28T10:11:00.000Z'
    const result = getOneMinuteEarlierForDateTime(dateTimeAwsUtcFormat, 'utc')
    return assert.strictEqual(result, expected)
  })
})

// Winter Time utc + 1, daylightsavings time utc + 2

describe(getUTCStartEndDateForDay.name, function () {
  it('Receives local date (winter time) and time and returns (utc dateTime -1 day) as startDateTime (awsUtcFormat)', function () {
    const expected = '2022-01-27T09:12:00.000Z'
    const result = getUTCStartEndDateForDay(date, time, timeZone).startDateTime
    return assert.strictEqual(result, expected)
  })

  it('Receives local date (summer time) and time and returns (utc dateTime -1 day) as startDateTime (awsUtcFormat)', function () {
    const expected = '2022-04-27T09:12:00.000Z'
    const result = getUTCStartEndDateForDay(dateDaylightSavings, time, timeZone).startDateTime
    return assert.strictEqual(result, expected)
  })

  it('Receives local date (winter time) and time and returns (current utc dateTime - 1 minute) as endDateTime (awsUtcFormat)', function () {
    const expected = '2022-01-28T09:11:00.000Z'
    const result = getUTCStartEndDateForDay(date, time, timeZone).endDateTime
    return assert.strictEqual(result, expected)
  })

  it('Receives local date (summer time) and time and returns (current utc dateTime - 1 minute) as endDateTime (awsUtcFormat)', function () {
    const expected = '2022-04-28T09:11:00.000Z'
    const result = getUTCStartEndDateForDay(dateDaylightSavings, time, timeZone).endDateTime
    return assert.strictEqual(result, expected)
  })
})

describe(getUtcDateTimeFromLocalDateTime.name, function () {
  it('Receives local time (without offset) and returns utcFormat', function () {
    const expected = '2022-01-28T09:12:00.000Z'
    const result = getUtcDateTimeFromLocalDateTime(dateTimeLocalFormat, timeZone)
    return assert.strictEqual(result, expected)
  })
})

describe(getLocalDateTimeFromUtcDateTime.name, function () {
  it('Receives utc dateTime and returns local dateTime in summer', function () {
    const expected = '2022-04-28T11:12:00'
    const result = getLocalDateTimeFromUtcDateTime(dateTimeUtcFormatDaylightSavings, timeZone, shouldReadOffSet)
    return assert.strictEqual(result, expected)
  })

  it('Receives utc dateTime and returns local dateTime in winter', function () {
    const expected = '2022-01-28T11:12:00'
    const result = getLocalDateTimeFromUtcDateTime(dateTimeUtcFormatWinter, timeZone, shouldReadOffSet)
    return assert.strictEqual(result, expected)
  })
})

describe(getLocalTimeFromISOUtc.name, function () {
  it('Receives utc time under HH:mm:ss format and returns local time under HH:mm:ss format', function () {
    const time = moment().utc().format('HH:mm:ss:sss')
    const expected = moment(`${time}Z`, 'HH:mm:ss:sssZ').tz(timeZone).format('HH:mm:ss')
    const result = getLocalTimeFromISOUtc({ time, timeZone, isAdminApp: false })
    return assert.strictEqual(result, expected)
  })
})

describe(isDayLightSavingsTime.name, () => {
  it('Receives Date or moment.Moment and returns if date is in Winter time', () => {
    const expected = false
    const result = isDayLightSavingsTime(winterDate, timeZone)
    return assert.strictEqual(result, expected)
  })

  it('Receives Date or moment.Moment and returns if date is in Summer time', () => {
    const expected = true
    const result = isDayLightSavingsTime(daylightSavingsDate, timeZone)
    return assert.strictEqual(result, expected)
  })
})

describe(getCurrentDateTimeUTC.name, () => {
  it("Receives Date in Winter Time and returns if it's in awsUtcDateTimeFormat", () => {
    const expected = '2022-01-31T09:00:00.000Z'
    const result = getCurrentDateTimeUTC(timeZone, winterDate)
    return assert.strictEqual(result, expected)
  })

  it("Receives Date in DaylightSavings Time and returns if it's in awsUtcDateTimeFormat", () => {
    const expected = '2022-05-01T09:00:00.000Z'
    const result = getCurrentDateTimeUTC(timeZone, daylightSavingsDate)
    return assert.strictEqual(result, expected)
  })
})

describe(isDayLightSavingsTime.name, () => {
  it('Receives daylightSavingsDate and time and returns time in ISOUtc', () => {
    const expected = isDayLightSavingsTime(new Date(), timeZone) ? '09:12:00.000' : '10:12:00.000'

    const result = getISOUtcTimeFromLocalTime(time, timeZone, daylightSavingsDate)
    return assert.strictEqual(result, expected)
  })

  it('Receives winterDate and time and returns time in ISOUtc', () => {
    const expected = isDayLightSavingsTime(new Date(), timeZone) ? '08:12:00.000' : '09:12:00.000'

    const result = getISOUtcTimeFromLocalTime(time, timeZone, winterDate)
    return assert.strictEqual(result, expected)
  })
})

describe(formatCreatedAtDate.name, () => {
  it('Receives a string date and returns the same date formated as DD.MM.YYYY', () => {
    const expected = '28.1.2022'
    const result = formatCreatedAtDate(dateTimeLocalFormat)

    return assert.strictEqual(result, expected)
  })
})

describe(getUTCDateTimeFromMomentDateTimeFormat.name, () => {
  it('Receives a moment dateTime format in winter time and returns utc dateTime in awsUtcDateTimeFormat', () => {
    const expected = isDayLightSavingsTime(new Date(), timeZone)
      ? '2022-01-31T10:00:00.000Z'
      : '2022-01-31T09:00:00.000Z'

    const date = moment(winterDate) // 10:00
    const result = getUTCDateTimeFromMomentDateTimeFormat(date, timeZone)

    return assert.strictEqual(result, expected)
  })

  it('Receives a moment dateTime format in daylightsavings time and returns utc dateTime in awsUtcDateTimeFormat', () => {
    const expected = isDayLightSavingsTime(new Date(), timeZone)
      ? '2022-05-01T09:00:00.000Z'
      : '2022-05-01T08:00:00.000Z'

    const date = moment(daylightSavingsDate) // 10:00
    const result = getUTCDateTimeFromMomentDateTimeFormat(date, timeZone)

    return assert.strictEqual(result, expected)
  })
})

describe(subtractTwentyFourHours.name, () => {
  it('Receives a string date and returns -24h in awsUtcDateTimeFormat', () => {
    const expected = '2022-01-27T10:12:00.000Z'
    const result = subtractTwentyFourHours(dateTimeLocalFormat)

    return assert.strictEqual(result, expected)
  })
})

describe(calculateTimeDifference.name, () => {
  it('Should return negative time when is Morning shift and hours end is lower than hours start', () => {
    const scheduleHour = { hoursStart: '14:00', hoursEnd: '12:00', shiftType: ShiftAPI.morningShift }
    const expected = { timeDifference: '02:00', hour: -2, min: -0, hasNegativeTime: true }
    const result = calculateTimeDifference({ timeReference: '10:00', scheduleHour })
    assert.deepStrictEqual(result, expected)
  })

  it('Should return positive time when  is Morning shift hoursStart is lower than hoursEnd', () => {
    const timeReference = '10:00'
    const scheduleHour = { hoursStart: '10:00', hoursEnd: '12:00', shiftType: ShiftAPI.morningShift }
    const expected = {
      timeDifference: '02:00',
      hour: 2,
      min: 0,
      hasNegativeTime: false
    }
    const result = calculateTimeDifference({ timeReference, scheduleHour })

    assert.deepStrictEqual(result, expected)
  })

  it('Should subtract the downtime from the time difference and should be positive time', () => {
    const timeReference = '10:00'
    const scheduleHour = { hoursStart: '10:00', hoursEnd: '12:00', downtime: '00:30', shiftType: ShiftAPI.morningShift }
    const expected = {
      timeDifference: '01:30',
      hour: 1,
      min: 30,
      hasNegativeTime: false
    }
    const result = calculateTimeDifference({ timeReference, scheduleHour })
    assert.deepStrictEqual(result, expected)
  })

  it('Should return positive time and 1 hour time difference in a night shift', () => {
    const expected = { timeDifference: '01:00', hour: 1, min: 0, hasNegativeTime: false }
    const timeReference = '06:30'

    const result = calculateTimeDifference({
      timeReference,
      scheduleHour: calculateTimeDifferenceSchedule[3]
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Should return negative time and subtract downtime', () => {
    const expected = { timeDifference: '01:05', hour: -1, min: -5, hasNegativeTime: true }

    const timeReference = '07:00'

    const result = calculateTimeDifference({
      timeReference,
      scheduleHour: calculateTimeDifferenceSchedule[4]
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Should return positive time and 2 hours difference in a nightShift between two days', () => {
    const expected = { timeDifference: '02:00', hour: 2, min: 0, hasNegativeTime: false }

    const timeReference = '06:30'

    const result = calculateTimeDifference({
      timeReference,
      scheduleHour: calculateTimeDifferenceSchedule[5]
    })

    return assert.deepStrictEqual(result, expected)
  })
})

describe(`${getShiftStartEndDateTimeUTC.name} - SUMMER TIME`, () => {
  const morningShiftStart = moment('2022-05-04T06:30:00+02:00', globalLocalDateTimeFormat)
  const afternoonShiftStart = moment('2022-05-04T14:30:00+02:00', globalLocalDateTimeFormat)
  const nightShiftStart = moment('2022-05-04T22:30:00+02:00', globalLocalDateTimeFormat)
  const morningShiftStartAfterMidnight = moment('2022-05-05T06:30:00+02:00', globalLocalDateTimeFormat)
  const afternoonShiftStartAfterMidnight = moment('2022-05-05T14:30:00+02:00', globalLocalDateTimeFormat)
  const nightShiftStartAfterMidnight = moment('2022-05-05T22:30:00+02:00', globalLocalDateTimeFormat)

  // test MorningShift is selected

  it('Receives selectedShift as morningShift and currentShift as morningShift and returns dateTimeStartUTC, dateTimeEndUTC in SUMMER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-05-04T05:30:00.000Z',
      dateTimeEndUTC: '2022-05-04T13:29:00.000Z',
      workStartDateTimeUTC: '2022-05-04T05:30:00.000Z',
      workEndDateTimeUTC: '2022-05-05T05:29:00.000Z'
    }

    const selectedShift = Shift.morningShift
    const currentShift = Shift.morningShift
    const now = new Date('2022-05-04T06:30:00')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as morningShift and currentShift as morningShift and returns dateTimeStartUTC, dateTimeEndUTC in SUMMER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-05-04T05:30:00.000Z',
      dateTimeEndUTC: '2022-05-04T13:29:00.000Z',
      workStartDateTimeUTC: '2022-05-04T05:30:00.000Z',
      workEndDateTimeUTC: '2022-05-05T05:29:00.000Z'
    }

    const selectedShift = Shift.morningShift
    const currentShift = Shift.morningShift
    const now = new Date('2022-05-04T14:29:00')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as morningShift and currentShift as afternoonShift and returns dateTimeStartUTC, dateTimeEndUTC in SUMMER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-05-04T05:30:00.000Z',
      dateTimeEndUTC: '2022-05-04T13:29:00.000Z',
      workStartDateTimeUTC: '2022-05-04T05:30:00.000Z',
      workEndDateTimeUTC: '2022-05-05T05:29:00.000Z'
    }

    const selectedShift = Shift.morningShift
    const currentShift = Shift.afternoonShift
    const now = new Date('2022-05-04T14:30:00')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as morningShift and currentShift as nightShift before midNight and returns dateTimeStartUTC, dateTimeEndUTC in SUMMER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-05-04T05:30:00.000Z',
      dateTimeEndUTC: '2022-05-04T13:29:00.000Z',
      workStartDateTimeUTC: '2022-05-04T05:30:00.000Z',
      workEndDateTimeUTC: '2022-05-05T05:29:00.000Z'
    }

    const selectedShift = Shift.morningShift
    const currentShift = Shift.nightShift
    const now = new Date('2022-05-04T23:40:00') // We can use any hour from 22:30 to 00:00

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as morningShift and currentShift as nightShift after midNight and returns dateTimeStartUTC, dateTimeEndUTC in SUMMER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-05-04T05:30:00.000Z',
      dateTimeEndUTC: '2022-05-04T13:29:00.000Z',
      workStartDateTimeUTC: '2022-05-04T05:30:00.000Z',
      workEndDateTimeUTC: '2022-05-05T05:29:00.000Z'
    }

    const selectedShift = Shift.morningShift
    const currentShift = Shift.nightShift
    const now = new Date('2022-05-05T00:01:00')
    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart: morningShiftStartAfterMidnight,
      afternoonShiftStart: afternoonShiftStartAfterMidnight,
      nightShiftStart: nightShiftStartAfterMidnight,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  // test AfternoonShift is selected

  it('Receives selectedShift as afternoonShift and currentShift as morningShift and returns dateTimeStartUTC, dateTimeEndUTC in SUMMER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-05-03T13:30:00.000Z',
      dateTimeEndUTC: '2022-05-03T21:29:00.000Z',
      workStartDateTimeUTC: '2022-05-04T05:30:00.000Z',
      workEndDateTimeUTC: '2022-05-05T05:29:00.000Z'
    }

    const selectedShift = Shift.afternoonShift
    const currentShift = Shift.morningShift
    const now = new Date('2022-05-04T14:29:00')
    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })
    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as afternoonShift and currentShift as afternoonShift and returns dateTimeStartUTC, dateTimeEndUTC in SUMMER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-05-04T13:30:00.000Z',
      dateTimeEndUTC: '2022-05-04T21:29:00.000Z',
      workStartDateTimeUTC: '2022-05-04T05:30:00.000Z',
      workEndDateTimeUTC: '2022-05-05T05:29:00.000Z'
    }

    const selectedShift = Shift.afternoonShift
    const currentShift = Shift.afternoonShift
    const now = new Date('2022-05-04T14:30:00')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as afternoonShift and currentShift as nightShift before midNight and returns dateTimeStartUTC, dateTimeEndUTC in SUMMER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-05-04T13:30:00.000Z',
      dateTimeEndUTC: '2022-05-04T21:29:00.000Z',
      workStartDateTimeUTC: '2022-05-04T05:30:00.000Z',
      workEndDateTimeUTC: '2022-05-05T05:29:00.000Z'
    }

    const selectedShift = Shift.afternoonShift
    const currentShift = Shift.nightShift
    const now = new Date('2022-05-04T22:30:00')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as afternoonShift and currentShift as nightShift after midNight and returns dateTimeStartUTC, dateTimeEndUTC in SUMMER time at 00:01', () => {
    const expected = {
      dateTimeStartUTC: '2022-05-04T13:30:00.000Z',
      dateTimeEndUTC: '2022-05-04T21:29:00.000Z',
      workStartDateTimeUTC: '2022-05-04T05:30:00.000Z',
      workEndDateTimeUTC: '2022-05-05T05:29:00.000Z'
    }

    const selectedShift = Shift.afternoonShift
    const currentShift = Shift.nightShift
    const now = new Date('2022-05-05T00:01:00')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart: morningShiftStartAfterMidnight,
      afternoonShiftStart: afternoonShiftStartAfterMidnight,
      nightShiftStart: nightShiftStartAfterMidnight,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as afternoonShift and currentShift as nightShift after midNight and returns dateTimeStartUTC, dateTimeEndUTC in SUMMER time at 02:00AM', () => {
    const expected = {
      dateTimeStartUTC: '2022-05-04T13:30:00.000Z',
      dateTimeEndUTC: '2022-05-04T21:29:00.000Z',
      workStartDateTimeUTC: '2022-05-04T05:30:00.000Z',
      workEndDateTimeUTC: '2022-05-05T05:29:00.000Z'
    }

    const selectedShift = Shift.afternoonShift
    const currentShift = Shift.nightShift
    const now = new Date('2022-05-05T02:00:00')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart: morningShiftStartAfterMidnight,
      afternoonShiftStart: afternoonShiftStartAfterMidnight,
      nightShiftStart: nightShiftStartAfterMidnight,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as afternoonShift and currentShift as nightShift after midNight and returns dateTimeStartUTC, dateTimeEndUTC in SUMMER time at 05:00AM', () => {
    const expected = {
      dateTimeStartUTC: '2022-05-04T13:30:00.000Z',
      dateTimeEndUTC: '2022-05-04T21:29:00.000Z',
      workStartDateTimeUTC: '2022-05-04T05:30:00.000Z',
      workEndDateTimeUTC: '2022-05-05T05:29:00.000Z'
    }

    const selectedShift = Shift.afternoonShift
    const currentShift = Shift.nightShift
    const now = new Date('2022-05-05T05:00:00')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart: morningShiftStartAfterMidnight,
      afternoonShiftStart: afternoonShiftStartAfterMidnight,
      nightShiftStart: nightShiftStartAfterMidnight,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  // test NightShift is selected

  it('Receives selectedShift as nightShift and currentShift as morningShift after midNight and returns dateTimeStartUTC, dateTimeEndUTC in SUMMER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-05-03T21:30:00.000Z',
      dateTimeEndUTC: '2022-05-04T05:29:00.000Z',
      workStartDateTimeUTC: '2022-05-04T05:30:00.000Z',
      workEndDateTimeUTC: '2022-05-05T05:29:00.000Z'
    }

    const selectedShift = Shift.nightShift
    const currentShift = Shift.morningShift
    const now = new Date('2022-05-04T06:30:00')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as nightShift and currentShift as afternoonShift after midNight and returns dateTimeStartUTC, dateTimeEndUTC in SUMMER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-05-03T21:30:00.000Z',
      dateTimeEndUTC: '2022-05-04T05:29:00.000Z',
      workStartDateTimeUTC: '2022-05-04T05:30:00.000Z',
      workEndDateTimeUTC: '2022-05-05T05:29:00.000Z'
    }

    const selectedShift = Shift.nightShift
    const currentShift = Shift.afternoonShift
    const now = new Date('2022-05-04T18:30:00')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as nightShift and currentShift as nightShift before midNight and returns dateTimeStartUTC, dateTimeEndUTC in SUMMER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-05-04T21:30:00.000Z',
      dateTimeEndUTC: '2022-05-05T05:29:00.000Z',
      workStartDateTimeUTC: '2022-05-04T05:30:00.000Z',
      workEndDateTimeUTC: '2022-05-05T05:29:00.000Z'
    }

    const selectedShift = Shift.nightShift
    const currentShift = Shift.nightShift
    const now = new Date('2022-05-04T22:30:00')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as nightShift and currentShift as nightShift after midNight and returns dateTimeStartUTC, dateTimeEndUTC in SUMMER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-05-03T21:30:00.000Z',
      dateTimeEndUTC: '2022-05-04T05:29:00.000Z',
      workStartDateTimeUTC: '2022-05-03T05:30:00.000Z',
      workEndDateTimeUTC: '2022-05-04T05:29:00.000Z'
    }

    const selectedShift = Shift.nightShift
    const currentShift = Shift.nightShift
    const now = new Date('2022-05-04T00:01:00')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })
})

describe(`${getShiftStartEndDateTimeUTC.name} - WINTER TIME`, () => {
  const morningShiftStart = moment('2022-01-20T06:30', globalLocalDateTimeFormat)
  const afternoonShiftStart = moment('2022-01-20T14:30', globalLocalDateTimeFormat)
  const nightShiftStart = moment('2022-01-20T22:30', globalLocalDateTimeFormat)
  const morningShiftStartAfterMidnight = moment('2022-01-21T06:30', globalLocalDateTimeFormat)
  const afternoonShiftStartAfterMidnight = moment('2022-01-21T14:30', globalLocalDateTimeFormat)
  const nightShiftStartAfterMidnight = moment('2022-01-21T22:30', globalLocalDateTimeFormat)

  // test MorningShift is selected

  it('Receives selectedShift as morningShift and currentShift as morningShift and returns dateTimeStartUTC, dateTimeEndUTC in WINTER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-01-20T05:30:00.000Z',
      dateTimeEndUTC: '2022-01-20T13:29:00.000Z',
      workStartDateTimeUTC: '2022-01-20T05:30:00.000Z',
      workEndDateTimeUTC: '2022-01-21T05:29:00.000Z'
    }

    const selectedShift = Shift.morningShift
    const currentShift = Shift.morningShift
    const now = new Date('2022-01-20T05:30:00.000Z')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as morningShift and currentShift as morningShift and returns dateTimeStartUTC, dateTimeEndUTC in WINTER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-01-20T05:30:00.000Z',
      dateTimeEndUTC: '2022-01-20T13:29:00.000Z',
      workStartDateTimeUTC: '2022-01-20T05:30:00.000Z',
      workEndDateTimeUTC: '2022-01-21T05:29:00.000Z'
    }

    const selectedShift = Shift.morningShift
    const currentShift = Shift.morningShift
    const now = new Date('2022-01-20T13:29:00.000Z')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as morningShift and currentShift as afternoonShift and returns dateTimeStartUTC, dateTimeEndUTC in WINTER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-01-20T05:30:00.000Z',
      dateTimeEndUTC: '2022-01-20T13:29:00.000Z',
      workStartDateTimeUTC: '2022-01-20T05:30:00.000Z',
      workEndDateTimeUTC: '2022-01-21T05:29:00.000Z'
    }

    const selectedShift = Shift.morningShift
    const currentShift = Shift.afternoonShift
    const now = new Date('2022-01-20T13:30:00.000Z')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as morningShift and currentShift as nightShift before midNight and returns dateTimeStartUTC, dateTimeEndUTC in WINTER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-01-20T05:30:00.000Z',
      dateTimeEndUTC: '2022-01-20T13:29:00.000Z',
      workStartDateTimeUTC: '2022-01-20T05:30:00.000Z',
      workEndDateTimeUTC: '2022-01-21T05:29:00.000Z'
    }

    const selectedShift = Shift.morningShift
    const currentShift = Shift.nightShift
    const now = new Date('2022-01-20T23:40:00') // We can use any hour from 22:30 to 00:00

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as morningShift and currentShift as nightShift after midNight and returns dateTimeStartUTC, dateTimeEndUTC in WINTER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-01-20T05:30:00.000Z',
      dateTimeEndUTC: '2022-01-20T13:29:00.000Z',
      workStartDateTimeUTC: '2022-01-20T05:30:00.000Z',
      workEndDateTimeUTC: '2022-01-21T05:29:00.000Z'
    }

    const selectedShift = Shift.morningShift
    const currentShift = Shift.nightShift
    const now = new Date('2022-01-21T00:01:00')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart: morningShiftStartAfterMidnight,
      afternoonShiftStart: afternoonShiftStartAfterMidnight,
      nightShiftStart: nightShiftStartAfterMidnight,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  // test AfternoonShift is selected
  it('Receives selectedShift as afternoonShift and currentShift as morningShift and returns dateTimeStartUTC, dateTimeEndUTC in WINTER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-01-19T13:30:00.000Z',
      dateTimeEndUTC: '2022-01-19T21:29:00.000Z',
      workStartDateTimeUTC: '2022-01-20T05:30:00.000Z',
      workEndDateTimeUTC: '2022-01-21T05:29:00.000Z'
    }

    const selectedShift = Shift.afternoonShift
    const currentShift = Shift.morningShift
    const now = new Date('2022-01-20T13:29:00.000Z')
    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })
    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as afternoonShift and currentShift as afternoonShift and returns dateTimeStartUTC, dateTimeEndUTC in WINTER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-01-20T13:30:00.000Z',
      dateTimeEndUTC: '2022-01-20T21:29:00.000Z',
      workStartDateTimeUTC: '2022-01-20T05:30:00.000Z',
      workEndDateTimeUTC: '2022-01-21T05:29:00.000Z'
    }

    const selectedShift = Shift.afternoonShift
    const currentShift = Shift.afternoonShift
    const now = new Date('2022-01-20T13:30:00.000Z')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as afternoonShift and currentShift as nightShift before midNight and returns dateTimeStartUTC, dateTimeEndUTC in WINTER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-01-20T13:30:00.000Z',
      dateTimeEndUTC: '2022-01-20T21:29:00.000Z',
      workStartDateTimeUTC: '2022-01-20T05:30:00.000Z',
      workEndDateTimeUTC: '2022-01-21T05:29:00.000Z'
    }

    const selectedShift = Shift.afternoonShift
    const currentShift = Shift.nightShift
    const now = new Date('2022-01-20T21:30:00.000Z')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as afternoonShift and currentShift as nightShift after midNight and returns dateTimeStartUTC, dateTimeEndUTC in WINTER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-01-20T13:30:00.000Z',
      dateTimeEndUTC: '2022-01-20T21:29:00.000Z',
      workStartDateTimeUTC: '2022-01-20T05:30:00.000Z',
      workEndDateTimeUTC: '2022-01-21T05:29:00.000Z'
    }

    const selectedShift = Shift.afternoonShift
    const currentShift = Shift.nightShift
    const now = new Date('2022-01-21T00:01:00')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart: morningShiftStartAfterMidnight,
      afternoonShiftStart: afternoonShiftStartAfterMidnight,
      nightShiftStart: nightShiftStartAfterMidnight,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  // test NightShift is selected

  it('Receives selectedShift as nightShift and currentShift as morningShift and returns dateTimeStartUTC, dateTimeEndUTC in WINTER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-01-19T21:30:00.000Z',
      dateTimeEndUTC: '2022-01-20T05:29:00.000Z',
      workStartDateTimeUTC: '2022-01-20T05:30:00.000Z',
      workEndDateTimeUTC: '2022-01-21T05:29:00.000Z'
    }

    const selectedShift = Shift.nightShift
    const currentShift = Shift.morningShift
    const now = new Date('2022-01-20T05:30:00.000Z')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as nightShift and currentShift as afternoonShift and returns dateTimeStartUTC, dateTimeEndUTC in WINTER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-01-19T21:30:00.000Z',
      dateTimeEndUTC: '2022-01-20T05:29:00.000Z',
      workStartDateTimeUTC: '2022-01-20T05:30:00.000Z',
      workEndDateTimeUTC: '2022-01-21T05:29:00.000Z'
    }

    const selectedShift = Shift.nightShift
    const currentShift = Shift.afternoonShift
    const now = new Date('2022-01-20T17:30:00.000Z')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as nightShift and currentShift as nightShift before midNight and returns dateTimeStartUTC, dateTimeEndUTC in WINTER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-01-20T21:30:00.000Z',
      dateTimeEndUTC: '2022-01-21T05:29:00.000Z',
      workStartDateTimeUTC: '2022-01-20T05:30:00.000Z',
      workEndDateTimeUTC: '2022-01-21T05:29:00.000Z'
    }

    const selectedShift = Shift.nightShift
    const currentShift = Shift.nightShift
    const now = new Date('2022-01-20T21:30:00.000Z')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })

  it('Receives selectedShift as nightShift and currentShift as nightShift after midNight and returns dateTimeStartUTC, dateTimeEndUTC in WINTER time', () => {
    const expected = {
      dateTimeStartUTC: '2022-01-19T21:30:00.000Z',
      dateTimeEndUTC: '2022-01-20T05:29:00.000Z',
      workStartDateTimeUTC: '2022-01-19T05:30:00.000Z',
      workEndDateTimeUTC: '2022-01-20T05:29:00.000Z'
    }

    const selectedShift = Shift.nightShift
    const currentShift = Shift.nightShift
    const now = new Date('2022-01-20T00:00:00.000Z')

    const result = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone,
      now
    })

    return assert.deepStrictEqual(result, expected)
  })
})

describe(addTwentyFourHours.name, () => {
  it('Receives a dateTime and it returns dateTime + 24hours WINTER', () => {
    const expected = '2022-01-20T05:29:00.000Z'
    const result = addTwentyFourHours('2022-01-19T05:29:00.000Z')
    return assert.deepStrictEqual(result, expected)
  })

  it('Receives a dateTime and it returns dateTime + 24hours SUMMER', () => {
    const expected = '2022-05-05T05:29:00.000Z'
    const result = addTwentyFourHours('2022-05-04T05:29:00.000Z')
    return assert.deepStrictEqual(result, expected)
  })
})

describe(getWorkStartDateTime.name, () => {
  it('Receives a local time and returns the work start date time on local Date time SUMMER', () => {
    const expected = '2022-05-26T06:30:00'
    const hourStart = '06:30:00'
    const date = moment('2022-05-26')

    const result = getWorkStartDateTime(hourStart, date)
    return assert.deepStrictEqual(result, expected)
  })

  it('Receives a local time and returns the work start date time on local Date time WINTER', () => {
    const expected = '2022-01-01T06:30:00'
    const hourStart = '06:30:00'
    const date = moment('2022-01-01')

    const result = getWorkStartDateTime(hourStart, date)
    return assert.deepStrictEqual(result, expected)
  })

  it('Receives a local time and returns the work start date time on local Date time on current date', () => {
    const hourStart = '06:30:00'
    const [date] = moment().format().split('T')
    const expected = `${date}T06:30:00`

    const result = getWorkStartDateTime(hourStart)
    return assert.deepStrictEqual(result, expected)
  })
})

describe(isTimeBetween.name, () => {
  it('Receives a local time, startDateTime and endDateTime in globalLocalDateTimeFormat and returns if the local time is between the both dates', () => {
    const expected = true

    const localTime = '08:30:00'
    const startDateTime = moment().format().split('T')[0] + 'T08:00:00'
    const endDateTime = moment().format().split('T')[0] + 'T10:30:00'

    const result = isTimeBetween(localTime, startDateTime, endDateTime)
    return assert.deepStrictEqual(result, expected)
  })
})

describe(sumDuration.name, () => {
  it('Receive previous 00:40 duration and current 00:40 duration and returns 01:20', () => {
    const expected = '01:20'
    const previousDuration = '00:40'
    const currentDuration = '00:40'

    const result = sumDuration(previousDuration, currentDuration)
    return assert.deepStrictEqual(result, expected)
  })
  it('Receive previous 00:00 duration and current 00:05 duration and returns 00:05', () => {
    const expected = '00:05'
    const previousDuration = '00:00'
    const currentDuration = '00:05'

    const result = sumDuration(previousDuration, currentDuration)
    return assert.deepStrictEqual(result, expected)
  })
  it('Receive previous 00:00 duration and current "undefined" duration and returns 00:00', () => {
    const expected = '00:00'
    const previousDuration = '00:00'
    const currentDuration = undefined

    const result = sumDuration(previousDuration, currentDuration)
    return assert.deepStrictEqual(result, expected)
  })
})

describe(getShiftFromDateTime.name, () => {
  // TODO (VDD-744): Shift Start Time as Moment type is utc by default when it should be local time "moment._isUTC: false"
  const morningShiftStart = moment.utc('06:30:00', localTimeFormat)
  const afternoonShiftStart = moment.utc('14:30:00', localTimeFormat)
  const nightShiftStart = moment.utc('22:30:00', localTimeFormat)

  it('Receives a dateTime which is at the beginning of the morningShift and returns morningShift', () => {
    const expected = 'morningShift'
    const result = getShiftFromDateTime('2022-12-01T06:30', morningShiftStart, afternoonShiftStart, nightShiftStart)
    return assert.deepStrictEqual(result, expected)
  })

  it('Receives a dateTime which is at the end of the morningShift and returns morningShift', () => {
    const expected = 'morningShift'
    const result = getShiftFromDateTime('2022-12-01T14:29', morningShiftStart, afternoonShiftStart, nightShiftStart)
    return assert.deepStrictEqual(result, expected)
  })

  it('Receives a dateTime which is at the beginning of the afternoonShift and returns afternoonShift', () => {
    const expected = 'afternoonShift'
    const result = getShiftFromDateTime('2022-12-01T14:30', morningShiftStart, afternoonShiftStart, nightShiftStart)
    return assert.deepStrictEqual(result, expected)
  })

  it('Receives a dateTime which is at the end of the afternoonShift and returns afternoonShift', () => {
    const expected = 'afternoonShift'
    const result = getShiftFromDateTime('2022-12-01T22:29', morningShiftStart, afternoonShiftStart, nightShiftStart)
    return assert.deepStrictEqual(result, expected)
  })

  it('Receives a dateTime which is at the beginning of the nightShift and returns nightShift', () => {
    const expected = 'nightShift'
    const result = getShiftFromDateTime('2022-12-01T22:30', morningShiftStart, afternoonShiftStart, nightShiftStart)
    return assert.deepStrictEqual(result, expected)
  })

  it('Receives a dateTime which is at the end of the nightShift and returns nightShift', () => {
    const expected = 'nightShift'
    const result = getShiftFromDateTime('2022-12-01T06:29', morningShiftStart, afternoonShiftStart, nightShiftStart)
    return assert.deepStrictEqual(result, expected)
  })

  it('Receives a dateTime which is at Midnight during the nightShift and returns nightShift', () => {
    const expected = 'nightShift'
    const result = getShiftFromDateTime('2022-12-01T00:00', morningShiftStart, afternoonShiftStart, nightShiftStart)
    return assert.deepStrictEqual(result, expected)
  })

  it('Receives a dateTime which is at Midnight during the nightShift that starts at Midnight and returns nightShift', () => {
    const expected = 'nightShift'
    const nightShiftStart = moment.utc('00:00:00', localTimeFormat)
    const result = getShiftFromDateTime('2022-12-01T00:00', morningShiftStart, afternoonShiftStart, nightShiftStart)
    return assert.deepStrictEqual(result, expected)
  })
})

describe(previousShiftFirstHour.name, () => {
  // MORNING SHIFT SELECTED
  it('Morning Shift is selected and it is Morningshift so it subtract 8 hours to shiftTimeRange.morningShiftStart', () => {
    const selectedShift = Shift.morningShift
    const currentShift = Shift.morningShift
    const expected = '2022-12-15T21:30:00.000Z'
    const result = previousShiftFirstHour(
      selectedShift,
      shiftTimeRange,
      currentShift,
      timeZone,
      moment('2022-12-16T06:30:00')
    )
    return assert.deepStrictEqual(result, expected)
  })

  it('Morning Shift is selected and it is NightShift after midnight so it subtract 1 day and 8 hours to shiftTimeRange.morningShiftStart', () => {
    const selectedShift = Shift.morningShift
    const currentShift = Shift.nightShift
    const expected = '2022-12-14T21:30:00.000Z'
    const result = previousShiftFirstHour(
      selectedShift,
      shiftTimeRange,
      currentShift,
      timeZone,
      moment('2022-12-16T00:30:00')
    )
    return assert.deepStrictEqual(result, expected)
  })

  it('Morning Shift is selected and it is NightShift before midnight so it subtract 8 hours to shiftTimeRange.morningShiftStart', () => {
    const selectedShift = Shift.morningShift
    const currentShift = Shift.nightShift
    const expected = '2022-12-15T21:30:00.000Z'
    const result = previousShiftFirstHour(
      selectedShift,
      shiftTimeRange,
      currentShift,
      timeZone,
      moment('2022-12-15T23:30:00')
    )
    return assert.deepStrictEqual(result, expected)
  })

  // AFTERNOON SHIFT SELECTED
  it('Afternoon Shift is selected and it is NightShift after midnight so it subtract 1 day and 8 hours to shiftTimeRange.afternoonShiftStart', () => {
    const selectedShift = Shift.afternoonShift
    const currentShift = Shift.nightShift
    const expected = '2022-12-15T05:30:00.000Z'
    const result = previousShiftFirstHour(
      selectedShift,
      shiftTimeRange,
      currentShift,
      timeZone,
      moment('2022-12-16T00:30:00')
    )
    return assert.deepStrictEqual(result, expected)
  })

  it('Afternoon Shift is selected and it is NightShift before midnight so it subtract 8 hours to shiftTimeRange.afternoonShiftStart', () => {
    const selectedShift = Shift.afternoonShift
    const currentShift = Shift.nightShift
    const expected = '2022-12-16T05:30:00.000Z'
    const result = previousShiftFirstHour(
      selectedShift,
      shiftTimeRange,
      currentShift,
      timeZone,
      moment('2022-12-15T23:30:00')
    )
    return assert.deepStrictEqual(result, expected)
  })

  it('Afternoon Shift is selected and it is MorningShift so it subtract 1 day and 8 hours to shiftTimeRange.afternoonShiftStart', () => {
    const selectedShift = Shift.afternoonShift
    const currentShift = Shift.morningShift
    const expected = '2022-12-15T05:30:00.000Z'
    const result = previousShiftFirstHour(
      selectedShift,
      shiftTimeRange,
      currentShift,
      timeZone,
      moment('2022-12-16T06:30:00')
    )
    return assert.deepStrictEqual(result, expected)
  })

  it('Afternoon Shift is selected and it is AfternoonShift so it subtract 8 hours to shiftTimeRange.afternoonShiftStart', () => {
    const selectedShift = Shift.afternoonShift
    const currentShift = Shift.afternoonShift
    const expected = '2022-12-16T05:30:00.000Z'
    const result = previousShiftFirstHour(
      selectedShift,
      shiftTimeRange,
      currentShift,
      timeZone,
      moment('2022-12-16T16:30:00')
    )
    return assert.deepStrictEqual(result, expected)
  })

  // NIGHT SHIFT SELECTED

  it('Night Shift is selected and it is NightShift after midnight so it subtract 1 day and 8 hours to shiftTimeRange.afternoonShiftStart', () => {
    const selectedShift = Shift.nightShift
    const currentShift = Shift.nightShift
    const expected = '2022-12-15T13:30:00.000Z'
    const result = previousShiftFirstHour(
      selectedShift,
      shiftTimeRange,
      currentShift,
      timeZone,
      moment('2022-12-16T00:30:00')
    )
    return assert.deepStrictEqual(result, expected)
  })

  it('Night Shift is selected and it is NightShift before midnight so it subtract 8 hours to shiftTimeRange.afternoonShiftStart', () => {
    const selectedShift = Shift.nightShift
    const currentShift = Shift.nightShift
    const expected = '2022-12-16T13:30:00.000Z'
    const result = previousShiftFirstHour(
      selectedShift,
      shiftTimeRange,
      currentShift,
      timeZone,
      moment('2022-12-15T23:30:00')
    )
    return assert.deepStrictEqual(result, expected)
  })

  it('Night Shift is selected and it is MorningShift so it subtract 1 day and 8 hours to shiftTimeRange.afternoonShiftStart', () => {
    const selectedShift = Shift.nightShift
    const currentShift = Shift.morningShift
    const expected = '2022-12-15T13:30:00.000Z'
    const result = previousShiftFirstHour(
      selectedShift,
      shiftTimeRange,
      currentShift,
      timeZone,
      moment('2022-12-16T06:30:00')
    )
    return assert.deepStrictEqual(result, expected)
  })

  it('Night Shift is selected and it is AfternoonShift so it subtract 1 day and 8 hours to shiftTimeRange.afternoonShiftStart', () => {
    const selectedShift = Shift.nightShift
    const currentShift = Shift.afternoonShift
    const expected = '2022-12-15T13:30:00.000Z'
    const result = previousShiftFirstHour(
      selectedShift,
      shiftTimeRange,
      currentShift,
      timeZone,
      moment('2022-12-16T16:30:00')
    )
    return assert.deepStrictEqual(result, expected)
  })
})

describe(getSelectedTabStartTime.name, function () {
  it('Receives currentShiftScheduleSlots as undefined, selectedShiftTab, currentShiftTab', function () {
    const currentShiftScheduleSlots = undefined
    const selectedShiftTab = 2
    const currentShiftTab = 2

    const expected = undefined
    const result = getSelectedTabStartTime({ currentShiftScheduleSlots, selectedShiftTab, currentShiftTab })
    return assert.strictEqual(result, expected)
  })

  it('Receives currentShiftScheduleSlots, selectedShiftTab, currentShiftTab and checks the correct time is returned for a past selectedShift', function () {
    const selectedShiftTab = 1
    const currentShiftTab = 2

    const expected = '2023-02-02T08:30:00'
    const result = getSelectedTabStartTime({ currentShiftScheduleSlots, selectedShiftTab, currentShiftTab })

    return assert.strictEqual(result, expected)
  })
})

describe(getTimeRange.name, () => {
  it('Receives shiftTimeRange object and should not read from previous shift', () => {
    const expected = {
      dateTimeStartUTC: shiftTimeRange.dateTimeStartUTC,
      dateTimeEndUTC: shiftTimeRange.dateTimeEndUTC
    }
    const shouldReadPreviousShift = false
    const result = getTimeRange({ hours: 8, shiftTimeRange, shouldReadPreviousShift })
    return assert.deepEqual(result, expected)
  })
  it('Receives shiftTimeRange object and should read from previous shift', () => {
    const expected = {
      dateTimeStartUTC: '2022-12-15T21:30:00.000Z',
      dateTimeEndUTC: '2022-12-16T05:29:00.000Z'
    }
    const shouldReadPreviousShift = true
    const result = getTimeRange({ hours: 8, shiftTimeRange, shouldReadPreviousShift })
    return assert.deepEqual(result, expected)
  })
})

describe(millisecondsToTime.name, () => {
  it('should correctly convert 5000 milliseconds to "00:00:05"', () => {
    const input = 5000
    const expected = '00:00:05'
    const result = millisecondsToTime(input)

    return assert.strictEqual(result, expected)
  })

  it('should correctly convert 3600000 milliseconds to "01:00:00"', () => {
    const input = 3_600_000
    const expected = '01:00:00'
    const result = millisecondsToTime(input)

    return assert.strictEqual(result, expected)
  })

  it('should correctly convert 86400000 milliseconds to "00:00:00"', () => {
    const input = 86_400_000
    const expected = '00:00:00'
    const result = millisecondsToTime(input)

    return assert.strictEqual(result, expected)
  })
})
