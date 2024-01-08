import { describe, expect, it } from 'vitest'

import { ConfiguredScheduleSlotSchema, eventSchema, ScheduleHourSchema } from '../types.js'

import { rawEvent, RawEvent, RawConfig as Config, configuredScheduleSlots, scheduleHours } from './mocks.test.js'
import sampleEvent from './sampleInputEvent.json'

function updateEvent(anEvent: RawEvent, updateFunction: (_: RawEvent) => RawEvent): RawEvent {
  const newEvent = { ...anEvent }
  return updateFunction(newEvent)
}

function setInvalidConfiguration(updateConfiguration: (_: Config) => Config, event: RawEvent): RawEvent {
  event.arguments.configurations = event.arguments.configurations.map(updateConfiguration)

  return event
}

function setInvalidConfigurationIds(configurationIds: string[], event: RawEvent): RawEvent {
  event.arguments.configurationIdsToDelete = configurationIds
  return event
}

function setPartIdToEmpty(_: Config): Config {
  return { ..._, partId: '' }
}

describe('Event parser', () => {
  it('should parse a valid event', () => {
    expect(eventSchema.parse(sampleEvent)).toBeTruthy()
  })

  it('should fail if the shift target is not greater than 0', () => {
    const invalidEvent = updateEvent(rawEvent as RawEvent, (_) =>
      setInvalidConfiguration((_) => {
        return { ..._, partId: '' }
      }, _)
    )

    const result = eventSchema.safeParse(invalidEvent)
    expect(result.success).toBeFalsy()
  })

  it('should fail if the list of configurations has an invalid structure', () => {
    const invalidEvent = updateEvent(rawEvent as RawEvent, (_) => setInvalidConfiguration(setPartIdToEmpty, _))

    const result = eventSchema.safeParse(invalidEvent)
    expect(result.success).toBeFalsy()
  })

  it('should fail if the list of configurations is empty', () => {
    const invalidEvent = { ...rawEvent }
    rawEvent.arguments.configurations = []

    const result = eventSchema.safeParse(invalidEvent)
    expect(result.success).toBeFalsy()
  })

  it('should fail if the list of configuration IDs to delete has an invalid ID', () => {
    const invalidEvent = updateEvent(rawEvent as RawEvent, (_) => setInvalidConfigurationIds(['1', '2'], _))

    const result = eventSchema.safeParse(invalidEvent)
    expect(result.success).toBeFalsy()
  })

  it('should fail if the list of configuration IDs to delete is empty', () => {
    const invalidEvent = updateEvent(rawEvent as RawEvent, (_) => setInvalidConfigurationIds([], _))

    const result = eventSchema.safeParse(invalidEvent)
    expect(result.success).toBeFalsy()
  })
})

describe('Configured Schedule Slot parser', () => {
  it('should parse a valid event', () => {
    const result = ConfiguredScheduleSlotSchema.parse(configuredScheduleSlots[0])

    expect(result).toBeTruthy()
    expect('shift' in result).toBeTruthy() // * It also keeps unspecified fields
  })
})

describe('Schedule Hour parser', () => {
  it('should parse a valid event', () => {
    const result = ScheduleHourSchema.parse(scheduleHours[0])

    expect(result).toBeTruthy()
    expect('createdAt' in result && 'updatedAt' in result).toBeTruthy() // * It also keeps unspecified fields
  })
})
