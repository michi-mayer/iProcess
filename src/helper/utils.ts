import moment from 'moment'
import { Moment, unitOfTime } from 'moment-timezone'
import { DisruptionResponse, DisruptionWithTemplateData, isAssemblyLine } from 'types'
import { ZodType, ZodTypeDef } from 'zod'
import { Bool } from 'API'
import type { ConfiguratorRecord, ExtendedScheduleSlot, ExtendedUnit } from 'contexts/iProcessContext'
import { getLocalDateTimeFromUtcDateTime, getOneMinuteEarlierForDateTime } from 'helper/time'
import { DateTimeRange, defined as strictDefined, Nullable } from 'shared'
import { EMPTY_STRING } from './constants'

interface ParseDisruption {
  disruptions?: string
  units?: ExtendedUnit[]
}

// * --- String utils ---

export const onEmptyString = (value: string, defaultValue: string) =>
  value.trim() === EMPTY_STRING ? defaultValue : value

// * --- Other utils ---

export const parseUnitsAndClassifications = ({ disruptions, units }: ParseDisruption): string => {
  if (disruptions) {
    const parsedData = (JSON.parse(disruptions) as { value?: string }[]).map((_) => _?.value)
    return parsedData.join(', ')
  }
  if (units) {
    const unitArray = units?.map((unit: { shortName: string; unit?: ExtendedUnit }) =>
      unit?.unit ? unit?.unit?.shortName : unit?.shortName
    )
    return unitArray?.join(', ')
  }
  return ''
}

/** @deprecated Use {@link asBoolean} from 'shared' */
export const convertBoolToBoolean = (item: Bool | null | undefined) => {
  return item === Bool.yes
}

const trueEnvironmentValues = new Set(['true', 'enable', 'show'])

export const convertEnvironmentToBoolean = (value: string | undefined): boolean => {
  return value ? trueEnvironmentValues.has(value.toLowerCase()) : false
}

/** @deprecated Use {@link fromBoolean} from 'shared' */
export const convertBooleanToBool = (item: boolean | undefined): Bool => {
  switch (item) {
    case true:
      return Bool.yes
    default:
      return Bool.no
  }
}

/**
 * @deprecated use zod schema instead
 * @see {@link https://zod.dev/ Zod Reference}
 */
export const defined = <T>(scope: string, value?: T | null): T =>
  strictDefined(value, () => {
    console.warn(`Value ${scope} is not defined: ${JSON.stringify(value)}`)
    return value as T
  })

export const asGraphQLValue = <T>(value: T | null | undefined): T | null =>
  // eslint-disable-next-line unicorn/no-null
  typeof value === 'undefined' ? null : value

export const compareDeep = (firstValue: unknown, secondValue: unknown): boolean => {
  const strigifiedFirstValue = JSON.stringify(firstValue)
  const strigifiedSecondValue = JSON.stringify(secondValue)
  return strigifiedFirstValue === strigifiedSecondValue
}

/**
 *
 * Assuming the following:
 *  - Schedule A (from 06:30am to 07:30am)
 *  - Schedule B (from 07:30am to 08:30am)
 *
 * 1. If a disruption starts at 7:29, then it should count for Schedule A
 * 2. If a disruption starts at 7:30, then it should count for Schedule B
 *
 * This is the same principle used for the 'Query NIO' count and 'Query Disruptions By Description' count
 */
export const getTimeTabRange = (
  shiftScheduleSlots: ExtendedScheduleSlot[] | undefined,
  selectedShiftTab: number
): DateTimeRange<string | undefined> => {
  const currentShiftDateTimeEndUTC = shiftScheduleSlots?.[selectedShiftTab]?.dateTimeEndUTC
  const dateTimeStartUTC = shiftScheduleSlots?.[selectedShiftTab]?.dateTimeStartUTC

  return {
    dateTimeStartUTC,
    dateTimeEndUTC: currentShiftDateTimeEndUTC
      ? getOneMinuteEarlierForDateTime(currentShiftDateTimeEndUTC, 'utc')
      : undefined
  }
}

export const extendDisruptionWithTimeRange = (
  disruptionResponse: DisruptionResponse,
  shouldReadOffSet = true
): DisruptionWithTemplateData =>
  ({
    ...disruptionResponse,

    endTimeDate: getLocalDateTimeFromUtcDateTime(
      disruptionResponse.endTimeDateUTC,
      disruptionResponse.timeZone,
      shouldReadOffSet
    ),

    startTimeDate: getLocalDateTimeFromUtcDateTime(
      disruptionResponse.startTimeDateUTC,
      disruptionResponse.timeZone,
      shouldReadOffSet
    )
  }) as DisruptionWithTemplateData

export const checkNextToken = (nextToken: string | null | undefined, queryName: string) => {
  if (nextToken) {
    console.warn(`Too many results warning: ${queryName} could not return all relevant entries.`)
  }
}

export const getCurrentConfigs = (configurationsByUnitId: ConfiguratorRecord | undefined, unitId: string | undefined) =>
  (configurationsByUnitId && unitId ? configurationsByUnitId[unitId] : []) ?? []

export const getDefaultTeam = (unit: ExtendedUnit | undefined, teamId: Nullable<string>) => {
  if (!!unit?.teams && isAssemblyLine(unit) && unit.teams.length > 0) {
    return unit.teams.find(({ id }) => id === teamId) || unit.teams[0]
  }
  return undefined
}

export const trim = (_: Nullable<string>, length: number) => {
  if (_) {
    const description = _.slice(0, length)
    return _.length > length ? `${description}...` : description
  }
}

interface Threshold {
  value?: number
  unit?: unitOfTime.Diff
}

export const isRecent = (rawDateTime: string, now: Moment, { value = 5, unit = 'minutes' }: Threshold = {}) => {
  const dateTime = moment(rawDateTime)
  return Math.abs(now.diff(dateTime, unit, true)) <= value
}

export const textIsIncluded = (a: string, b: string) => {
  return a.toLocaleLowerCase().includes(b.toLocaleLowerCase().trim())
}

export const parseQueryParameter = <O extends object>(value: string | null, parser: ZodType<O, ZodTypeDef>) => {
  try {
    if (value) {
      const parsedValue = JSON.parse(value)
      const result = parser.safeParse(parsedValue)
      if (result.success) {
        return result.data
      }
      throw result.error
    }
  } catch (error) {
    console.error('[parseQueryParameter]:', error)
  }
}

export const trimEnd = (value: string) => {
  return value.replace(/\s+$/, '')
}
