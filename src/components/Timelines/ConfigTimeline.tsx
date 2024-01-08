// MUI
// Hooks
import { useTranslation } from 'react-i18next'
import { TimelineOppositeContent } from '@mui/lab'
import Timeline from '@mui/lab/Timeline'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { FieldArrayConfig } from '../Configurator/UpdateConfigDialog'

export const TimeLineDotCustom = styled(TimelineDot)({
  fontSize: 12,
  height: 15,
  width: 15,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
})

interface Props {
  configurations: FieldArrayConfig[]
}

const ConfigTimeline = ({ configurations }: Props) => {
  const { t } = useTranslation()

  return (
    <Grid container item xs={0} lg={2} boxSizing='border-box' style={{ height: '100%' }}>
      <Timeline style={{ padding: 0, margin: 0 }}>
        <Typography variant='h5' textAlign='center' style={{ zIndex: 1000, marginBottom: '-27px', marginTop: '10px' }}>
          {t('configuration.timeLineTitle')}
        </Typography>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot style={{ backgroundColor: 'white', boxShadow: 'none' }} />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent />
        </TimelineItem>
        {configurations.map((configuration, index) => {
          return (
            <TimelineItem key={configuration.id}>
              <TimelineOppositeContent>
                <Typography
                  variant='caption'
                  style={{
                    wordBreak: 'break-word'
                  }}
                >
                  {index === 0 ? t('configuration.startShiftTimeline') : t('configuration.changeShiftTimeline')}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimeLineDotCustom color='primary'>{index + 1}</TimeLineDotCustom>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant='caption'>{configuration?.validFrom}</Typography>
              </TimelineContent>
            </TimelineItem>
          )
        })}
        <TimelineItem>
          <TimelineOppositeContent>
            <Typography
              variant='caption'
              style={{
                wordBreak: 'break-word'
              }}
            >
              {t('configuration.endShiftTimeline')}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimeLineDotCustom color='grey'></TimeLineDotCustom>
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant='caption'>{configurations[configurations.length - 1]?.validUntil}</Typography>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Grid>
  )
}

export default ConfigTimeline
