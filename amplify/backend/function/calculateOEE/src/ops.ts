import log from 'loglevel'
import { sumBy } from 'remeda'

import { durationIn, round, durationInMinutesParser } from 'iprocess-shared'
import { CreateOEEInput, Defective, OEE, Type } from 'iprocess-shared/graphql/index.js'

import { ZodTimeSlot, ZodDisruption } from './types.js'
import { durationFromTimeRange, durationIsEnough, TimeRange } from './time.js'
import { ShiftPeriod } from './shift.js'

export const toOEE = (id: string, input: CreateOEEInput): OEE => ({
  ...input,
  __typename: 'OEE',
  id
})

export const discardShortDisruptions = (disruptions: ZodDisruption[], targetCycleTime: number) =>
  disruptions.filter((_) => durationIsEnough(durationInMinutesParser(_.duration) ?? 0, targetCycleTime))

export const discardShortDisruptionsOnBoundaries = (
  disruptions: ZodDisruption[],
  targetCycleTime: number,
  shiftTimeRange: TimeRange
) => disruptions.filter((_) => durationIsEnough(durationFromTimeRange(_, shiftTimeRange), targetCycleTime))

export const sumDefectiveCounts = (defectives: Defective[]) => sumBy(defectives, (_) => round(_.count || 0, 0))

export const sumDurationWithinShift = (disruptions: ZodDisruption[]) =>
  sumBy(disruptions, (_) => durationInMinutesParser(_.duration) || 0)

export const sumDurationInBoundaries = (disruptionOnBoundaries: ZodDisruption[], shiftTimeRange: TimeRange) =>
  sumBy(disruptionOnBoundaries, (_) => durationFromTimeRange(_, shiftTimeRange))

export const getCycleTime = (netOperatingTime: number, quotaSum: number) => round(netOperatingTime / quotaSum)

/**
 * Percentage of productive time (this is, time not wasted in a disruption)
 */
export const getAvailability = (netOperatingTime: number, disruptionDurationSum: number) =>
  round((netOperatingTime - disruptionDurationSum) / netOperatingTime)

/**
 * Percentage of how many parts have been produced with respect to what could have been produced,
 * taking into account the productive time available
 */
export const getPerformance = (availability: number, actualCountSum: number, quotaSum: number) =>
  round(actualCountSum / (availability * quotaSum))

/**
 * Percentage of produced parts that are not defective
 */
export const getQuality = (actualCountSum: number, defectiveCountSum: number) =>
  round((actualCountSum - defectiveCountSum) / actualCountSum)

// Calculate all values needed for OEE calculation from the table of ConfiguredScheduleSlots
export const aggregateTimeSlots = (timeSlots: ZodTimeSlot[]) => {
  const slotValues = { actualCountSum: 0, quotaSum: 0, netOperatingTime: 0 }

  for (const { type, quota, actualCount, dateTimeStartUTC, dateTimeEndUTC, downtime } of timeSlots) {
    if (type === Type.Production) {
      const duration = durationIn(dateTimeStartUTC, dateTimeEndUTC, { granularity: 'minutes' })

      slotValues.quotaSum += round(quota || 0, 0)
      slotValues.actualCountSum += round(actualCount || 0, 0)
      // ? Net Operating Time is calculated as sum of all production minutes per shift
      slotValues.netOperatingTime += round(duration - (downtime || 0), 0)
    }
  }

  return slotValues
}

export const buildOEEItem = (
  { unitId, timeRange: shiftTimeRange, slots }: ShiftPeriod,
  defectives: Defective[],
  disruptions: ZodDisruption[],
  disruptionsOnBoundaries: ZodDisruption[]
): CreateOEEInput => {
  const shiftType = slots[0].shift
  const { quotaSum, actualCountSum, netOperatingTime } = aggregateTimeSlots(slots)
  const cycleTime = getCycleTime(netOperatingTime, quotaSum)

  const validDisruptions = discardShortDisruptions(disruptions, cycleTime)
  const validDisruptionOnBoundaries = discardShortDisruptionsOnBoundaries(
    disruptionsOnBoundaries,
    cycleTime,
    shiftTimeRange
  )

  const defectiveCountSum = sumDefectiveCounts(defectives)
  const disruptionDurationSum =
    sumDurationWithinShift(validDisruptions) + sumDurationInBoundaries(validDisruptionOnBoundaries, shiftTimeRange)

  const availability = getAvailability(netOperatingTime, disruptionDurationSum)
  const performance = getPerformance(availability, actualCountSum, quotaSum)
  const quality = getQuality(actualCountSum, defectiveCountSum)

  log.debug('availability:', JSON.stringify({ netOperatingTime, disruptionDurationSum, availability }))
  log.debug('performance:', JSON.stringify({ availability, actualCountSum, quotaSum, performance }))
  log.debug('quality:', JSON.stringify({ actualCountSum, defectiveCountSum, quality }))

  return {
    unitId,
    availability,
    performance,
    quality,
    actualCountSum,
    quotaSum,
    disruptionDurationSum,
    defectiveCountSum,
    shiftType,
    overall: round(availability * performance * quality),
    netOperatingTimeInMinutes: netOperatingTime,
    targetCycleTimeInMinutes: round(cycleTime, 0),
    timeZone: 'Europe/Berlin',
    startTimeDateUTC: shiftTimeRange.start.toISOString(),
    endTimeDateUTC: shiftTimeRange.end.toISOString()
  }
}
