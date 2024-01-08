import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { sumBy } from 'remeda'
import { isAssemblyLine } from 'types'
import { AttendingShift } from 'API'
import { calculateTotalQuota } from 'helper/operations'
import { getCurrentConfigs } from 'helper/utils'
import { isDefined } from 'shared'
import { useIProcessState } from '../contexts/iProcessContext'
import useHasActiveConfiguration from './useHasActiveConfiguration'

const useGetSpeedMode = () => {
  const { t } = useTranslation()
  const { currentShiftScheduleSlots, selectedShiftTab, unitSelected } = useIProcessState()

  return useMemo(() => {
    const selectedSpeedMode = currentShiftScheduleSlots?.[selectedShiftTab]?.configuration?.speedMode
    const speedModeCollection = unitSelected?.speedModeCollection
    const speedMode = speedModeCollection?.find((speedMode) => speedMode.value === selectedSpeedMode)

    switch (true) {
      case isDefined(speedMode?.name):
        return speedMode?.name as string
      case isAssemblyLine(unitSelected):
        return t('configuration.notApplicable')
      default:
        return t('configuration.standard')
    }
  }, [currentShiftScheduleSlots, selectedShiftTab, unitSelected, t])
}

interface OrderStatusState {
  actualCountSum: number
  trend: number
  quotaSum: number
  speedMode: string
  attendingShift: string
}

const initialOrderStatusState: Readonly<Partial<OrderStatusState>> = {
  actualCountSum: undefined,
  trend: undefined,
  quotaSum: undefined,
  speedMode: undefined,
  attendingShift: undefined
}

const useUpdateOrderStatusBar = () => {
  const { unitSelected, configurationByUnitId, currentShiftScheduleSlots } = useIProcessState()
  const [orderStatus, setOrderStatus] = useState(initialOrderStatusState)
  const hasActiveConfiguration = useHasActiveConfiguration()
  const configurations = getCurrentConfigs(configurationByUnitId, unitSelected?.id)
  const speedMode = useGetSpeedMode()
  const { t } = useTranslation()

  const name = configurations[0]?.attendingShift?.toLowerCase() as Lowercase<`${AttendingShift}`>

  const attendingShift = name ? t(`configuration.attendingShift.${name}`) : undefined

  useEffect(() => {
    let mounted = true
    if (unitSelected && configurations && currentShiftScheduleSlots && mounted) {
      setOrderStatus((previousState) => ({
        ...previousState,
        attendingShift,
        actualCountSum: sumBy(currentShiftScheduleSlots, (_) => _.actualCount ?? 0),
        trend: sumBy(currentShiftScheduleSlots, (_) => _.actualCount ?? _.quota ?? 0),
        quotaSum: calculateTotalQuota(configurations)
      }))
    }
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(configurations), JSON.stringify(currentShiftScheduleSlots), JSON.stringify(unitSelected)])

  useEffect(() => {
    if (hasActiveConfiguration) {
      setOrderStatus((previousState) => ({ ...previousState, speedMode }))
    } else {
      setOrderStatus(initialOrderStatusState)
    }
  }, [hasActiveConfiguration, speedMode])

  return orderStatus
}

export default useUpdateOrderStatusBar
