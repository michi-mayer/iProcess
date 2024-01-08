import { describe, it, expect } from 'vitest'
import { first, last } from 'remeda'

import { Bool, Shift } from 'iprocess-shared/graphql/API.js'
import { DayJS } from 'iprocess-shared/shared/datetime.js'

import { ZodConfiguredScheduleSlot } from '../types.js'
import { toCreateActualCountInput, sortByDateTimeStart } from '../ops.js'

import { parsedConfiguredScheduleSlots } from './mocks.test.js'

describe('toCreateActualCountInput', () => {
  it('should return "CreateActualCountInput" object', () => {
    const item = first(parsedConfiguredScheduleSlots()) as ZodConfiguredScheduleSlot
    const result = toCreateActualCountInput(item)

    expect(result.deleted).toStrictEqual(Bool.no) // * Check if one of the new attrs has been added
    expect(result.shift).toStrictEqual(Shift.nightShift) // * Check if one of the old attrs is still there
  })
})

describe('sortByDateTimeStart', () => {
  it('should return a list of timeslots sorted by datetime start', () => {
    const result = parsedConfiguredScheduleSlots().sort(sortByDateTimeStart)
    const firstElement = first(result) as ZodConfiguredScheduleSlot
    const lastElement = last(result) as ZodConfiguredScheduleSlot

    expect(firstElement.dateTimeStartUTC).toSatisfy((_: DayJS) => lastElement.dateTimeStartUTC.isAfter(_))
  })
})
