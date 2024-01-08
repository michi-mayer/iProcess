import log from 'loglevel'
import { sumBy } from 'remeda'
import { Type } from 'API'
import { convertTo, durationIn, UnitOfTime } from './time'
import type { ExtendedDateTimeRange, Nullable } from './types'
import { round, sumAggregation } from './utils'

interface WithQuota {
  quota?: Nullable<number>
}

// ! TODO: Please use a single time scale (ms or seconds)
export const getItemDuration = <T extends Omit<ExtendedDateTimeRange, 'type'>>(
  input: T,
  granularity: UnitOfTime = 'seconds'
) => {
  const { dateTimeStartUTC, dateTimeEndUTC, downtime } = input
  const downtimeInSeconds = convertTo(downtime || 0, 'minutes', granularity)
  const duration = durationIn(dateTimeStartUTC, dateTimeEndUTC, { granularity }) - downtimeInSeconds

  log.debug(`Duration for ${JSON.stringify(input)} is ${duration}`)
  return duration
}

export const calculateCycleTimeForNotApplicable = (items: ExtendedDateTimeRange[], output: number) => {
  const onlyProduction = items.filter((_) => _.type === Type.Production)
  const duration = sumAggregation(onlyProduction, (_) => getItemDuration(_, 'milliseconds'))

  return duration / Math.max(output, 1) // * 'output' is also called 'shiftTarget'
}

export const calculateTarget = <T extends WithQuota>(values: T[]) => sumBy(values, (_) => _.quota ?? 0)

// TODO (VDD-543): Model shiftTarget, cycleTime, and speedMode as a discriminative union
export const calculateSlotQuota = <T extends ExtendedDateTimeRange>(
  { dateTimeStartUTC, dateTimeEndUTC, type, downtime }: T,
  cycleTime: number,
  factor?: Nullable<number>,
  granularity: UnitOfTime = 'milliseconds' // ! TODO: Please use a single time scale (ms or seconds)
): number => {
  if (type === Type.Production) {
    const duration = getItemDuration({ dateTimeStartUTC, dateTimeEndUTC, downtime }, granularity)
    const multiplier = factor || 1 // * factor can be 0

    return round((duration / cycleTime) * multiplier, 0)
  } else {
    return 0
  }
}

const throwOnNullish = (cycleTime: Nullable<number>, shiftTarget: Nullable<number>) => {
  throw new Error(`Both shiftTarget (${shiftTarget}) and cycleTime (${cycleTime}) are nullish`)
}

// TODO (VDD-543): Model shiftTarget, cycleTime, and speedMode as a discriminative union
export const calculateCycleTime = <Output = number>(
  values: ExtendedDateTimeRange[],
  cycleTime: Nullable<number>,
  shiftTarget: Nullable<number>,
  otherwise: (cycleTime: Nullable<number>, shiftTarget: Nullable<number>) => Output = throwOnNullish
) => {
  if (cycleTime) {
    // ? Cycle time is retrieved from Assembly Line or Production Unit's mode
    return convertTo(cycleTime, 'seconds', 'milliseconds')
  } else if (shiftTarget) {
    // ? i.e. when it's Assembly Line and mode is 'Not Applicable' => calculateCycleTimeForNotApplicable
    return calculateCycleTimeForNotApplicable(values, shiftTarget)
  } else {
    return otherwise(cycleTime, shiftTarget)
  }
}
