import { assert, describe, it } from 'vitest'
import { UnitType } from 'API'
import { ExtendedUnit } from 'contexts/iProcessContext'
import { isUnitConnectedToMachine } from 'helper/units'

export const sampleUnit: ExtendedUnit = {
  id: '7cd0c408-e619-41ee-be66-54317aaf411e',
  createdAt: '2022-06-30T07:13:44.972Z',
  groupingId: '59ce247c-80d6-4380-b27a-c5d32dd7f06e',
  machineId: '00000000-0000-0000-0000-000000000000',
  manufacturer: 'Fa. Rampf',
  name: 'PWK-2 1196 Klebeanlage 1',
  shortName: 'K 1',
  speedModeCollection: [
    {
      id: 'e90419b8-135b-4c45-8c49-bad747ec8e84',
      name: 'Double',
      value: 2
    },
    {
      id: '18f701fd-cf73-4120-9bfe-4101af712bde',
      name: 'Triple',
      value: 3
    }
  ],
  type: UnitType.productionUnit
}

describe(isUnitConnectedToMachine.name, function () {
  it('Receives a connected Unit and returns true', function () {
    const connectedUnit: ExtendedUnit = { ...sampleUnit, machineId: 'H41-EG-C18-Fuegeanlage-K01' }

    const result = isUnitConnectedToMachine(connectedUnit)
    return assert.strictEqual(result, true)
  })
  it('Receives an unconnected Unit and returns false', function () {
    const result = isUnitConnectedToMachine(sampleUnit)
    return assert.strictEqual(result, false)
  })
})
