import { suite, assert, it } from 'vitest'
import { ZodFastCheck } from 'zod-fast-check'
import { assert as prove, property, date } from 'fast-check'

import { DefectiveSchema, DisruptionSchema, EventSchema, OEESchema, TimeSlotSchema } from '../types.js'

import sampleInputEvent from './sample-input-event.json'
import sampleTriggerEvent from './sample-trigger-event.json'
import { defectives, disruptions, firstSlot } from './mocks.test.js'
import { DATETIME_FORMAT, zodDateTimeParser } from 'iprocess-shared'
import { dayjs } from 'iprocess-shared/shared/datetime.js'

const asJSON = (value: object) => JSON.parse(JSON.stringify(value)) as object

const customZodFastCheck = () =>
  ZodFastCheck().override(
    zodDateTimeParser,
    date({ min: new Date('2000-01-01T00:00:00.000Z'), max: new Date('2030-01-01T00:00:00.000Z') }).map((_) =>
      dayjs(_).format(DATETIME_FORMAT)
    )
  )

suite('EventSchema', () => {
  it.each([
    { type: 'input', value: sampleInputEvent },
    { type: 'trigger', value: sampleTriggerEvent }
  ])('should parse a valid $type event', ({ value }) => {
    const { timeRange, persistToDB } = EventSchema.parse(value)

    assert.isTrue(persistToDB)
    assert.ok(timeRange.isValid)
  })

  it('should fail if any attribute is not of the expected type', () => {
    assert.throws(() => EventSchema.parse(undefined))
  })
})

suite('TimeSlotSchema', () => {
  it('should parse a valid TimeSlot input', () => {
    const input = asJSON(firstSlot)
    const result = TimeSlotSchema.parse({ ...input, downtime: '00:10' })

    // * Contains parsed keys
    assert.containsAllKeys(result, ['dateTimeStartUTC', 'dateTimeEndUTC', 'downtime'])
    // * Contains passed-through keys
    assert.containsAllKeys(result, ['quota', 'unitId'])
  })

  it('should fail if any attribute is not of the expected type', () => {
    assert.throws(() => TimeSlotSchema.parse(undefined))
  })
})

suite('DisruptionSchema', () => {
  it('should parse a valid Disruption input', () => {
    const input = asJSON(disruptions[0])
    const result = DisruptionSchema.parse(input)

    // * Contains parsed keys
    assert.containsAllKeys(result, ['startTimeDateUTC', 'endTimeDateUTC'])
    // * Contains passed-through keys
    assert.containsAllKeys(result, ['cycleStationId', 'unitId'])
  })

  it('should fail if any attribute is not of the expected type', () => {
    assert.throws(() => DisruptionSchema.parse(undefined))
  })
})

suite('DefectiveSchema', () => {
  it('should parse a valid Defective input', () => {
    const input = asJSON(defectives[0])
    const result = DefectiveSchema.parse(input)

    // * Contains parsed keys
    assert.containsAllKeys(result, ['dateTimeUTC'])
    // * Contains passed-through keys
    assert.containsAllKeys(result, ['count', 'unitId'])
  })

  it('should fail if any attribute is not of the expected type', () => {
    assert.throws(() => DefectiveSchema.parse(undefined))
  })
})

suite('OEESchema', () => {
  it('should parse a valid OEE input', () => {
    const oeeArbitrary = customZodFastCheck().inputOf(OEESchema)

    prove(
      property(oeeArbitrary, (input) => {
        const result = OEESchema.parse(input)

        // * Contains parsed keys
        assert.containsAllKeys(result, ['id', 'updatedAt'])
      })
    )
  })

  it('should fail if any attribute is not of the expected type', () => {
    assert.throws(() => OEESchema.parse(undefined))
  })
})
