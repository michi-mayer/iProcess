import moment from 'moment'
import { Disruption, isAssemblyLine } from 'types'
import { z } from 'zod'
import { DisruptionDialogSchema } from 'zodSchemas'
import { Type } from 'API'
import { ExtendedProduct, ExtendedScheduleSlot, ExtendedUnit, UnitConfiguration } from 'contexts/iProcessContext'
import { millisecondsToTime, zodMomentParser } from 'helper/time'
import { DurationSchema } from 'shared'
import { UNIT_SPECIFIC_CYCLE_STATION } from 'shared/constants'
import { calculateCycleTimeForNotApplicable } from 'shared/operations'
import { convertTo } from 'shared/time'
import { Nullable } from 'shared/types'

export const parseDisruption = (disruption: Disruption | undefined) => {
  if (disruption) {
    const durationAsMilliseconds = moment
      .duration(moment(disruption?.endTimeDate).diff(moment(disruption?.startTimeDate)))
      .asMilliseconds()
    const duration = millisecondsToTime(durationAsMilliseconds)
    const input = {
      id: disruption?.id,
      teamId: disruption?.team?.id,
      startDateTime: disruption?.startTimeDate,
      durationInMinutes: moment
        .duration(moment(disruption?.endTimeDate).diff(moment(disruption?.startTimeDate)))
        .asMinutes(),
      duration,
      categoryClassification: disruption?.disLocation,
      reasonClassification: disruption?.disLocationSpecification,
      typeClassification: disruption?.disLocationType,
      measures: disruption?.measures,
      description: disruption?.description,
      templateId: disruption?.templateId,
      cycleStationId: disruption?.cycleStationId || UNIT_SPECIFIC_CYCLE_STATION.id,
      lostVehicles: disruption?.lostVehicles || 0,
      issues: disruption?.issues || [],
      attachments: disruption.attachments,
      isSolved: disruption.isSolved,
      m100: disruption.m100
    }

    const result = DisruptionDialogSchema.safeParse(input)
    if (result.success) {
      return result.data
    } else {
      console.error('Error parsing disruption at parseDisruption (DisruptionSchema):', result.error)
      return input
    }
  }
}

const ScheduleSlotSchema = z.array(
  z.object({
    type: z.nativeEnum(Type),
    downtime: DurationSchema,
    dateTimeStartUTC: zodMomentParser,
    dateTimeEndUTC: zodMomentParser
  })
)

interface CalculationProps {
  lostVehicles: number
  unitSelected: ExtendedUnit | undefined
  startDateTime: string
  configurations: UnitConfiguration[] | undefined
  partSelected: ExtendedProduct | undefined
  currentShiftScheduleSlots: ExtendedScheduleSlot[] | undefined
}

export const calculateDurationOfDisruption = ({
  lostVehicles,
  unitSelected,
  configurations,
  startDateTime,
  partSelected,
  currentShiftScheduleSlots
}: CalculationProps) => {
  const speedMode = getValueFromConfiguration('speedMode', configurations, startDateTime)
  if (isAssemblyLine(unitSelected)) {
    const cycleTime = speedMode
    const quotaSum = getValueFromConfiguration('shiftTarget', configurations, startDateTime)
    if (cycleTime) {
      const cycleTimeAsMilliseconds = convertTo(cycleTime, 'seconds', 'milliseconds')
      return millisecondsToTime(cycleTimeAsMilliseconds * lostVehicles)
    } else {
      const result = ScheduleSlotSchema.safeParse(currentShiftScheduleSlots)
      if (result.success) {
        const scheduleSlots = result.data
        const cycleTimeAsMilliseconds = calculateCycleTimeForNotApplicable(scheduleSlots, quotaSum)
        return millisecondsToTime(cycleTimeAsMilliseconds * lostVehicles)
      } else {
        console.error('calculateDurationOfDisruption at ScheduleSlotSchema:', result.error)
      }
    }
  } else {
    const factor = speedMode
    const unitId = z.string().parse(unitSelected?.id)
    const targetCycleTime = partSelected?.targetCycleTimeAndUnitPart?.get(unitId)
    const parsedTargetCycleTime = z.number().parse(targetCycleTime)
    const cycleTimeAsMilliseconds = convertTo(parsedTargetCycleTime, 'seconds', 'milliseconds')
    return millisecondsToTime((cycleTimeAsMilliseconds * lostVehicles) / factor)
  }
}

export const validateNumber = (value: number) => {
  if (Number.isNaN(value)) {
    return 0
  }
  return value
}

const ConfigurationSchema = z.object({
  speedMode: z.number().nullable(),
  validFrom: z.string(),
  validUntil: z.string(),
  shiftTarget: z.number().nullable()
})

const ArrayConfigurationSchema = z.array(ConfigurationSchema)

type Configuration = z.infer<typeof ConfigurationSchema>

type ConfigurationKey = keyof Configuration

type RemoveDates<TType> = TType extends 'validFrom' | 'validUntil' ? never : TType

type ConfigurationKeyWithoutDates = RemoveDates<ConfigurationKey>

type GetValueFromConfigurationFunction = <TConfig extends Partial<Configuration>>(
  value: ConfigurationKeyWithoutDates,
  configurations: TConfig[] | undefined,
  startDateTime: string
) => number

const isNonEmptyArray = <T>(array: Nullable<T[]>): array is T[] & { 0: T } => array?.length === 1

const getValueFromConfiguration: GetValueFromConfigurationFunction = (key, configurations, startDateTime) => {
  const momentStartDateTime = moment(startDateTime)
  if (isNonEmptyArray(configurations)) {
    return configurations[0][key] || 0
  } else {
    const response = ArrayConfigurationSchema.safeParse(configurations)
    let value = 0
    if (!response.success) {
      console.error('Error when parsing the Configuration Schema', key, response.error)
      return value
    }
    for (const configuration of response.data) {
      const momentValidFrom = moment(configuration.validFrom)
      const momentValidUntil = moment(configuration.validUntil)
      if (momentStartDateTime.isBetween(momentValidFrom, momentValidUntil, 'seconds', '[]')) {
        value = configuration[key] || 0
      } else {
        continue
      }
    }
    return value
  }
}
