import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Grid, Stack, Typography } from '@mui/material'
import type { IUnitState } from 'zodSchemas'
import InputForm from './InputForm'

const M100Range = () => {
  const {
    register,
    formState: { errors }
  } = useFormContext<IUnitState>()
  const { t } = useTranslation('admin')
  return (
    <Stack>
      <Typography variant='overline'>{t('unitsSection.m100Title')}</Typography>
      <Grid container gap={4}>
        <Grid item xs={2}>
          <Typography variant='subtitle1'>{t('unitsSection.from')}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant='subtitle1'>{t('unitsSection.to')}</Typography>
        </Grid>
      </Grid>
      <Grid container gap={4} style={{ marginBottom: '1rem' }}>
        <Grid item xs={2}>
          <InputForm
            type='number'
            {...register('m100Range.min', { valueAsNumber: true })}
            style={{ width: '100%' }}
            error={!!errors?.m100Range?.min}
            placeholder={''}
            marginTop='0px'
            id='m100-min'
          />
        </Grid>
        <Grid item xs={2}>
          <InputForm
            type='number'
            {...register('m100Range.max', { valueAsNumber: true })}
            style={{ width: '100%' }}
            error={!!errors?.m100Range?.max}
            placeholder={''}
            marginTop='0px'
            id='m100-max'
          />
        </Grid>
      </Grid>
    </Stack>
  )
}

export default M100Range
