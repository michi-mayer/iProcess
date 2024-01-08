import { z } from 'zod'
import type { Merge } from 'type-fest'

import { DayJS } from 'iprocess-shared/shared/datetime.js'
import {
  Nullable,
  nullishPositiveNumber,
  defaultOf,
  DurationSchema,
  DateTimeRange,
  isAfterMidnight,
  buildDateTime,
  zodTimeParser,
  zodDateTimeParser
} from 'iprocess-shared'
import {
  Shift,
  SplitPosition,
  UnitType,
  ScheduleHour,
  actualCount as ConfiguredScheduleSlot
} from 'iprocess-shared/graphql/index.js'

const OptionalPositiveNumber = z
  .number()
  .nullish()
  .transform((_) => ((_ || 0) > 0 ? _ : undefined))

// ? See 'UnitParametersInput'
const assemblyLineParametersInputSchema = z.object({
  unitType: z.literal(UnitType.assemblyLine),
  cycleTime: OptionalPositiveNumber, // * undefined when 'Not Applicable'
  shiftTarget: z.number().positive()
})

export type AssemblyLineParameters = z.infer<typeof assemblyLineParametersInputSchema>

// ? See 'UnitParametersInput'
const productionUnitParametersInputSchema = z.object({
  unitType: z.literal(UnitType.productionUnit),
  cycleTime: z.number().positive(),
  speedMode: z.number().positive()
})

export type ProductionUnitParameters = z.infer<typeof productionUnitParametersInputSchema>

// ? Extends 'ConfigurationInput'
const baseConfigurationInputSchema = z.object({
  validFrom: zodTimeParser,
  validUntil: zodTimeParser,
  partId: z.string().min(1),
  shiftModelId: z.string().min(1),
  unitType: z.nativeEnum(UnitType),
  shiftTarget: nullishPositiveNumber,
  cycleTime: OptionalPositiveNumber,
  speedMode: nullishPositiveNumber,
  timeZone: z.string().min(1),
  parameters: z.discriminatedUnion('unitType', [assemblyLineParametersInputSchema, productionUnitParametersInputSchema])
})

export type BaseConfigurationInput = z.infer<typeof baseConfigurationInputSchema>

const mainConfigurationInputSchema = baseConfigurationInputSchema.omit({
  unitType: true,
  cycleTime: true,
  speedMode: true,
  shiftTarget: true
})

export type ZodConfigurationInput = z.infer<typeof mainConfigurationInputSchema>

const configurationInputSchema = baseConfigurationInputSchema.omit({ parameters: true }).transform((_) => {
  const { unitType, cycleTime, shiftTarget, speedMode } = _
  // eslint-disable-next-line unicorn/consistent-destructuring
  const configurationInput = _ as BaseConfigurationInput

  if (unitType === UnitType.assemblyLine) {
    configurationInput.parameters = { unitType, cycleTime, shiftTarget } as AssemblyLineParameters
  } else {
    configurationInput.parameters = { unitType, cycleTime, speedMode } as ProductionUnitParameters
  }

  return configurationInput as ZodConfigurationInput
})

const adjustDate = (startDate: DayJS, endDate: DayJS, time: DayJS) =>
  isAfterMidnight(time) ? buildDateTime(endDate, time) : buildDateTime(startDate, time)

export const eventSchema = z
  .object({
    arguments: z.object({
      // * see 'UpdateConfigurationsAndActualCountsInput' type
      input: z.object({
        unitId: z.string().min(1),
        shiftType: z.nativeEnum(Shift),
        dateTimeStartUTC: zodDateTimeParser, // Shift's start datetime
        dateTimeEndUTC: zodDateTimeParser, // Shift's end datetime
        configurationIdsToDelete: z.array(z.string().min(1)).nonempty(),
        configurations: z.array(configurationInputSchema).nonempty() // May vary from Production/Assembly Line
      })
    })
  })
  .transform((_) => {
    const { configurations, dateTimeStartUTC, dateTimeEndUTC, ...input } = _.arguments.input

    return {
      ...input,
      dateTimeStartUTC,
      dateTimeEndUTC,
      configurations: configurations.map(({ validFrom, validUntil, ..._ }) => ({
        ..._,
        validFrom: adjustDate(dateTimeStartUTC, dateTimeEndUTC, validFrom),
        validUntil: adjustDate(dateTimeStartUTC, dateTimeEndUTC, validUntil)
      }))
    }
  })

export const ConfiguredScheduleSlotSchema = z
  .object({
    dateTimeStartUTC: zodDateTimeParser,
    dateTimeEndUTC: zodDateTimeParser,
    split: defaultOf(z.nativeEnum(SplitPosition), undefined)
  })
  .passthrough()
  .transform((_) => _ as Merge<ConfiguredScheduleSlot, typeof _>)

export type ZodConfiguredScheduleSlot = z.infer<typeof ConfiguredScheduleSlotSchema>

export const ScheduleHourSchema = z
  .object({
    hoursStartUTC: zodTimeParser,
    hoursEndUTC: zodTimeParser,
    downtime: DurationSchema
  })
  .passthrough()
  .transform((_) => _ as Merge<ScheduleHour, typeof _>)

export type ZodScheduleHour = z.infer<typeof ScheduleHourSchema>

export interface ShiftData {
  shiftModelId: string
  shiftType: Shift
}

export interface ConfiguredScheduleSlotInput {
  partId: string
  partName: Nullable<string>
  partNumber: Nullable<string>
  unitId: string
  unitName: string
  configurationId: string
  shiftTarget: Nullable<number>
  speedMode: Nullable<number>
  cycleTime: Nullable<number>
}

export type Event = z.infer<typeof eventSchema>
export type UnitParameters = AssemblyLineParameters | ProductionUnitParameters

// ? This way, schedule hour instances have dateTime (YYYY-mm-dd HH:MM:SS) and SplitPosition type completions
export interface ScheduleHourEnriched
  extends Omit<ZodScheduleHour, 'hoursStartUTC' | 'hoursEndUTC'>,
    Omit<DateTimeRange<DayJS>, 'downtime'> {
  split?: SplitPosition
}

export interface ScheduleHourResults {
  scheduleHours: ScheduleHourEnriched[]
  scheduleHoursForWholeShift: ScheduleHourEnriched[]
}

export interface ConfigurationInput extends ZodConfigurationInput {
  id: string
  unitId: string
}
