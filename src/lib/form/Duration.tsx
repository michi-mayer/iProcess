import { memo, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import DoneIcon from '@mui/icons-material/Done'
import { Chip, Grid, TextField, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import moment from 'moment-timezone'
import { IDisruptionFormState } from 'components/Dialogs/DisruptionDialogs/DisruptionDialog'
import { localTimeFormat } from 'helper/time'
import { colors } from 'theme'

const disruptionDurationPreSelect = [
  { id: 0, durationInMinutes: 1 },
  { id: 1, durationInMinutes: 5 },
  { id: 2, durationInMinutes: 10 },
  { id: 3, durationInMinutes: 15 }
]

interface DoneIconSelectedProps {
  selected: boolean
}

const DoneIconSelected = ({ selected }: DoneIconSelectedProps) => {
  if (selected) return <DoneIcon id='duration-chip-selected' style={{ marginLeft: '8px' }} />
  return <div />
}

const DurationChipsStyled = styled(Chip)({
  borderColor: colors.blue,
  margin: '8px',
  '& .MuiChip-label': {
    fontSize: '16px',
    padding: '4px 8px'
  }
})

// Disruption Duration
const DurationTextInputFieldStyled = styled(TextField)({
  width: '120px',
  '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
    borderColor: colors.redError
  }
})

interface DisruptionDurationPreSelect {
  id: number
  durationInMinutes: number
}

const Duration = () => {
  const {
    register,
    setValue,
    formState: { errors },
    watch
  } = useFormContext<IDisruptionFormState>()
  const { t } = useTranslation('iProcess')

  const durationMin = watch('durationInMinutes')
  const duration = watch('duration')
  const durationFormated = moment.duration(duration).asMinutes()

  const handleClick = (duration: DisruptionDurationPreSelect) => () => {
    setValue('durationInMinutes', duration.durationInMinutes)
    const durationInMinutesFormated = moment(duration.durationInMinutes, 'mm').format(localTimeFormat)
    setValue('duration', durationInMinutesFormated, {
      shouldValidate: true
    })
  }

  useEffect(() => {
    setValue('durationInMinutes', durationFormated)
  }, [durationFormated, setValue])

  return (
    <Grid container>
      <Grid item xs={4}>
        <Typography variant='caption'>{t('disruptionDialog.leftDurationAlternative')}</Typography>
        <div style={{ display: 'flex', marginTop: '8px' }}>
          <DurationTextInputFieldStyled
            type='time'
            error={!!errors.duration}
            id='duration-text-input'
            variant='outlined'
            inputProps={{
              step: '1',
              style: { padding: '0.4375rem 0.6875rem' }
            }}
            {...register('duration')}
          />
        </div>
      </Grid>
      <Grid item xs={6}>
        <Typography variant='caption'>{t('disruptionDialog.leftDuration')}</Typography>
        <div style={{ padding: 0, display: 'flex' }}>
          {disruptionDurationPreSelect.map((duration) => {
            const Duration = duration.durationInMinutes
            const selected = duration.durationInMinutes === durationMin
            return (
              <DurationChipsStyled
                key={duration.id}
                id='duration-chip'
                variant='outlined'
                label={`${Duration} Min.`}
                onClick={handleClick(duration)}
                icon={<DoneIconSelected selected={selected} />}
              />
            )
          })}
        </div>
      </Grid>
      {!!errors.duration && (
        <Typography
          id='duration-text-input-helper-text'
          variant='subtitle2'
          style={{ paddingLeft: '12px', paddingTop: '4px' }}
        >
          {t('disruptionDialog.disruptionDurationInMinutesMissing')}
        </Typography>
      )}
    </Grid>
  )
}

export default memo(Duration)
