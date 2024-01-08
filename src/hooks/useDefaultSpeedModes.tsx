import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { UnitType } from '../API'
import { useIProcessState } from '../contexts/iProcessContext'
import { DefaultItem } from '../lib/form/SelectDropDown'

const useDefaultSpeedModes = () => {
  const { t } = useTranslation('iProcess')
  const { unitSelected } = useIProcessState()
  const defaultAssemblyLineSpeedMode: DefaultItem = useMemo(
    () => ({ id: '1', name: t('configuration.notApplicable'), value: 0 }),
    [t]
  )
  const defaultProductionSpeedMode: DefaultItem = useMemo(
    () => ({ id: '1', name: t('configuration.standard'), value: 1 }),
    [t]
  )

  return {
    defaultItem:
      unitSelected?.type === UnitType.assemblyLine ? defaultAssemblyLineSpeedMode : defaultProductionSpeedMode,
    defaultAssemblyLineSpeedMode,
    defaultProductionSpeedMode
  }
}

export default useDefaultSpeedModes
