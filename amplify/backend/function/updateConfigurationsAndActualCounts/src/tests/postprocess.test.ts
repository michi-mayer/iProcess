import { describe, expect, it } from 'vitest'

import { AppError, defined, dateTimeParser } from 'iprocess-shared'
import { Shift, SplitPosition, Type } from 'iprocess-shared/graphql/index.js'

import { ConfiguredScheduleSlotSchema } from '../types.js'
import { parseConfiguredScheduleSlots, processScheduleHours, processSlots, findItemToUpdate } from '../postprocess.js'

import { parsedConfiguredScheduleSlots, configuredScheduleSlotsInDatabase, parsedScheduleHours } from './mocks.test.js'

describe(findItemToUpdate.name, () => {
  const slotsInDatabase = configuredScheduleSlotsInDatabase.map((_) => ConfiguredScheduleSlotSchema.parse(_))

  it('should return an updated item if it is in the provided list', () => {
    const item = { ...defined(slotsInDatabase[0]), actualCount: 10, downtime: '00:05' }
    const result = findItemToUpdate(slotsInDatabase, item)

    expect(result).toBeDefined()
    expect(result?.actualCount).toStrictEqual(10) // ? set to '5' originally
    expect(result?.downtime).toStrictEqual('00:05') // ? set to 'null' originally
  })

  it('should return "undefined" if it is in the provided list but its type is not "Production"', () => {
    const item = { ...defined(slotsInDatabase[1]), actualCount: 10 }
    const result = findItemToUpdate(slotsInDatabase, item)

    expect(result).toBeUndefined()
  })
})

describe(processSlots.name, () => {
  const slots = parsedConfiguredScheduleSlots()

  it('should retrieve the ConfiguredScheduleSlots to create, update, and delete', () => {
    const slotsInDatabase = configuredScheduleSlotsInDatabase.map((_) => ConfiguredScheduleSlotSchema.parse(_))

    slotsInDatabase.push(
      ConfiguredScheduleSlotSchema.parse({
        __typename: 'actualCount',
        id: 'actual-count-id-7',
        dateTimeStartUTC: '2022-03-15T01:15:00.000Z',
        dateTimeEndUTC: '2022-03-15T02:15:00.000Z',
        shift: Shift.nightShift,
        type: Type.Production,
        configurationId: '',
        shiftModelId: '6124af83-1bb4-42cf-a705-6f11f0e0f038',
        partId: '7cd0c408-e619-41ee-be66-54317aaf411e',
        timeZone: 'Europe/Berlin',
        unitId: 'some-unit-id',
        createdAt: '2022-03-15T01:00:00.000Z',
        updatedAt: '2022-03-15T01:00:00.000Z',
        quota: 50,
        actualCount: 10,
        defective: 3
      })
    )

    const { itemsToCreate, itemsToUpdate, itemsToDelete } = processSlots(slots, slotsInDatabase, {})

    expect(itemsToCreate).toHaveLength(3)
    expect(itemsToCreate.map((_) => _.id)).to.have.all.members([
      'actual-count-id-2',
      'actual-count-id-3',
      'actual-count-id-4'
    ])
    expect(itemsToCreate.map((_) => _.dateTimeEndUTC)).to.have.all.members([
      '2022-03-15T05:15:00.000Z',
      '2022-03-15T05:15:00.000Z',
      '2022-03-15T04:15:00.000Z'
    ])

    expect(itemsToUpdate).toHaveLength(1)
    expect(itemsToUpdate.map((_) => _.id)).to.have.all.members(['actual-count-id-10'])

    expect(itemsToDelete).toHaveLength(2)
    expect(itemsToDelete).to.have.all.members(['actual-count-id-7', 'actual-count-id-11'])
  })
})

describe(parseConfiguredScheduleSlots.name, () => {
  it('should return the input unaffected if there are no split attributes', () => {
    const slots = parsedConfiguredScheduleSlots()
    const result = parseConfiguredScheduleSlots(slots)

    expect(result.length).toBe(4)
    expect(result).to.have.all.members(slots)
  })

  it('should return set a slot`s split attribute from undefined to `Last` if the previous one is `First`', () => {
    const slots = parsedConfiguredScheduleSlots()
    defined(slots[0]).split = SplitPosition.First

    const result = parseConfiguredScheduleSlots(slots)

    expect(result.length).toBe(4)
    expect(defined(result[0]).split).toBe(SplitPosition.First)
    expect(defined(result[1]).split).toBe(SplitPosition.Last)
  })

  it('should return set a slot`s split attribute from undefined to `First` if the next one is `Last`', () => {
    const slots = parsedConfiguredScheduleSlots()
    defined(slots[1]).split = SplitPosition.Last

    const result = parseConfiguredScheduleSlots(slots)

    expect(result.length).toBe(4)
    expect(defined(result[0]).split).toBe(SplitPosition.First)
    expect(defined(result[1]).split).toBe(SplitPosition.Last)
  })

  it('should return the input unaffected if all or some have split attributes', () => {
    const slots = parsedConfiguredScheduleSlots()
    defined(slots[1]).split = SplitPosition.First
    defined(slots[2]).split = SplitPosition.Middle
    defined(slots[3]).split = SplitPosition.Last

    const result = parseConfiguredScheduleSlots(slots)

    expect(result).to.have.all.members(slots)
  })

  it('should fail if the order of split positions is not kept', () => {
    const slots = parsedConfiguredScheduleSlots()
    defined(slots[2]).split = SplitPosition.Middle

    expect(() => parseConfiguredScheduleSlots(slots)).toThrowError(AppError)
  })
})

describe(processScheduleHours.name, () => {
  it('should filter by time range, adjust the datetime values and keep out values with duration 0', () => {
    const items = parsedScheduleHours()
    const shiftTimeRange = {
      dateTimeStartUTC: dateTimeParser('2022-11-18T13:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2022-11-18T21:30:00.000Z')
    }
    const configurationTimeRange = {
      dateTimeStartUTC: dateTimeParser('2022-11-18T13:30:00.000Z'),
      dateTimeEndUTC: dateTimeParser('2022-11-18T19:30:00.000Z')
    }

    const result = processScheduleHours(items, shiftTimeRange, configurationTimeRange)

    expect(result).toBeTruthy()
  })
})
