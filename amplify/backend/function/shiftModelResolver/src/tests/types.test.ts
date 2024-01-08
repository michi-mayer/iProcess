import { suite, assert, it } from 'vitest'
import { z } from 'zod'

import { EmptyZodObject, getEvent, objectOf } from 'iprocess-shared'
import { MutateShiftModelMutationVariables } from 'iprocess-shared/graphql/API.js'

import {
  isCreateEvent,
  isDeleteEvent,
  isDuplicateEvent,
  isUpdateEvent
} from '../types.js'

import rawCreateEvent from './event-create.json'
import rawUpdateEvent from './event-update.json'
import rawDeleteEvent from './event-delete.json'
import rawDuplicateEvent from './event-duplicate.json'

const parseEvent = (event: unknown) =>
  z.object({ arguments: objectOf(EmptyZodObject).withType<MutateShiftModelMutationVariables>() }).parse(event)

suite('Event type guards', () => {
  it('should validate when an event is of type `Create`', () => {
    const event = getEvent(parseEvent(rawCreateEvent))

    assert.ok(isCreateEvent(event))
    assert.isDefined(event.put?.name)
    assert.isNull(event.put?.scheduleHours[0]?.downtime)

    assert.notOk(isDuplicateEvent(event))
    assert.notOk(isUpdateEvent(event))
    assert.notOk(isDeleteEvent(event))
  })

  it('should validate when an event is of type `Update`', () => {
    const event = getEvent(parseEvent(rawUpdateEvent))
    
    assert.ok(isUpdateEvent(event))
    assert.notOk(isCreateEvent(event))
    assert.notOk(isDuplicateEvent(event))
    assert.notOk(isDeleteEvent(event))
  })

  it('should validate when an event is of type `Delete`', () => {
    const event = getEvent(parseEvent(rawDeleteEvent))

    assert.ok(isDeleteEvent(event))
    assert.notOk(isCreateEvent(event))
    assert.notOk(isUpdateEvent(event))
    assert.notOk(isDuplicateEvent(event))
  })

  it('should validate when an event is of type `Duplicate`', () => {
    const event = getEvent(parseEvent(rawDuplicateEvent))
    const isOtherEvent = [isCreateEvent, isUpdateEvent, isDeleteEvent].some((is) => is(event))

    assert.ok(isDuplicateEvent(event))
    assert.notOk(isOtherEvent)
  })
})
