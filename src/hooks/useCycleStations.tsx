import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import useQueryCycleStations from './services/useQueryCycleStations'
import { UNIT_SPECIFIC_CYCLE_STATION } from 'shared/constants'
import { useIProcessState } from '../contexts/iProcessContext'
import useLocalStorageState from './useLocalStorageState'

const useCycleStations = (teamId?: string) => {
  const { unitSelected } = useIProcessState()
  const [languageSelected] = useLocalStorageState<string>({
    key: 'locale'
  })
  const { t } = useTranslation('iProcess')
  const { data } = useQueryCycleStations({ unitId: unitSelected?.id, teamId })

  return useMemo(
    () =>
      [{ ...UNIT_SPECIFIC_CYCLE_STATION }, ...data]?.map((cycleStation) => {
        if (cycleStation.id === UNIT_SPECIFIC_CYCLE_STATION.id) {
          return {
            ...cycleStation,
            name: t('disruptionDialog.defaultCycleStationName')
          }
        }
        return cycleStation
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, data, languageSelected]
  )
}

export type UseCycleStationsReturn = ReturnType<typeof useCycleStations>
export default useCycleStations
