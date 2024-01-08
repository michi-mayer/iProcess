import { Typography } from '@mui/material'
import { useIProcessState } from 'contexts/iProcessContext'
import useCurrentTime from 'hooks/useCurrentTime'

const CurrentTime = () => {
  const currentTimeString = useCurrentTime()
  return (
    <Typography variant='body1' style={{ fontWeight: 'bold', padding: '10px' }}>
      {currentTimeString}
    </Typography>
  )
}

export const ShiftInfo = () => {
  const { currentDate } = useIProcessState()

  return (
    <div data-testid='shift-info' style={{ display: 'flex', marginLeft: 'auto', order: 1 }}>
      <CurrentTime />
      <Typography variant='body1' style={{ padding: '10px' }}>
        {'|'}
      </Typography>
      <Typography variant='body1' style={{ padding: '10px' }}>
        {`${currentDate}`}
      </Typography>
    </div>
  )
}
