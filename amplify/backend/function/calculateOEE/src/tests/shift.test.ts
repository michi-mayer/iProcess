import { suite, it, assert, vi, beforeEach } from 'vitest'
import { dateTimeParser, invalidDateTime } from 'iprocess-shared'

import { ShiftPeriod } from '../shift.js'
import { TimeRange } from '../time.js'
import * as mapper from '../mapper.js'

import { firstSlot, shift } from './mocks.test.js'
import { ZodTimeSlot } from '../types.js'

const mapperSpy = vi.spyOn(mapper, 'fetchTimeSlots')

const mockFetch = (returnValue: { timeRange: TimeRange; slots: ZodTimeSlot[] }) => {
  mapperSpy.mockReturnValueOnce(Promise.resolve(returnValue))
}

suite(ShiftPeriod.name, () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should be equal to a ShiftSlotKey with the same key fields', () => {
    const shiftSlotKey = shift.toKey()
    assert.ok(shift.equalsKey(shiftSlotKey))
  })

  it('should create a new instance given a set of ShiftSlotKey parameters', async () => {
    mockFetch({
      slots: [firstSlot],
      timeRange: new TimeRange(firstSlot.dateTimeStartUTC, firstSlot.dateTimeEndUTC)
    })

    const givenDateTime = dateTimeParser('2021-11-10T10:30:00.000Z') // * 1h after the Shift's end

    const other = await ShiftPeriod.new(shift.toKey(), givenDateTime)
    assert.instanceOf(other, ShiftPeriod)
  })

  it('should not create a new instance if the list of timeslots associated to the Shift is empty', async () => {
    mockFetch({ slots: [], timeRange: TimeRange.empty() })

    const givenDateTime = dateTimeParser('2021-11-10T08:30:00.000Z')

    const other = await ShiftPeriod.new(shift.toKey(), givenDateTime)
    assert.isUndefined(other)
  })

  it('should not create a new instance if the shift is ongoing', async () => {
    mockFetch({
      slots: [firstSlot],
      timeRange: new TimeRange(firstSlot.dateTimeStartUTC, firstSlot.dateTimeEndUTC)
    })

    const givenDateTime = dateTimeParser('2021-11-10T09:00:00.000Z') // * 30m before the Shift's end

    const other = await ShiftPeriod.new(shift.toKey(), givenDateTime)
    assert.isUndefined(other)
  })

  it('should not create a new instance if the time range is invalid', async () => {
    mockFetch({
      slots: [{ ...firstSlot, dateTimeStartUTC: invalidDateTime() }],
      timeRange: new TimeRange(invalidDateTime(), firstSlot.dateTimeEndUTC)
    })

    const givenDateTime = dateTimeParser('2021-11-10T10:30:00.000Z') // * 1h after the Shift's end

    const other = await ShiftPeriod.new(shift.toKey(), givenDateTime)
    assert.isUndefined(other)
  })
})
