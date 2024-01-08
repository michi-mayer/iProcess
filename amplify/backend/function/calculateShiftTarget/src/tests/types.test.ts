import { suite, assert, it } from 'vitest'

import { ScheduleHour, Shift, Type } from 'iprocess-shared/graphql/index.js'

import { EventSchema, ScheduleHourSchema } from '../types.js'

import sampleEvent from './sampleInputEvent.json'

suite('eventSchema', () => {
  it('should parse a valid Event instance', () => {
    EventSchema.parse(sampleEvent)
  })
})

suite('scheduleHourSchema', () => {
  const value: ScheduleHour = {
    __typename: 'ScheduleHour',
    id: '14c6aa50-ef1c-4d73-8681-d507bb09354a',
    i: 0,
    hoursStartUTC: '22:00:00.000',
    hoursEndUTC: '00:15:00.000',
    shiftType: Shift.nightShift,
    shiftModelId: '14c6aa50-ef1c-4d73-8680-d507bb09354a',
    timeZone: 'Europe/Berline',
    createdAt: '2022-03-15T03:37:34.380Z',
    updatedAt: '2022-03-15T03:37:34.380Z',
    type: Type.Production
  }

  it('should parse a valid ScheduleHour instance', () => {
    const result = ScheduleHourSchema.parse(value)

    assert.strictEqual(result.hoursStartUTC.toISOString(), '1970-01-01T22:00:00.000Z')
    assert.strictEqual(result.shiftType, Shift.nightShift)
    assert.ok('timeZone' in result)
  })
})
