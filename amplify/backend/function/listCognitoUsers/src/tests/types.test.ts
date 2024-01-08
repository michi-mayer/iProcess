import { suite, it } from 'vitest'

import { eventSchema } from '../types.js'

import sampleEvent from './sample-input-event.json'

suite('eventSchema', () => {
  it('should parse a valid event', () => {
    eventSchema.parse(sampleEvent)
  })
})
