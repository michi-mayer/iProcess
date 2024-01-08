import { suite, it } from 'vitest'

import { EventSchema } from '../types.js'

import inputEvent from '../sample-input-event.json'

suite('EventSchema', () => {
  it('should parse a valid input', () => {
    EventSchema.parse(inputEvent)
  })
})
