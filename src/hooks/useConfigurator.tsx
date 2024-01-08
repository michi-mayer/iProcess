import { useEffect } from 'react'
import useQueryConfigurationByUnitAndValidFrom from './services/useQueryConfigurationByUnitAndValidFrom'
import useQueryScheduleSlots from './services/useQueryScheduleSlots'
import {
  ConfiguratorRecord,
  PreviousConfiguratorRecord,
  useIProcessDispatch,
  useIProcessState
} from '../contexts/iProcessContext'

const useConfigurator = () => {
  const { data: configurationByUnitAndValidFrom, isInitialLoading: isLoadingConfigValidFrom } =
    useQueryConfigurationByUnitAndValidFrom()
  const { data: previousShiftConfigurations } = useQueryConfigurationByUnitAndValidFrom({
    shouldReadPreviousShift: true
  })
  const { data: currentScheduleSlotCollection, isInitialLoading: isLoadingScheduleSlot } = useQueryScheduleSlots()

  const { data: previousScheduleSlotCollection } = useQueryScheduleSlots({
    shouldReadPreviousShift: true
  })
  const { unitSelected, configurationByUnitId, previousShiftConfiguration } = useIProcessState()
  const dispatch = useIProcessDispatch()

  useEffect(() => {
    const lastConfiguration = previousShiftConfigurations?.items?.[previousShiftConfigurations?.items?.length - 1]

    if (previousShiftConfigurations && unitSelected) {
      dispatch({
        type: 'previousShiftConfiguration',
        previousShiftConfiguration: {
          ...previousShiftConfiguration,
          [unitSelected.id as keyof PreviousConfiguratorRecord]: lastConfiguration
        }
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previousShiftConfigurations])

  useEffect(() => {
    if (configurationByUnitAndValidFrom?.items && unitSelected) {
      dispatch({
        type: 'configurationByUnitId',
        configurationByUnitId: {
          ...configurationByUnitId,
          [unitSelected.id as keyof ConfiguratorRecord]: configurationByUnitAndValidFrom?.items
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configurationByUnitAndValidFrom?.items, unitSelected])

  useEffect(() => {
    dispatch({ type: 'currentShiftScheduleSlots', currentShiftScheduleSlots: currentScheduleSlotCollection })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScheduleSlotCollection])

  useEffect(() => {
    dispatch({ type: 'previousShiftScheduleSlots', previousShiftScheduleSlots: previousScheduleSlotCollection })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previousScheduleSlotCollection])

  return { isLoadingConfig: isLoadingConfigValidFrom || isLoadingScheduleSlot }
}

export default useConfigurator
