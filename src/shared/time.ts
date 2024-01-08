import moment, { Duration, Moment, unitOfTime } from 'moment'
import { DATE_FORMAT, DATETIME_FORMAT, DATETIME_FORMAT_FIX, DURATION_FORMAT, TIME_FORMAT } from './constants'
import { DayJS, dayjs } from './datetime'
import { Nullable } from './types'

// * --- Constants ---

export const invalidDateTime = () => dayjs('invalid')

// * --- Scale conversion utilities ---

export type UnitOfTime = 'minutes' | 'seconds' | 'milliseconds'

export const convertTo = (value: number, inputScale: UnitOfTime, outputScale: UnitOfTime): number =>
  moment.duration(value, inputScale).as(outputScale)

interface DurationOptions {
  granularity: UnitOfTime
  absolute?: boolean
}

export const durationIn = (
  a: Moment | DayJS,
  b: Moment | DayJS,
  { granularity, absolute = true }: DurationOptions
): number => {
  const duration = (a as DayJS).diff(b as DayJS, granularity)
  return absolute ? Math.abs(duration) : duration
}
// * --- DateTime parsers (without data validation libraries) ---

export type DateTimeParser<TOutput = Moment, TOther extends [...unknown[]] = []> = (
  _: Nullable<string | number>,
  ...other: TOther
) => TOutput

// TODO VDD-560: Keep only first op when VDD-560 is done
// ? AWSDateTime type from https://docs.aws.amazon.com/appsync/latest/devguide/scalars.html
export const momentDateTimeParser: DateTimeParser = (value) => {
  const maybeValid = moment.utc(value, DATETIME_FORMAT, true)
  return maybeValid.isValid() ? maybeValid : moment.utc(value, DATETIME_FORMAT_FIX, true)
}

// ? AWSDate type from https://docs.aws.amazon.com/appsync/latest/devguide/scalars.html
// ! Beware! Here momentJS treats the result as a datetime object instead of only date (includes current time)
export const momentDateParser: DateTimeParser = (value) => moment.utc(value, moment.HTML5_FMT.DATE, true)

// ? AWSTime type from https://docs.aws.amazon.com/appsync/latest/devguide/scalars.html
// ! Beware! Here momentJS treats the result as a datetime object instead of only time(includes current date)
export const momentTimeParser: DateTimeParser = (value) => {
  const maybeValid = moment.utc(value, moment.HTML5_FMT.TIME_MS, true)
  return maybeValid.isValid() ? maybeValid : moment.utc(value, `${moment.HTML5_FMT.TIME_MS}S`, true)
}

// ? AWSTimestamp type from https://docs.aws.amazon.com/appsync/latest/devguide/scalars.html
export const timestampParser: DateTimeParser = (value) =>
  typeof value === 'number' ? moment.unix(value).utc() : moment.invalid()

// * --- Duration parsers ---

export const durationParser: DateTimeParser = (value) => moment(value, DURATION_FORMAT, true)

export const durationInMinutesParser: DateTimeParser<number | undefined> = (value) =>
  durationParser(value).isValid() ? moment.duration(value).asMinutes() : undefined

export const durationWithScaleParser: DateTimeParser<Duration, [string]> = (value, scale) =>
  moment.duration(value, scale as unitOfTime.DurationConstructor)

export const formatDuration = (minutes: number) =>
  moment.utc().startOf('day').add(minutes, 'minutes').format(DURATION_FORMAT)

// * --- Date API parsers ---

// ? AWSDateTime type from https://docs.aws.amazon.com/appsync/latest/devguide/scalars.html
// TODO VDD-560: Keep only first op when VDD-560 is done
export const dateTimeParser: DateTimeParser<DayJS> = (value) => {
  const defaultValue = dayjs.utc(value)
  const maybeValid = dayjs.utc(value, DATETIME_FORMAT, true)
  const maybeAlsoValid = dayjs.utc(value, DATETIME_FORMAT_FIX, true)

  return maybeValid.isValid() ? maybeValid : maybeAlsoValid.isValid() ? maybeAlsoValid : defaultValue
}

// ? AWSDate type from https://docs.aws.amazon.com/appsync/latest/devguide/scalars.html
export const dateParser: DateTimeParser<DayJS> = (date) => dateTimeParser(`${date}T00:00:00.000Z`)

// ? AWSTime type from https://docs.aws.amazon.com/appsync/latest/devguide/scalars.html
export const timeParser: DateTimeParser<DayJS> = (time) => dateTimeParser(`1970-01-01T${time}Z`)

// * --- Time utilities ---

interface DateTimeOptions {
  utc?: boolean
}

// eslint-disable-next-line unicorn/no-object-as-default-parameter
export const getCurrentDateTime = ({ utc = false }: DateTimeOptions = {}) => (utc ? dayjs().utc() : dayjs())

export const getTime = (value?: string, { utc = false }: DateTimeOptions = {}) =>
  utc ? dayjs(value).utc().format(DURATION_FORMAT) : dayjs(value).format(DURATION_FORMAT)

export const getDateAndTime = (dateTime?: DayJS, { utc = false }: DateTimeOptions = {}) => {
  const value = dateTime ?? getCurrentDateTime({ utc })
  return { date: value.format(DATE_FORMAT), time: value.format(TIME_FORMAT) }
}

export const buildDateTime = (date: DayJS, time: DayJS) =>
  dateTimeParser(`${date.format(DATE_FORMAT)}T${time.format(TIME_FORMAT)}Z`)

// * --- Logic-related utilities ---

export const isAfterMidnight = (dateTime: Moment | DayJS): boolean =>
  (dateTime.clone().startOf('day') as Moment).add(12, 'hours') > dateTime
