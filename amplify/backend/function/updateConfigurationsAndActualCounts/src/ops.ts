import {
  DATETIME_FORMAT,
  calculateSlotQuota,
  calculateTarget,
  calculateCycleTime,
  convertTo,
  formatDuration,
  defined,
  round,
  DateTimeRange,
  sortByDateTimeDayJS
} from 'iprocess-shared'
import {
  CreateConfigurationInput,
  CreateActualCountInput,
  UpdateActualCountInput,
  Bool,
  actualCount,
  UnitType,
  Shift
} from 'iprocess-shared/graphql/index.js'

import { getShiftTarget } from './mapper.js'

import { ConfigurationInput, UnitParameters, ZodConfiguredScheduleSlot, ScheduleHourEnriched } from './types.js'

export interface BuiltConfiguredScheduleSlots {
  slots: ZodConfiguredScheduleSlot[]
  cycleTime: number
}

export interface ProcessedConfiguredScheduleSlots {
  slotsToCreate: CreateActualCountInput[]
  slotsToUpdate: UpdateActualCountInput[]
  slotsToDeleteIds: string[]
}

export const sortByDateTimeStart = sortByDateTimeDayJS<ZodConfiguredScheduleSlot>((_) => _.dateTimeStartUTC)

export function createSlots(
  scheduleHours: ScheduleHourEnriched[],
  scheduleHoursForWholeShift: ScheduleHourEnriched[],
  parameters: UnitParameters,
  otherFields: Partial<actualCount>
): BuiltConfiguredScheduleSlots {
  const shiftTarget = parameters.unitType === UnitType.assemblyLine ? parameters.shiftTarget : undefined
  const speedMode = parameters.unitType === UnitType.productionUnit ? parameters.speedMode : undefined
  const cycleTime = calculateCycleTime(scheduleHoursForWholeShift, parameters.cycleTime, shiftTarget)

  const slots = scheduleHours
    .map(
      ({ shiftModelId, shiftType: shift, type, split, timeZone, dateTimeStartUTC, dateTimeEndUTC, downtime }) =>
        ({
          ...otherFields,
          dateTimeStartUTC,
          dateTimeEndUTC,
          shift,
          shiftModelId,
          timeZone,
          type,
          split,
          downtime: downtime ? formatDuration(downtime) : undefined,
          quota: calculateSlotQuota({ dateTimeStartUTC, dateTimeEndUTC, type, downtime }, cycleTime, speedMode)
        }) as ZodConfiguredScheduleSlot
    )
    .sort(sortByDateTimeStart)

  return { slots, cycleTime }
}

export const buildNewConfiguration = async (
  configuredScheduleSlots: ZodConfiguredScheduleSlot[],
  { parameters, id, partId, unitId, shiftModelId, timeZone }: ConfigurationInput,
  { dateTimeStartUTC, dateTimeEndUTC }: DateTimeRange,
  cycleTimeInMilliseconds: number,
  shiftType: Shift
): Promise<CreateConfigurationInput> => {
  // * 'speedMode' is used in the front-end to pick the 'Mode' in 'Assembly Line' units status bar
  // * Thus, we set it with 'cycleTime' because 'Assembly Line' units don't have a 'speedMode'
  const speedMode = parameters.unitType === UnitType.productionUnit ? parameters.speedMode : parameters.cycleTime
  let shiftTarget: number

  if (parameters.unitType === UnitType.assemblyLine) {
    shiftTarget = parameters.shiftTarget
  } else {
    shiftTarget = await getShiftTarget({
      input: {
        shiftModelId,
        shiftType,
        cycleTime: parameters.cycleTime,
        speedMode: parameters.speedMode
      }
    })
  }

  return {
    id,
    partId,
    unitId,
    shiftModelId,
    speedMode,
    shiftTarget,
    timeZone,
    validFrom: dateTimeStartUTC.toISOString(),
    validUntil: dateTimeEndUTC.toISOString(),
    cycleTime: round(convertTo(cycleTimeInMilliseconds, 'milliseconds', 'seconds'), 0), // ? in seconds/piece
    target: calculateTarget(configuredScheduleSlots)
  }
}

export function toCreateActualCountInput(slot: ZodConfiguredScheduleSlot): CreateActualCountInput {
  return {
    ...slot,
    dateTimeStartUTC: slot.dateTimeStartUTC.format(DATETIME_FORMAT),
    dateTimeEndUTC: slot.dateTimeEndUTC.format(DATETIME_FORMAT),
    deleted: Bool.no
  }
}

export function mergeSlots(
  { id: currentId, defective }: ZodConfiguredScheduleSlot,
  newSlot: ZodConfiguredScheduleSlot
): UpdateActualCountInput {
  const id = defined(currentId)
  return {
    ...newSlot,
    id,
    defective,
    dateTimeStartUTC: newSlot.dateTimeStartUTC.format(DATETIME_FORMAT),
    dateTimeEndUTC: newSlot.dateTimeEndUTC.format(DATETIME_FORMAT),
    deleted: Bool.no
  }
}
