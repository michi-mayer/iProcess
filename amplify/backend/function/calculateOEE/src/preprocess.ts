import log from 'loglevel'

import { DayJS } from 'iprocess-shared/shared/datetime.js'

import type { ZodDefective, ZodDisruption, ZodTimeSlot } from './types.js'
import { ShiftCollection } from './shift.js'
import { getShiftPeriodFromDisruption } from './mapper.js'
import { TimeRange } from './time.js'

const getDisruptionKey = async ({ unitId, startTimeDateUTC, endTimeDateUTC }: ZodDisruption) => {
  const timeRange = new TimeRange(startTimeDateUTC, endTimeDateUTC)
  const shifts = await getShiftPeriodFromDisruption(unitId, timeRange)

  if (shifts.length === 0) {
    log.warn('Discarding disruption from grouping; there are no keys!', { unitId, startTimeDateUTC, endTimeDateUTC })
    return []
  } else {
    return shifts.map((type) => ({ unitId, type, date: timeRange.start }))
  }
}

export const handleItems = async (
  slots: ZodTimeSlot[],
  disruptions: ZodDisruption[],
  defectives: ZodDefective[],
  now: DayJS
) => {
  const collection = new ShiftCollection()

  for (const { unitId, dateTimeStartUTC: date, shift: type } of slots) {
    await collection.put({ unitId, date, type }, now)
  }

  for (const { unitId, dateTimeUTC: date, shift: type } of defectives) {
    await collection.put({ unitId, type, date }, now)
  }

  for (const item of disruptions) {
    for (const key of await getDisruptionKey(item)) {
      await collection.put(key, now)
    }
  }

  return collection.shifts
}
