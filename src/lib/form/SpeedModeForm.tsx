import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import DeleteIcon from '@mui/icons-material/Delete'
import { Grid, IconButton, Stack, Typography } from '@mui/material'
import { v4 as uuid } from 'uuid'
import type { IUnitState } from 'zodSchemas'
import { UnitType } from 'API'
import { AddButton } from 'lib/ui/Buttons'
import { colors } from 'theme'
import InputForm from './InputForm'

const newSpeedMode = {
  id: uuid(),
  name: '',
  value: undefined
}

const SpeedModeForm = () => {
  const { t } = useTranslation('admin')
  const {
    watch,
    register,
    formState: { errors },
    clearErrors,
    trigger
  } = useFormContext<IUnitState>()

  const {
    fields: speedModeCollection,
    append,
    remove
  } = useFieldArray({
    name: 'speedModeCollection'
  })

  const handleAddSpeedMode = () => {
    const lastItemHasEmptyName = watch('speedModeCollection').slice(-1)[0]?.name === ''
    if (lastItemHasEmptyName) {
      trigger('speedModeCollection')
    } else {
      append(newSpeedMode)
    }
  }

  const handleDeleteSpeedMode = (speedModeIndex: number) => {
    remove(speedModeIndex)
  }

  return (
    <Stack>
      <Typography variant='overline' style={{ marginTop: '1rem' }}>
        {t('unitsSection.unitMode')}
      </Typography>
      {speedModeCollection && speedModeCollection?.length > 0 && (
        <Grid container gap={1}>
          <Grid item xs={2}>
            <Typography variant='subtitle1'>{t('unitsSection.name')}</Typography>
          </Grid>
          <Grid item xs={2} style={{ paddingLeft: '1.5rem' }}>
            <Typography variant='subtitle1'>
              {watch('type') === UnitType.assemblyLine ? t('unitsSection.cycleTime') : t('unitsSection.factor')}
            </Typography>
          </Grid>
        </Grid>
      )}
      <Stack style={{ marginBottom: speedModeCollection?.length > 0 ? '0.5rem' : 0 }}>
        {speedModeCollection?.map((speedMode, index) => {
          return (
            <Grid container key={speedMode.id} gap={4} style={{ marginBottom: '0.5rem' }}>
              <Grid item xs={2}>
                <InputForm
                  {...register(`speedModeCollection.${index}.name` as const, {
                    onChange: () => clearErrors(`speedModeCollection.${index}.name`)
                  })}
                  style={{ width: '100%' }}
                  error={!!errors.speedModeCollection?.[index]?.name}
                  placeholder={
                    watch('type') === UnitType.assemblyLine
                      ? t('unitsSection.assemblyLinePlaceholder')
                      : t('unitsSection.productionUnitPlaceholder')
                  }
                  marginTop='0px'
                  id='speedMode-description'
                />
              </Grid>
              <Grid item xs={2}>
                <InputForm
                  type='number'
                  {...register(`speedModeCollection.${index}.value` as const, {
                    valueAsNumber: true,
                    onChange: () => clearErrors(`speedModeCollection.${index}.value`)
                  })}
                  style={{ width: '100%' }}
                  error={!!errors.speedModeCollection?.[index]?.value}
                  placeholder={
                    watch('type') === UnitType.assemblyLine
                      ? t('unitsSection.cycleTimePlaceholder')
                      : t('unitsSection.factorPlaceholder')
                  }
                  marginTop='0px'
                  id='speedMode-value'
                />
              </Grid>
              <Grid item alignItems='center' style={{ position: 'relative' }}>
                <IconButton
                  size='large'
                  onClick={() => handleDeleteSpeedMode(index)}
                  style={{ position: 'absolute', right: -28, top: -2 }}
                >
                  <DeleteIcon color='primary' />
                </IconButton>
              </Grid>
            </Grid>
          )
        })}
        {errors.speedModeCollection ? (
          <Typography variant='caption' style={{ color: colors.redError, fontSize: 12 }} id='select-unit-errorMessage'>
            {t('unitsSection.unitModeErrorMessage')}
          </Typography>
        ) : undefined}
      </Stack>
      <Grid item xs={12}>
        <AddButton
          onClick={handleAddSpeedMode}
          text={t('unitsSection.addNewSpeedMode')}
          id='add-new-speed-mode'
          style={{ margin: speedModeCollection?.length > 0 ? '0.5rem 0 1rem 0' : '0 0 1rem 0' }}
        />
      </Grid>
    </Stack>
  )
}

export default SpeedModeForm
