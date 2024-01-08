import { suite, it } from 'vitest'

import { EventSchema } from '../types.js'

import inputEvent from '../sampleInputEvent.json'

suite('Event schema', () => {
  it('should parse a valid input', () => {
    EventSchema.parse(inputEvent)
  })
})
