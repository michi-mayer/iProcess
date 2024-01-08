import { suite, assert, it } from 'vitest'
import { Arbitrary, assert as prove, property, record, string, constantFrom, constant } from 'fast-check'


import { toCreateShiftModel } from '../events/duplicate.js'
import { Bool, ShiftModel } from 'iprocess-shared/graphql/API.js'

suite(toCreateShiftModel.name, () => {
  const generator: Arbitrary<ShiftModel> = record({
    __typename: constant('ShiftModel'),
    id: string(),
    name: string(),
    isActive: constantFrom(...Object.values(Bool)),
    timeZone: string(),
    createdAt: string(),
    updatedAt: string()
  })

  it(`GIVEN an object
      WHEN it is of type ShiftModel
      THEN it should only keep the timeZone, append '_copy' to its name, and set it to inactive`, () => {
    prove(property(generator, (input) => {
      const result = toCreateShiftModel(input)

      assert.hasAllKeys(result, ['timeZone', 'name', 'isActive'])
      assert.ok(result.name.includes('_copy'))
      assert.ok(result.isActive === Bool.no)
    }))
  })
})
