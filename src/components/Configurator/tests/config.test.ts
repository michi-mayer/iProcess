import { assert, describe, it } from 'vitest'
import { ScheduleHour, Shift as ShiftAPI, Type } from 'API'
import { Shift, ShiftTimeRange } from 'contexts/iProcessContext'
import { ConfigurationUnit, isActiveShift, isOutOfTimeRange } from '../utils'

type PartialScheduleHour = Pick<ScheduleHour, 'type' | 'shiftType'>

describe('isActiveShift', () => {
  it('should return false if shiftModel is undefined', () => {
    const result = isActiveShift(undefined, ShiftAPI.morningShift)
    assert.equal(result, false)
  })

  it('should return false if scheduleHours array is empty', () => {
    const shiftModel = {
      scheduleHours: []
    }
    const result = isActiveShift(shiftModel, ShiftAPI.morningShift)
    assert.equal(result, false)
  })

  it('should return true if no inactive shift of the given type exists', () => {
    const scheduleHours: PartialScheduleHour[] = [
      { type: Type.Production, shiftType: ShiftAPI.morningShift },
      { type: Type.Production, shiftType: ShiftAPI.afternoonShift }
    ]
    const shiftModel = {
      scheduleHours
    }
    const result = isActiveShift(shiftModel, ShiftAPI.afternoonShift)
    assert.equal(result, true)
  })

  it('should return false if inactive shift of the given type exists', () => {
    const scheduleHours: PartialScheduleHour[] = [
      { type: Type.Production, shiftType: ShiftAPI.morningShift },
      { type: Type.Inactive, shiftType: ShiftAPI.afternoonShift }
    ]
    const shiftModel = {
      scheduleHours
    }
    const result = isActiveShift(shiftModel, ShiftAPI.afternoonShift)
    assert.equal(result, false)
  })
})

describe('isOutOfTimeRange', () => {
  it('returns true if shift is MorningShift and the time is out of the range', () => {
    const configuration: ConfigurationUnit = {
      validFrom: '08:00',
      validUntil: '13:00'
    }
    const shiftTimeRange: Partial<ShiftTimeRange> = {
      startTime: '08:00:00',
      endTime: '12:00:00'
    }

    const result = isOutOfTimeRange(configuration, shiftTimeRange, Shift.morningShift)

    return assert.equal(result, true)
  })

  it('returns false if shift is MorningShift and the time is within the range', () => {
    const configuration: ConfigurationUnit = {
      validFrom: '08:00',
      validUntil: '12:00'
    }
    const shiftTimeRange: Partial<ShiftTimeRange> = {
      startTime: '07:00:00',
      endTime: '13:00:00'
    }

    const result = isOutOfTimeRange(configuration, shiftTimeRange, Shift.morningShift)

    return assert.equal(result, false)
  })

  it('returns true if shift is AfternoonShift and the time is out of the range', () => {
    const configuration: ConfigurationUnit = {
      validFrom: '12:00',
      validUntil: '17:00'
    }
    const shiftTimeRange: Partial<ShiftTimeRange> = {
      startTime: '12:00:00',
      endTime: '16:00:00'
    }

    const result = isOutOfTimeRange(configuration, shiftTimeRange, Shift.afternoonShift)

    return assert.equal(result, true)
  })

  it('returns false if shift is AfternoonShift and the time is within the range', () => {
    const configuration: ConfigurationUnit = {
      validFrom: '12:00',
      validUntil: '16:00'
    }
    const shiftTimeRange: Partial<ShiftTimeRange> = {
      startTime: '11:00:00',
      endTime: '17:00:00'
    }

    const result = isOutOfTimeRange(configuration, shiftTimeRange, Shift.afternoonShift)

    return assert.equal(result, false)
  })

  it('returns true if shift is NightShift and the time is out of the range', () => {
    const configuration: ConfigurationUnit = {
      validFrom: '21:30',
      validUntil: '03:00'
    }
    const shiftTimeRange: Partial<ShiftTimeRange> = {
      startTime: '21:30:00',
      endTime: '02:00:00',
      dateTimeStart: '2023-06-19T18:00:00',
      dateTimeEnd: '2023-06-20T02:00:00'
    }

    const result = isOutOfTimeRange(configuration, shiftTimeRange, Shift.nightShift)

    return assert.equal(result, true)
  })

  it('returns false if shift is NightShift and the time is within the range', () => {
    const configuration: ConfigurationUnit = {
      validFrom: '18:00',
      validUntil: '02:00'
    }
    const shiftTimeRange: Partial<ShiftTimeRange> = {
      startTime: '17:00:00',
      endTime: '03:00:00',
      dateTimeStart: '2023-06-19T17:00:00',
      dateTimeEnd: '2023-06-20T03:00:00'
    }

    const result = isOutOfTimeRange(configuration, shiftTimeRange, Shift.nightShift)

    return assert.equal(result, false)
  })
})
