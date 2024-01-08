import { z } from 'zod'
import type { Merge } from 'type-fest'

import { lambdaInput, DurationSchema, zodTimeParser } from 'iprocess-shared'
import { CalculateShiftTargetInput, ScheduleHour } from 'iprocess-shared/graphql/index.js'

export const EventSchema = lambdaInput(z.object({ cycleTime: z.number().positive() }).passthrough()).transform(
  (_) => _ as Merge<CalculateShiftTargetInput, typeof _>
)

export const ScheduleHourSchema = z
  .object({
    hoursStartUTC: zodTimeParser,
    hoursEndUTC: zodTimeParser,
    downtime: DurationSchema
  })
  .passthrough()
  .transform((_) => _ as Merge<Pick<ScheduleHour, 'shiftType' | 'type'>, typeof _>)

export type Event = z.infer<typeof EventSchema>
export type ZodScheduleHour = z.infer<typeof ScheduleHourSchema>
