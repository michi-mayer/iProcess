import { useMemo } from 'react'
import { getCurrentConfigs } from 'helper/utils'
import { useIProcessState } from '../contexts/iProcessContext'

const useHasActiveConfiguration = () => {
  const { configurationByUnitId, unitSelected, shiftTimeRange } = useIProcessState()

  return useMemo(() => {
    const currentConfig = getCurrentConfigs(configurationByUnitId, unitSelected?.id)
    return currentConfig?.some((_) => _.validFrom === shiftTimeRange?.dateTimeStart)
  }, [configurationByUnitId, shiftTimeRange?.dateTimeStart, unitSelected?.id])
}

export default useHasActiveConfiguration
