import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { Grid, Stack, Typography } from '@mui/material'
import { isAssemblyLine, RenderValue } from 'types'
import { createStartShiftSchema } from 'zodSchemas'
import { AttendingShift, Shift as ShiftAPI } from 'API'
import DashboardContainer from 'components/Dashboard/DashboardContainer'
import ErrorIcon from 'components/Icons/ErrorIcon'
import {
  ExtendedProduct,
  ExtendedShiftModel,
  Shift,
  ShiftTranslator,
  SpeedMode,
  useIProcessDispatch,
  useIProcessState
} from 'contexts/iProcessContext'
import useMutateStartShift, { MutateStartShiftInput } from 'hooks/services/useMutateStartShift'
import useQueryGetPartsByUnit from 'hooks/services/useQueryGetPartsByUnit'
import useCurrentConfiguration from 'hooks/useCurrentConfiguration'
import useDefaultSpeedModes from 'hooks/useDefaultSpeedModes'
import Toast from 'lib/animation/Toast'
import WarningSnackBar from 'lib/animation/WarningSnackBar'
import { GroupUISubmitButton } from 'lib/ui/Buttons'
import { colors } from 'theme'
import ConfigurationInputs from './ConfigurationInputs'
import { isActiveShift } from './utils'

const PastShiftAlert = () => {
  const { t } = useTranslation()
  const { currentShift, selectedShift } = useIProcessState()
  const [show, setShow] = useState(true)

  const isPastShift = Shift[currentShift] !== Shift[selectedShift]
  const showPastShift = isPastShift && show

  useEffect(() => {
    setShow(true)
  }, [selectedShift])

  return (
    <>
      {showPastShift && (
        <Toast
          lineStyle={{ margin: '0px' }}
          borderColor={colors.orange}
          Icon={<ErrorIcon fill={colors.orange} />}
          description={t('configuration.previousShiftBanner')}
          onClose={() => setShow(false)}
        />
      )}
    </>
  )
}

export interface StartShiftForm extends Pick<MutateStartShiftInput, 'shiftTarget'> {
  shiftModel: ExtendedShiftModel
  part: ExtendedProduct
  cycleTime?: SpeedMode
  speedMode?: SpeedMode
  attendingShift: RenderValue<AttendingShift>
}

const StartShift = () => {
  const [showWarning, setShowWarning] = useState(false)

  const dispatch = useIProcessDispatch()
  const { t } = useTranslation('iProcess')
  const {
    unitSelected,
    timeZone,
    previousShiftConfiguration,
    productSelected: partSelected,
    selectedShift
  } = useIProcessState()
  const { defaultAssemblyLineSpeedMode, defaultProductionSpeedMode } = useDefaultSpeedModes()
  const { data: partList } = useQueryGetPartsByUnit()
  const { isPending, mutate } = useMutateStartShift()

  const StartShiftFormSchema = createStartShiftSchema(unitSelected)

  const methods = useForm<Partial<StartShiftForm>>({
    resolver: zodResolver(StartShiftFormSchema),
    defaultValues: {}
  })

  const { handleSubmit, setValue, reset } = methods

  useCurrentConfiguration()

  const onSubmit = ({
    shiftModel,
    part,
    shiftTarget,
    cycleTime,
    speedMode,
    attendingShift
  }: Partial<StartShiftForm>) => {
    mutate({
      timeZone,
      speedMode: speedMode?.value,
      attendingShift: attendingShift?.value,
      cycleTime: cycleTime?.value ?? partList?.[0]?.targetCycleTime,
      shiftTarget: isAssemblyLine(unitSelected) ? shiftTarget : undefined,
      shiftModelId: shiftModel?.id,
      shiftType: ShiftTranslator[selectedShift] as ShiftAPI,
      partId: part?.id ?? partList?.[0]?.id ?? undefined,
      unitId: unitSelected?.id
    })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void dispatch({ type: 'selectedShiftTab', selectedShiftTab: -1 }), [selectedShift])

  useEffect(() => {
    let mounted = true

    if (mounted && unitSelected?.id) {
      const previousShiftConfig = previousShiftConfiguration[unitSelected?.id]
      const shiftModel = unitSelected?.shiftModels?.find((_) => _.id === previousShiftConfig?.shiftModelId)
      const speedMode = unitSelected?.speedModeCollection?.find((_) => _.value === previousShiftConfig?.speedMode)

      if (isActiveShift(shiftModel, ShiftTranslator[selectedShift])) {
        if (isAssemblyLine(unitSelected)) {
          setValue('shiftModel', shiftModel)
          setValue('cycleTime', speedMode ?? defaultAssemblyLineSpeedMode)
        } else {
          const part = partList?.find((_) => _.id === previousShiftConfig?.partId)

          setValue('part', part)
          setValue('shiftModel', shiftModel)
          setValue('speedMode', speedMode ?? defaultProductionSpeedMode)
        }
      }
    }

    return () => {
      mounted = false
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedShift,
    defaultProductionSpeedMode,
    defaultAssemblyLineSpeedMode,
    partList,
    partSelected,
    previousShiftConfiguration,
    unitSelected
  ])

  useEffect(() => {
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitSelected])

  return (
    <FormProvider {...methods}>
      <DashboardContainer mobileHeight='10rem'>
        <PastShiftAlert />
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: 'flex',
            padding: '1.5rem',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%'
          }}
        >
          <Stack>
            <Typography variant='h2'>{t('configuration.startConfigurationTitle')}</Typography>
            <ConfigurationInputs setShowWarning={setShowWarning} />
          </Stack>
          <Grid container item direction='row' alignItems='flex-end' justifyContent='flex-end'>
            <GroupUISubmitButton
              id='startShift-button'
              icon={isPending ? 'icon-empty-24' : 'play-24'}
              isLoading={isPending}
            >
              {t('configuration.startShift')}
            </GroupUISubmitButton>
          </Grid>
        </form>
        <WarningSnackBar message={t('configuration.warningMultipleProducts')} showWarning={showWarning} />
        <WarningSnackBar message={t('configuration.warningNoProductsAttached')} showWarning={partList?.length === 0} />
      </DashboardContainer>
    </FormProvider>
  )
}

export default StartShift
