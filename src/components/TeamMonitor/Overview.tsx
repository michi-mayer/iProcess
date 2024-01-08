import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import {
  OnMutateDisruptionSubscription,
  OnMutateDisruptionSubscriptionVariables,
  OnStartShiftSubscription,
  OnStartShiftSubscriptionVariables
} from 'API'
import WarningFilledIcon from 'components/Icons/WarningFilledIcon'
import OrderStatusBar from 'components/OrderStatusBar/OrderStatusBar'
import { useIProcessDispatch, useIProcessState } from 'contexts/iProcessContext'
import { useStoreSideBar } from 'contexts/sidebarStore'
import { onMutateDisruption, onStartShift } from 'graphql/subscriptions'
import { UseQueryConfigurationByUnitAndValidFromProps } from 'hooks/services/useQueryConfigurationByUnitAndValidFrom'
import useQueryDisruptionsByTime, { TeamsChoice } from 'hooks/services/useQueryDisruptionsByTime'
import useSubscription from 'hooks/services/useSubscription'
import { useSubscriptionScheduleSlots } from 'hooks/services/useSusbscriptionScheduleSlots'
import useConfigurator from 'hooks/useConfigurator'
import useCurrentConfiguration from 'hooks/useCurrentConfiguration'
import useCurrentShiftInfo from 'hooks/useCurrentShiftInfo'
import useHasActiveConfiguration from 'hooks/useHasActiveConfiguration'
import Toast from 'lib/animation/Toast'
import { colors } from 'theme'
import DisruptionList from './DisruptionList'
import MostFrequentCurrentDisruptionsDiagram from './MostFrequentCurrentDisruptionsDiagram'
import MostFrequentPreviousDisruptionsDiagram from './MostFrequentPreviousDisruptionsDiagram'

interface NoDataAlertProps {
  setShow: (_: boolean) => void
}

const NoDataAlert = ({ setShow }: NoDataAlertProps) => {
  const { t } = useTranslation('teamMonitor')

  return (
    <Grid
      item
      xs={10}
      style={{
        textAlign: 'left',
        margin: '16px',
        borderRadius: '8px'
      }}
      alignItems='center'
    >
      <Toast
        containerStyle={{ margin: '0 -24px 24px -24px' }}
        lineStyle={{ margin: '0px' }}
        typographyStyle={{ lineHeight: 2 }}
        borderColor={colors.orange}
        Icon={<WarningFilledIcon transform='rotate(180)' fill={colors.orange} />}
        description={t('overview.noShiftStartedBanner')}
        onClose={() => setShow(false)}
      />
    </Grid>
  )
}

const useDisruptionsSubscription = () => {
  const { unitSelected } = useIProcessState()
  const queryClient = useQueryClient()

  const getSubscriptionVariables = useCallback((): OnMutateDisruptionSubscriptionVariables | undefined => {
    if (unitSelected?.id) {
      return { unitId: unitSelected.id }
    }
  }, [unitSelected?.id])

  const forwardCallbackUpdate = useCallback(
    ({ onMutateDisruption }: OnMutateDisruptionSubscription) => {
      if (onMutateDisruption) {
        const { unitId } = onMutateDisruption
        queryClient.invalidateQueries({
          queryKey: ['FetchDisruptionsByTime', { unitId }]
        })
      }
    },
    [queryClient]
  )

  useSubscription(onMutateDisruption, forwardCallbackUpdate, getSubscriptionVariables())
}

const useStartShiftSubscription = () => {
  const { unitSelected, shiftTimeRange } = useIProcessState()
  const queryClient = useQueryClient()

  const getSubscriptionVariables = useCallback((): OnStartShiftSubscriptionVariables | undefined => {
    if (unitSelected?.id) {
      return { unitId: unitSelected.id }
    }
  }, [unitSelected?.id])

  const forwardCallbackUpdate = useCallback(
    ({ onStartShift }: OnStartShiftSubscription) => {
      if (onStartShift) {
        queryClient.invalidateQueries({
          queryKey: [
            'ValidConfigurationByUnit',
            {
              unitId: unitSelected?.id,
              dateTimeStartUTC: shiftTimeRange?.dateTimeStartUTC,
              dateTimeEndUTC: shiftTimeRange?.dateTimeEndUTC
            } satisfies UseQueryConfigurationByUnitAndValidFromProps
          ]
        })
      }
    },
    [queryClient, unitSelected?.id, shiftTimeRange?.dateTimeStartUTC, shiftTimeRange?.dateTimeEndUTC]
  )

  useSubscription(onStartShift, forwardCallbackUpdate, getSubscriptionVariables())
}

const Overview = () => {
  useCurrentShiftInfo()
  useConfigurator()
  useCurrentConfiguration()
  useStartShiftSubscription()
  useDisruptionsSubscription()
  useSubscriptionScheduleSlots()

  const { unitSelected, shiftTimeRange, selectedTeam } = useIProcessState()
  const dispatch = useIProcessDispatch()
  const hasActiveConfiguration = useHasActiveConfiguration()
  const [, setStore] = useStoreSideBar((_) => _)
  const [showToast, setShowToast] = useState(false)

  const dateTimeRange = {
    dateTimeStartUTC: shiftTimeRange?.dateTimeStartUTC,
    dateTimeEndUTC: shiftTimeRange?.dateTimeEndUTC
  }

  const originatedByMyTeam = useQueryDisruptionsByTime({
    ...dateTimeRange,
    originator: { by: TeamsChoice.SelectedTeam, id: selectedTeam?.id }
  })

  const reportedByMyTeam = useQueryDisruptionsByTime({
    ...dateTimeRange,
    reporter: { by: TeamsChoice.SelectedTeam, id: selectedTeam?.id },
    originator: { by: TeamsChoice.NoTeam }
  })

  const items = useMemo(
    () => [...originatedByMyTeam.data, ...reportedByMyTeam.data],
    [originatedByMyTeam.data, reportedByMyTeam.data]
  )

  useEffect(() => void setStore({ isCollapsed: true }), [setStore])
  useEffect(() => void setShowToast(!hasActiveConfiguration), [hasActiveConfiguration, unitSelected?.id])

  useEffect(() => {
    if (hasActiveConfiguration) dispatch({ type: 'selectedShiftTab', selectedShiftTab: 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasActiveConfiguration])

  return showToast ? (
    <NoDataAlert setShow={setShowToast} />
  ) : (
    <>
      <OrderStatusBar enableConfigurator={false} />
      <Grid container style={{ margin: 'auto', maxWidth: '1752px', paddingRight: '16px', paddingLeft: '16px' }}>
        <Grid item xs={6} paddingRight='8px' minHeight='375px'>
          <MostFrequentCurrentDisruptionsDiagram
            items={items}
            isLoading={originatedByMyTeam.isPending && reportedByMyTeam.isPending}
            isSuccess={originatedByMyTeam.isSuccess && reportedByMyTeam.isSuccess}
          />
        </Grid>
        <Grid item xs={6} paddingLeft='8px' minHeight='375px'>
          <MostFrequentPreviousDisruptionsDiagram />
        </Grid>
        <DisruptionList items={items} />
      </Grid>
    </>
  )
}

export default Overview
