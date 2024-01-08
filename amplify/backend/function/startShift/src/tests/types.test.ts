import { suite, assert, it } from 'vitest'

import { ScheduleHour, Shift, Type } from 'iprocess-shared/graphql/API.js'

import { EventSchema, ScheduleHourSchema } from '../types.js'

import inputEvent from '../sampleInputEvent.json'

suite('EventSchema', () => {
  it('should parse a valid input', () => {
    const result = EventSchema.parse(inputEvent)
    assert.strictEqual(result.timeRange.startDateTime, '2023-06-15T06:30:00.000Z')
  })
})

suite('ScheduleHourSchema', () => {
  it('should parse a valid input', () => {
    const data: ScheduleHour = {
      __typename: 'ScheduleHour',
      id: '14c6aa50-ef1c-4d73-8681-d507bb09354a',
      hoursStartUTC: '22:00:00.000',
      hoursEndUTC: '00:15:00.000',
      shiftType: Shift.nightShift,
      shiftModelId: '14c6aa50-ef1c-4d73-8680-d507bb09354a',
      timeZone: 'Europe/Berline',
      createdAt: '2022-03-15T03:37:34.380Z',
      updatedAt: '2022-03-15T03:37:34.380Z',
      type: Type.Production,
      downtime: '00:10',
      i: 0
    }

    const result = ScheduleHourSchema.parse(data)
    
    assert.strictEqual(result.hoursStartUTC.toISOString(), '1970-01-01T22:00:00.000Z')
    assert.strictEqual(result.hoursEndUTC.toISOString(), '1970-01-01T00:15:00.000Z')
    assert.typeOf(result.downtime, 'number')
  })
})
