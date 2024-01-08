import { FC, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid, Stack, Typography } from '@mui/material'
import moment from 'moment-timezone'
import { TemplateDashboard } from 'types'
import Chip from 'components/Chips/Chip'
import { UNIT_SPECIFIC_CYCLE_STATION } from 'shared/constants'

interface Props {
  templateState: TemplateDashboard | undefined
}

const DisruptionDetails: FC<PropsWithChildren<Props>> = ({ children, templateState }) => {
  const { t } = useTranslation(['iProcess', 'measures'])
  return (
    <Stack spacing={2} style={{ marginTop: '1rem' }}>
      <Grid container>
        <Grid item xs={5}>
          <Typography variant='h5'>{t('measures:disruptionDetails.disruption')}</Typography>
          <Typography variant='body2'>{templateState?.description}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant='h5'>{t('measures:disruptionDetails.product')}</Typography>
          <Typography variant='body2'>{templateState?.productNumber}</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography variant='h5'>{t('measures:disruptionDetails.unit')}</Typography>
          <Typography variant='body2'>{templateState?.unitShortName}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h5'>{t('measures:disruptionDetails.cycleStation')}</Typography>
          <Typography variant='body2'>
            {UNIT_SPECIFIC_CYCLE_STATION.name === templateState?.cycleStationName
              ? t('iProcess:disruptionDialog.defaultCycleStationName')
              : templateState?.cycleStationName}
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={5}>
          <Typography variant='h5'>{t('measures:disruptionDetails.dateOfFirstOccurrence')}</Typography>
          <Typography variant='body2'>{moment(templateState?.firstOccurrence).format('DD.MM.YY')}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant='h5'>{t('measures:disruptionDetails.duration')}</Typography>
          <Typography variant='body2'>{`${templateState?.totalDuration} h`}</Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography variant='h5'>{t('measures:disruptionDetails.classification')}</Typography>
          {templateState?.classifications.map((classification, index) => {
            return <Chip doneIcon key={index} label={classification} selected={true} iconPosition='right' />
          })}
        </Grid>
      </Grid>
      <Stack style={{ marginBottom: '1rem' }}>{children}</Stack>
    </Stack>
  )
}

export default DisruptionDetails
