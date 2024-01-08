import { z } from 'zod'
import type { Merge } from 'type-fest'

import {
  NonEmptyString,
  DurationSchema,
  defaultOf,
  zodDateTimeParser,
  getCurrentDateTime,
  getScheduleRate,
  lambdaArguments,
  Nullable,
  isDefined,
  defined,
  objectOf
} from 'iprocess-shared'
import {
  TimeRange as TimeRangeAPI,
  Unit as UnitAPI,
  actualCount as TimeSlot,
  disruption as Disruption,
  Defective
} from 'iprocess-shared/graphql/index.js'
import { DayJS } from 'iprocess-shared/shared/datetime.js'

import { TimeRange } from './time.js'

const DEFAULT_PERSIST_TO_DB = true

export type Unit = Pick<UnitAPI, 'id' | 'name'>

export const TimeSlotSchema = objectOf(
  z.object({
    dateTimeStartUTC: zodDateTimeParser,
    dateTimeEndUTC: zodDateTimeParser,
    downtime: DurationSchema
  })
).withType<TimeSlot>()

export const DisruptionSchema = objectOf(
  z.object({
    startTimeDateUTC: zodDateTimeParser,
    endTimeDateUTC: zodDateTimeParser
  })
).withType<Disruption>()

export const DefectiveSchema = objectOf(
  z.object({
    dateTimeUTC: zodDateTimeParser
  })
).withType<Defective>()

export const OEESchema = z.object({
  id: NonEmptyString,
  updatedAt: zodDateTimeParser
})

interface TimeRangeInput {
  input: {
    startDateTime: DayJS
    endDateTime: DayJS
    persistToDB: boolean
  }
}

const getTimeRange = (parameters: Nullable<TimeRangeInput>) => {
  const persistToDB = defined(parameters?.input.persistToDB, () => DEFAULT_PERSIST_TO_DB)

  if (isDefined(parameters)) {
    return { timeRange: new TimeRange(parameters.input.startDateTime, parameters.input.endDateTime), persistToDB }
  } else {
    const end = getCurrentDateTime({ utc: true })
    const invocationRate = getScheduleRate()

    return { timeRange: new TimeRange(end.subtract(invocationRate), end), persistToDB }
  }
}

export const EventSchema = lambdaArguments(
  z
    .object({
      input: z
        .object({
          startDateTime: zodDateTimeParser,
          endDateTime: zodDateTimeParser,
          persistToDB: defaultOf(z.boolean(), DEFAULT_PERSIST_TO_DB)
        })
        .transform((_) => _ as Merge<TimeRangeAPI, typeof _>)
    })
    .nullish()
).transform(getTimeRange)

export type ZodOEE = z.infer<typeof OEESchema>
export type ZodDisruption = z.infer<typeof DisruptionSchema>
export type ZodDefective = z.infer<typeof DefectiveSchema>
export type ZodTimeSlot = z.infer<typeof TimeSlotSchema>
