import { suite, it, assert } from 'vitest'
import moment from 'moment'

import {
  sortByDateTime,
  fromEnvironment,
  isDebugModeEnabled,
  getLogLevel,
  batchOperation,
  sortByDateTimeDayJS,
  legacySortByDateTime
} from '../utils/utils.js'
import { dateParser } from '../shared/time.js'

suite('fromEnvironment', () => {
  it('should return the expected environment variable', () => {
    const result = fromEnvironment('DEV') // ? set up in 'vite.config.ts'
    assert.strictEqual(result, '1')
  })

  it(`should throw an Error if there's no such environment variable`, () =>
    assert.throws(() => fromEnvironment('PROD_ENV')))
})

suite('isDebugModeEnabled', () => {
  it('should tell if the DEBUG mode is enabled', () => assert.strictEqual(isDebugModeEnabled(), false))
})

suite('getLogLevel', () => {
  it('should return the current log level', () => assert.strictEqual(getLogLevel(), 'info'))
})

suite(sortByDateTime.name, () => {
  it('should sort a list of values by the selected Moment attribute', () => {
    const input = [
      { dateTime: moment('2022-01-01') },
      { dateTime: moment('2022-01-05') },
      { dateTime: moment('2022-01-03') }
    ]

    const expectedResult = [input[0], input[2], input[1]]
    const result = input.sort(legacySortByDateTime((_) => _.dateTime))

    assert.deepEqual(result, expectedResult)
  })
})

suite(sortByDateTimeDayJS.name, () => {
  it('should sort a list of values by the selected DayJS attribute', () => {
    const input = [
      { dateTime: dateParser('2022-01-01') },
      { dateTime: dateParser('2022-01-05') },
      { dateTime: dateParser('2022-01-03') }
    ]

    const expectedResult = [input[0], input[2], input[1]]
    const result = input.sort(sortByDateTimeDayJS((_) => _.dateTime))

    assert.deepEqual(result, expectedResult)
  })
})

suite('batchOperation', () => {
  it('should run an operation in batches', async () => {
    await batchOperation(async () => await Promise.resolve(undefined), 'test-operation', [1, 2, 3], 1)
  })
})
