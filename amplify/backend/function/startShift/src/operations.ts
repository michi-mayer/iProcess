import { v4 as UUIDv4 } from 'uuid'

import {
  Exact,
  extendTimeWithDate,
  calculateCycleTime,
  calculateSlotQuota,
  calculateTarget,
  convertTo,
  defined,
  formatDuration,
  legacySortByDateTime
} from 'iprocess-shared'
import {
  CreateActualCountInput as CreateTimeSlotInput,
  CreateConfigurationInput,
  Bool
} from 'iprocess-shared/graphql/API.js'

import { Event, PartialCreateConfigurationInput, PartialCreateTimeSlotInput, ScheduleHour } from './types.js'

const sortByDateTimeStart = legacySortByDateTime<CreateTimeSlotInput>((_) => _.dateTimeStartUTC)

// * --- Configuration operations ---

export const getConfiguration = ({
  speedMode,
  cycleTime,
  shiftType: _shiftType,
  shiftTarget: _shiftTarget,
  timeRange: _timeRange,
  ...rest
}: Event): Exact<PartialCreateConfigurationInput, Event> => ({
  ...rest,
  // * 'speedMode' is used in the front-end to pick the 'Mode' in 'Assembly Line' units status bar
  // * Thus, we set it with 'cycleTime' because 'Assembly Line' units don't have a 'speedMode'
  speedMode: speedMode ?? cycleTime,
  id: UUIDv4()
})

export const extendConfiguration = (
  configuration: PartialCreateConfigurationInput,
  timeslots: CreateTimeSlotInput[],
  cycleTime: number
): CreateConfigurationInput => {
  const target = calculateTarget(timeslots)

  return {
    ...configuration,
    target,
    shiftTarget: target, // ? for now, there is only a single configuration in the shift
    validFrom: defined(timeslots[0]).dateTimeStartUTC,
    validUntil: defined(timeslots[timeslots.length - 1]).dateTimeEndUTC,
    cycleTime: convertTo(cycleTime, 'milliseconds', 'seconds') // ? in seconds/piece
  }
}

// * --- TimeSlot operations ---

const getTimeSlot = (
  configurationId: string,
  { timeRange, unitId, partId }: Event,
  { hoursStartUTC, hoursEndUTC, shiftType: shift, __typename, ...rest }: ScheduleHour
): PartialCreateTimeSlotInput => ({
  ...rest,
  unitId,
  partId,
  configurationId,
  shift,
  deleted: Bool.no,
  dateTimeStartUTC: extendTimeWithDate(timeRange, hoursStartUTC, shift),
  dateTimeEndUTC: extendTimeWithDate(timeRange, hoursEndUTC, shift)
})

export const getTimeSlots = (
  scheduleHours: ScheduleHour[],
  { cycleTime, shiftTarget, speedMode, ...event }: Event,
  configurationId: string
) => {
  const baseTimeslots = scheduleHours.map((_) => getTimeSlot(configurationId, event, _))
  const validCycleTime = calculateCycleTime(baseTimeslots, cycleTime, shiftTarget)

  const timeslots = baseTimeslots
    .map(({ dateTimeStartUTC, dateTimeEndUTC, downtime, type, ...rest }) => ({
      ...rest,
      type,
      downtime: downtime ? formatDuration(downtime) : undefined,
      dateTimeStartUTC: dateTimeStartUTC.toISOString(),
      dateTimeEndUTC: dateTimeEndUTC.toISOString(),
      quota: calculateSlotQuota({ dateTimeStartUTC, dateTimeEndUTC, type, downtime }, validCycleTime, speedMode)
    }))
    .sort(sortByDateTimeStart)

  return { timeslots, validCycleTime }
}
