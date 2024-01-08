import type { Get, Merge } from 'type-fest'
import { z } from 'zod'

import {
  ExtendedDateTimeRange,
  lambdaInput,
  DurationSchema,
  zodTimeParser,
  objectOf,
  EmptyZodObject
} from 'iprocess-shared'

import {
  CreateConfigurationInput,
  CreateActualCountInput as CreateTimeSlotInput,
  ScheduleHoursByShiftQuery,
  StartShiftInput
} from 'iprocess-shared/graphql/index.js'

export const EventSchema = lambdaInput(objectOf(EmptyZodObject).withType<StartShiftInput>())

export type Event = z.infer<typeof EventSchema>

// * DateTime info. is derived from TimeSlots, which are created afterwards
export interface PartialCreateConfigurationInput
  extends Omit<CreateConfigurationInput, 'validFrom' | 'validUntil' | 'cycleTime' | 'shiftTarget'> {
  id: string
  validFrom?: string
  validUntil?: string
}

// * Keep DateTime values as Date instances until we're finished with calculations
export type PartialCreateTimeSlotInput = Merge<Omit<CreateTimeSlotInput, 'quota'>, ExtendedDateTimeRange>

type ScheduleHourQuery = NonNullable<Get<ScheduleHoursByShiftQuery, ['getShiftModel', 'scheduleHours', 'items', '0']>>

export const ScheduleHourSchema = z
  .object({ hoursStartUTC: zodTimeParser, hoursEndUTC: zodTimeParser, downtime: DurationSchema })
  .passthrough()
  .transform((_) => _ as Merge<ScheduleHourQuery, typeof _>)

export type ScheduleHour = z.infer<typeof ScheduleHourSchema>
