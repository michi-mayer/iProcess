import { FC } from 'react'
import { UnitType } from 'API'
import AssemblyLineIcon from 'components/Icons/assemblyLine.svg'
import ConnectedAssemblyLineIcon from 'components/Icons/connectedAssemblyLine.svg'
import ConnectedProductionLineIcon from 'components/Icons/connectedProductionUnit.svg'
import ProductionLineIcon from 'components/Icons/productionUnit.svg'

interface Props {
  unitType: UnitType
  isConnected: boolean
}

const UnitIcon: FC<Props> = ({ unitType, isConnected }) => {
  switch (unitType) {
    case UnitType.assemblyLine:
      return (
        <img
          style={{ marginRight: '0.5rem' }}
          src={isConnected ? ConnectedAssemblyLineIcon : AssemblyLineIcon}
          loading='lazy'
        />
      )
    default:
      return (
        <img
          style={{ marginRight: '0.5rem' }}
          src={isConnected ? ConnectedProductionLineIcon : ProductionLineIcon}
          loading='lazy'
        />
      )
  }
}

export default UnitIcon
