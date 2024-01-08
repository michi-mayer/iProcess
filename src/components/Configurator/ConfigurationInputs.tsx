import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'
import { isAssemblyLine } from 'types'
import { isSpeedMode } from 'zodSchemas'
import { Type } from 'API'
import { ExtendedProduct, Shift, SpeedMode, useIProcessState } from 'contexts/iProcessContext'
import useQueryGetPartsByUnit from 'hooks/services/useQueryGetPartsByUnit'
import useAttendingShifts from 'hooks/useAttendingShifts'
import useDefaultSpeedModes from 'hooks/useDefaultSpeedModes'
import useMediaQuery from 'hooks/useMediaQuery'
import SelectDropDown from 'lib/form/SelectDropDown'
import OutputTextField from './OutputTextField'
import { StartShiftForm } from './StartShift'

interface ConfigurationInputsProps {
  setShowWarning: Dispatch<SetStateAction<boolean>>
}

const getProductValue = (_: ExtendedProduct | undefined) => {
  if (_) {
    return `${_.partNumber} (${_.name})`
  }
  return undefined
}

const ConfigurationInputs = ({ setShowWarning }: ConfigurationInputsProps) => {
  const [speedModeCollection, setSpeedModeCollection] = useState<SpeedMode[]>()
  const { t } = useTranslation()
  const [isDesktopWidth] = useMediaQuery('lg')
  const { unitSelected, selectedShift } = useIProcessState()
  const { data: partList } = useQueryGetPartsByUnit()
  const { defaultItem } = useDefaultSpeedModes()
  const attendingShifts = useAttendingShifts()

  const {
    formState: { errors },
    setValue,
    watch,
    register
  } = useFormContext<Partial<StartShiftForm>>()

  const part = watch('part')
  const cycleTime = watch('cycleTime')
  const speedMode = watch('speedMode')
  const shiftModel = watch('shiftModel')
  const attendingShift = watch('attendingShift')

  const xs = isDesktopWidth ? 4 : 6

  const getActiveShiftModels = useCallback(
    () =>
      unitSelected?.shiftModels?.filter(
        ({ scheduleHours }) =>
          !scheduleHours.some((_) => _.shiftType && Shift[_.shiftType] === selectedShift && _.type === Type.Inactive)
      ),
    [selectedShift, unitSelected?.shiftModels]
  )

  /**
   * From the Admin app, we store under speedModes attribute the factor OR cycleTime depending whether
   * it is an Assembly Line or a Product Unit, so this is why we need make the difference between each unit Type
   *
   * speedMode = factor
   * cycleTime = cycleTime
   */
  const setUnitFactor = (_: unknown) => {
    if (isSpeedMode(_)) {
      if (isAssemblyLine(unitSelected)) {
        setValue('cycleTime', _, { shouldValidate: true })
      } else {
        setValue('speedMode', _, { shouldValidate: true })
      }
    }
  }

  useEffect(() => {
    if (isAssemblyLine(unitSelected) && partList?.length && partList?.length > 1) {
      setShowWarning?.(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partList?.length, unitSelected?.type])

  useEffect(() => {
    if (unitSelected?.speedModeCollection) {
      setSpeedModeCollection([defaultItem, ...unitSelected?.speedModeCollection])
    }
  }, [defaultItem, unitSelected?.speedModeCollection])

  return (
    <>
      <Grid container spacing={4} style={{ marginTop: '0.5rem' }}>
        <Grid item xs={xs}>
          <SelectDropDown
            name='shiftModel'
            id='configuration-shift-dropdown'
            title={t('configuration.shiftModelTitle')}
            style={{ marginTop: '0.5rem' }}
            itemCollection={getActiveShiftModels()}
            error={!!errors?.shiftModel}
            errorMessage={t('configuration.errorMessage')}
            renderName={(_) => _.name}
            onClick={(_) => setValue('shiftModel', _, { shouldValidate: true })}
            value={shiftModel?.name}
          />
        </Grid>
        <Grid item xs={xs}>
          <SelectDropDown
            name='attendingShift'
            id='configuration-attending-shift-dropdown'
            title={t('configuration.attendingShiftModelTitle')}
            style={{ marginTop: '0.5rem' }}
            itemCollection={attendingShifts}
            error={!!errors?.attendingShift}
            errorMessage={t('configuration.errorMessage')}
            renderName={(_) => _.name}
            onClick={(_) => setValue('attendingShift', _, { shouldValidate: true })}
            value={attendingShift?.name}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4} style={{ paddingTop: '1rem' }}>
        <Grid item xs={xs}>
          <SelectDropDown
            id='configuration-speedMode-dropdown'
            title={t('configuration.speedModeTitle')}
            itemCollection={speedModeCollection}
            renderName={(_) => _.name}
            defaultItem={defaultItem}
            style={{ marginTop: '0.5rem' }}
            onClick={setUnitFactor}
            error={isAssemblyLine(unitSelected) ? !!errors.cycleTime : !!errors.speedMode}
            errorMessage={t('configuration.errorMessage')}
            value={isAssemblyLine(unitSelected) ? cycleTime?.name : speedMode?.name}
          />
        </Grid>
        <Grid item xs={xs}>
          {isAssemblyLine(unitSelected) ? (
            <OutputTextField
              cycleTime={cycleTime}
              marginTop='0.5rem'
              title={t('configuration.outputTitle')}
              error={!!errors?.shiftTarget}
              disabled={!!cycleTime && cycleTime.name !== t('configuration.notApplicable')}
              shiftModelSelected={shiftModel}
              onCalculatedOutput={(_) => setValue('shiftTarget', _, { shouldValidate: true })}
              {...register('shiftTarget', { valueAsNumber: true })}
            />
          ) : (
            <SelectDropDown
              id='configuration-part-dropdown'
              name='part'
              title={t('configuration.productTitle')}
              style={{ marginTop: '0.5rem' }}
              itemCollection={partList}
              error={!!errors?.part}
              errorMessage={t('configuration.errorMessage')}
              renderName={(_) => `${_.partNumber} (${_.name})`}
              onClick={(_) => setValue('part', _, { shouldValidate: true })}
              value={getProductValue(part)}
            />
          )}
        </Grid>
      </Grid>
    </>
  )
}

export default ConfigurationInputs
