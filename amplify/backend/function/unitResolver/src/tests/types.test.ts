import { suite, assert, it } from 'vitest'
import { z } from 'zod'

import { EmptyZodObject, getEvent, objectOf } from 'iprocess-shared'
import { MutateUnitMutationVariables } from 'iprocess-shared/graphql/API.js'

import { isCreateEvent, isDeleteEvent, isUpdateEvent } from '../types.js'

import rawCreateEvent from './event-create.json'
import rawUpdateEvent from './event-update.json'
import rawDeleteEvent from './event-delete.json'

const parseEvent = (event: unknown) =>
  z.object({ arguments: objectOf(EmptyZodObject).withType<MutateUnitMutationVariables>() }).parse(event)

suite('Event type guards', () => {
  it('should validate when an event is of type `Create`', () => {
    const event = getEvent(parseEvent(rawCreateEvent))

    assert.ok(isCreateEvent(event))
    assert.isDefined(event.put?.name)
    assert.isNull(event.put?.manufacturer)

    assert.notOk(isUpdateEvent(event))
    assert.notOk(isDeleteEvent(event))
  })

  it('should validate when an event is of type `Update`', () => {
    const event = getEvent(parseEvent(rawUpdateEvent))

    assert.ok(isUpdateEvent(event))
    assert.notOk(isCreateEvent(event))
    assert.notOk(isDeleteEvent(event))
  })

  it('should validate when an event is of type `Delete`', () => {
    const event = getEvent(parseEvent(rawDeleteEvent))

    assert.ok(isDeleteEvent(event))
    assert.notOk(isCreateEvent(event))
    assert.notOk(isUpdateEvent(event))
  })
})
