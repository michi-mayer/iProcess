import { useTranslation } from 'react-i18next'
import { Box, Typography } from '@mui/material'
import DowntimeIcon from 'components/Icons/DowntimeIcon'
import { colors } from 'theme'

interface DowntimeProps {
  downtime: string | undefined | null
  width: number | undefined
}

const DownTimeVariant = ({ width, downtime }: DowntimeProps) => {
  const { t } = useTranslation('iProcess')
  switch (true) {
    case width && width > 130 && width < 145:
      return (
        <>
          <DowntimeIcon />
          <Typography variant='caption' color={colors.gray1} margin='0 0 0 4px' id='downtime-text'>
            {t('timeTabs.shortDowntime')}
          </Typography>
          <Typography variant='caption' color={colors.gray1} id='downtime-duration' style={{ marginLeft: '4px' }}>
            {downtime}
          </Typography>
        </>
      )

    case width && width <= 130:
      return (
        <>
          <DowntimeIcon />
          <Typography variant='caption' color={colors.gray1} id='downtime-duration' style={{ marginLeft: '4px' }}>
            {downtime}
          </Typography>
        </>
      )
    case width && width >= 145:
      return (
        <>
          <DowntimeIcon />
          <Typography variant='caption' color={colors.gray1} margin='0 0 0 4px' id='downtime-text'>
            {t('timeTabs.downtime')}
          </Typography>
          <Typography variant='caption' color={colors.gray1} id='downtime-duration' style={{ marginLeft: '4px' }}>
            {downtime}
          </Typography>
        </>
      )

    default:
      return <></>
  }
}

const Downtime = ({ downtime, width }: DowntimeProps) => {
  return (
    <Box height='1rem' width='100%' marginBottom='4px'>
      {downtime ? (
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.gray5
          }}
        >
          <DownTimeVariant width={width} downtime={downtime} />
        </div>
      ) : undefined}
    </Box>
  )
}

export default Downtime
