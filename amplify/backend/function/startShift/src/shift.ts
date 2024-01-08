import log from 'loglevel'

import { BaseShiftSlot } from 'iprocess-shared'
import { TimeRange } from 'iprocess-shared/graphql/API.js'

import { createActualCountItem, createConfigurationItem, listTimeSlotsPerShift } from './mapper.js'
import { getConfiguration, extendConfiguration, getTimeSlots } from './operations.js'
import { Event, ScheduleHour } from './types.js'

export class ShiftSlot extends BaseShiftSlot {
  /**
   * (For a night shift) we assume the date matches with the starting Schedule Hour. This is,
   *
   * - If it starts at 23:30 then it should be currentDate
   * - If it starts at 01:30 then it should be currentDate + 1
   *
   * ℹ️ In case we want to get right of this assumption, we must get ScheduleHour info. first
   */
  override async exists(timeRange: TimeRange) {
    const timeslots = await listTimeSlotsPerShift(this.unitId, timeRange, this.type)
    return timeslots.length > 0
  }

  override async start(scheduleHours: ScheduleHour[], event: Event) {
    const baseConfiguration = getConfiguration(event)
    const { timeslots, validCycleTime } = getTimeSlots(scheduleHours, event, baseConfiguration.id)

    const configuration = extendConfiguration(baseConfiguration, timeslots, validCycleTime)

    log.debug('New configuration is', JSON.stringify({ configuration }))
    log.debug('New timeslots are', JSON.stringify({ timeslots }))
    log.debug(`Cycle time used is ${validCycleTime}`)

    await Promise.all([...timeslots.map(createActualCountItem), createConfigurationItem(configuration)])
  }
}
