import { Typography } from '@mui/material'
import { colors } from 'theme'

interface DisruptionBadgeProps {
  count: number
}

const DisruptionBadge = ({ count }: DisruptionBadgeProps) => {
  return (
    <div
      style={{
        marginLeft: '0.5rem',
        backgroundColor: colors.redError,
        height: '16px',
        width: '16px',
        borderRadius: '50%',
        display: 'flex'
      }}
    >
      <Typography variant='h5' id='disruption-badge-count' style={{ margin: 'auto', color: colors.white }}>
        {count}
      </Typography>
    </div>
  )
}

export default DisruptionBadge
