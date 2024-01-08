import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { UnitType } from 'API'
import AssemblyLineIcon from 'components/Icons/assemblyLine.svg'
import ConnectedAssemblyLineIcon from 'components/Icons/connectedAssemblyLine.svg'
import ConnectedProductionLineIcon from 'components/Icons/connectedProductionUnit.svg'
import ProductionUnitIcon from 'components/Icons/productionUnit.svg'
import UnitIcon from './UnitIcon'

describe('UnitIcon', () => {
  it.each([
    { unitType: UnitType.assemblyLine, isConnected: true, expected: ConnectedAssemblyLineIcon },
    { unitType: UnitType.assemblyLine, isConnected: false, expected: AssemblyLineIcon },
    { unitType: UnitType.productionUnit, isConnected: true, expected: ConnectedProductionLineIcon },
    { unitType: UnitType.productionUnit, isConnected: false, expected: ProductionUnitIcon }
  ])('Checks icons render', ({ unitType, isConnected, expected }) => {
    const { container } = render(<UnitIcon unitType={unitType} isConnected={isConnected} />)

    expect(container.innerHTML).toContain(expected)
  })
})
