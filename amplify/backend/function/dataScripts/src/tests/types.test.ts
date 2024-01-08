import { describe, expect, it } from 'vitest'

import { EventSchema } from '../types.js'

import sampleEvent from '../sample-event.json'

describe('eventSchema', () => {
  it('should parse a valid event', () => {
    const result = EventSchema.parse(sampleEvent)
    expect(result).toBeTruthy()
  })

  it('should fail if any attribute is not of the expected type', () => {
    expect(() => EventSchema.parse({})).toThrow()
  })
})
