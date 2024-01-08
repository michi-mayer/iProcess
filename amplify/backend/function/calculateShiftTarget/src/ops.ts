import log from 'loglevel'

import { calculateTarget, calculateSlotQuota, adjustDateDifference, ExtendedDateTimeRange } from 'iprocess-shared'
import { actualCount as TimeSlot } from 'iprocess-shared/graphql/index.js'

import { Event, ZodScheduleHour } from './types.js'

export type ConfiguredScheduleSlot = Partial<TimeSlot>

export const calculateShiftTarget = (scheduleHours: ZodScheduleHour[], { cycleTime, speedMode }: Event) =>
  calculateTarget(
    scheduleHours.map(({ shiftType: shift, hoursStartUTC, hoursEndUTC, type, downtime }) => {
      const { startTime, endTime } = adjustDateDifference(hoursStartUTC, hoursEndUTC, shift)
      const input: ExtendedDateTimeRange = { dateTimeStartUTC: startTime, dateTimeEndUTC: endTime, type, downtime }
      const quota = calculateSlotQuota(input, cycleTime, speedMode, 'seconds')

      log.debug(
        `Data for schedule hour value`,
        JSON.stringify({ hoursStartUTC, hoursEndUTC, input, cycleTime, speedMode, quota })
      )

      return { quota }
    })
  )
