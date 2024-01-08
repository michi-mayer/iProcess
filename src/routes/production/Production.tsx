// Components
import { useTranslation } from 'react-i18next'
import InitialLoadingSpinner from 'components/Configurator/InitialLoadingSpinner'
import NoShiftData from 'components/Configurator/NoShiftData'
import StartShift from 'components/Configurator/StartShift'
import DisruptionDashboard from 'components/Dashboard/DisruptionDashboard'
// Hooks
import { useIProcessState } from 'contexts/iProcessContext'
import useQueryGetPartsByUnit from 'hooks/services/useQueryGetPartsByUnit'
import useConfigurator from 'hooks/useConfigurator'
import useCurrentShiftInfo from 'hooks/useCurrentShiftInfo'
import useHasActiveConfiguration from 'hooks/useHasActiveConfiguration'
import ProductionContainer from './ProductionContainer'

const ProductionScreens = () => {
  const hasActiveConfiguration = useHasActiveConfiguration()
  const { isLoadingConfig } = useConfigurator()
  const { unitSelected } = useIProcessState()
  const { data: partList } = useQueryGetPartsByUnit()
  const { t } = useTranslation()

  switch (true) {
    case isLoadingConfig:
      return <InitialLoadingSpinner />

    case unitSelected?.shiftModels?.length === 0:
      return <NoShiftData id='noShiftModelAddedToUnit' message={t('configuration.noShiftModelAddedToUnit')} />

    case partList?.length === 0:
      return <NoShiftData id='noPartInformationDefined' message={t('configuration.noProductInformationDefined')} />

    case !hasActiveConfiguration:
      return <StartShift />

    default:
      return <DisruptionDashboard />
  }
}

const Production = () => {
  useCurrentShiftInfo()
  return (
    <ProductionContainer>
      <ProductionScreens />
    </ProductionContainer>
  )
}

export default Production
