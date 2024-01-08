import { lazy, Suspense, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useIProcessState } from 'contexts/iProcessContext'
import useHasActiveConfiguration from 'hooks/useHasActiveConfiguration'
import useMediaQuery from 'hooks/useMediaQuery'
import useUpdateOrderStatusBar from 'hooks/useUpdateOrderStatusBar'
import { colors } from 'theme'
import OrderStatusCard from './OrderStatusCard'

const CustomDialog = lazy(() => import('components/Dialogs/CustomDialog'))
const ConfigButton = lazy(() => import('components/Configurator/ConfigButton'))
const UpdateConfigDialog = lazy(() => import('components/Configurator/UpdateConfigDialog'))

// Styling
export const OrderStatusBarContainer = styled(Grid)({
  padding: '16px',
  backgroundColor: colors.white,
  width: '1720px',
  border: `1px solid ${colors.gray3}`
})

interface Props {
  enableConfigurator?: boolean
}

const OrderStatusBar = ({ enableConfigurator = true }: Props = {}) => {
  const [open, setOpen] = useState(false)
  const [isResetConfigDialog, setIsResetConfigDialog] = useState(false)
  const { t } = useTranslation()
  const { actualCountSum, trend, quotaSum, speedMode, attendingShift } = useUpdateOrderStatusBar()
  const hasActiveConfiguration = useHasActiveConfiguration()
  const { productSelected: partSelected, shiftModelSelected } = useIProcessState()
  const [isDesktopWidth] = useMediaQuery('md')

  const mobileFirstRowMarginBottom = isDesktopWidth ? 0 : 2
  const shiftModelName = shiftModelSelected?.name
  const quota = quotaSum === 0 ? undefined : quotaSum
  const actualCount = actualCountSum === 0 ? undefined : actualCountSum
  const product = partSelected.name ? `${partSelected.partNumber} (${partSelected.name})` : undefined

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleCloseCustomDialog = () => {
    if (isResetConfigDialog) {
      setIsResetConfigDialog(false)
    } else {
      handleClose()
    }
  }

  useEffect(() => {
    if (!open) {
      setIsResetConfigDialog(false)
    }
  }, [open])

  return (
    <>
      <OrderStatusBarContainer
        container
        item
        style={{ textAlign: 'left', margin: '16px', borderRadius: '8px' }}
        alignItems='center'
      >
        <Grid item md={3} xs={6} order={{ md: 1, xs: 1 }} marginBottom={mobileFirstRowMarginBottom}>
          <OrderStatusCard id='name-status' heading={t('orderCard.product')} value={product} />
        </Grid>
        <Grid item md={1} xs={3} order={{ md: 2, xs: 5 }}>
          <OrderStatusCard id='quota-status' heading={t('timeTabs.quota')} value={quota} />
        </Grid>
        <Grid item md={1} xs={3} order={{ md: 3, xs: 6 }}>
          <OrderStatusCard id='actualCount-status' heading={t('timeTabs.actualCount')} value={actualCount} />
        </Grid>
        <Grid item md={1} xs={3} order={{ md: 4, xs: 7 }}>
          <OrderStatusCard id='trend-status' heading={t('orderCard.trend')} value={trend === 0 ? undefined : trend} />
        </Grid>
        <Grid item md={1.5} xs={2} order={{ md: 5, xs: 8 }}>
          <OrderStatusCard id='mode-status' heading={t('orderCard.mode')} value={speedMode} />
        </Grid>
        <Grid item md={1.5} xs={3} order={{ md: 5, xs: 2 }} marginBottom={mobileFirstRowMarginBottom}>
          <OrderStatusCard id='attending-shift-status' heading={t('orderCard.attendingShift')} value={attendingShift} />
        </Grid>
        <Grid item md={2} xs={2} order={{ md: 5, xs: 3 }} marginBottom={mobileFirstRowMarginBottom}>
          <OrderStatusCard id='shiftModel-status' heading={t('orderCard.shiftModel')} value={shiftModelName} />
        </Grid>
        {enableConfigurator && (
          <Suspense>
            <Grid item md={1} xs={1} order={{ md: 6, xs: 4 }} style={{ textAlign: 'right' }}>
              <ConfigButton disableButton={!hasActiveConfiguration} onClickConfig={handleClickOpen} />
            </Grid>
          </Suspense>
        )}
      </OrderStatusBarContainer>
      {enableConfigurator && (
        <Suspense>
          <CustomDialog
            open={open}
            fullWidth={true}
            maxWidth='xl'
            onClose={handleCloseCustomDialog}
            title={isResetConfigDialog ? t('configuration.resetConfigShiftTitle') : t('configuration.configShiftTitle')}
          >
            <UpdateConfigDialog
              onClose={handleClose}
              changeDialogTitle={setIsResetConfigDialog}
              resetConfig={isResetConfigDialog}
            />
          </CustomDialog>
        </Suspense>
      )}
    </>
  )
}

export default OrderStatusBar
