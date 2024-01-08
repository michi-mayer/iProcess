import moment, { Moment } from 'moment-timezone'
import { Shift as ShiftAPI } from '../API'
import { ExtendedScheduleHour, Shift } from '../contexts/iProcessContext'
import { localTimeFormat } from './time'

export const getShiftStartsFromScheduleHours = (scheduleHours: ExtendedScheduleHour[] | undefined) => {
  const morningShift: ExtendedScheduleHour[] = []
  const afternoonShift: ExtendedScheduleHour[] = []
  const nightShift: ExtendedScheduleHour[] = []

  if (scheduleHours)
    for (const scheduleHour of scheduleHours) {
      if (scheduleHour?.shiftType) {
        if (ShiftAPI[scheduleHour?.shiftType] === ShiftAPI.morningShift) {
          morningShift.push(scheduleHour)
        }
        if (ShiftAPI[scheduleHour?.shiftType] === ShiftAPI.afternoonShift) {
          afternoonShift.push(scheduleHour)
        }
        if (ShiftAPI[scheduleHour?.shiftType] === ShiftAPI.nightShift) {
          nightShift.push(scheduleHour)
        }
      }
    }
  return {
    morningShiftStart: moment(morningShift[0]?.hoursStart ?? '06:30:00', localTimeFormat),
    afternoonShiftStart: moment(afternoonShift[0]?.hoursStart ?? '14:30:00', localTimeFormat),
    nightShiftStart: moment(nightShift[0]?.hoursStart ?? '22:30:00', localTimeFormat)
  }
}

export interface CurrentShiftPositionProps {
  morningShiftStart: Moment
  afternoonShiftStart: Moment
  nightShiftStart: Moment
}

const getShiftInfo = (
  { now, morningShiftStart, afternoonShiftStart, nightShiftStart }: CurrentShiftPositionProps & { now: Moment },
  message = ''
) => {
  const info = {
    isBeforeMorning: now.isBefore(morningShiftStart),
    isAfterMorning: now.isAfter(morningShiftStart),
    isBeforeAfterNoon: now.isBefore(afternoonShiftStart),
    isAfterAfterNoon: now.isAfter(afternoonShiftStart),
    isBeforeNight: now.isBefore(nightShiftStart),
    isAfterNight: now.isAfter(nightShiftStart)
  }
  console.debug(`[currentShift] ${message}`, info)
}

export const currentShiftPosition = ({
  morningShiftStart,
  afternoonShiftStart,
  nightShiftStart
}: CurrentShiftPositionProps) => {
  const now = moment()
  getShiftInfo({ morningShiftStart, afternoonShiftStart, nightShiftStart, now })

  if (now.isAfter(morningShiftStart) && now.isBefore(afternoonShiftStart)) {
    getShiftInfo({ morningShiftStart, afternoonShiftStart, nightShiftStart, now }, 'Preselect MorningShift')
    return Shift.morningShift
  }
  if (now.isAfter(afternoonShiftStart) && now.isBefore(nightShiftStart)) {
    getShiftInfo({ morningShiftStart, afternoonShiftStart, nightShiftStart, now }, 'Preselect AfternoonShift')
    return Shift.afternoonShift
  }
  if (now.isAfter(nightShiftStart) || now.isBefore(morningShiftStart)) {
    getShiftInfo({ morningShiftStart, afternoonShiftStart, nightShiftStart, now }, 'Preselect NightShift')
    return Shift.nightShift
  }

  getShiftInfo({ morningShiftStart, afternoonShiftStart, nightShiftStart, now }, 'Preselect Default MorningShift')
  return Shift.morningShift
}
