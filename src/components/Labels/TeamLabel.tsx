import { Grid, Stack, Typography } from '@mui/material'
import SendIcon from 'components/Icons/SendIcon'

interface TeamLabelProps {
  title: string
  name: string
  isOriginator?: boolean
}

const TeamLabel = ({ title, name, isOriginator }: TeamLabelProps) => {
  return (
    <Stack style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
      <Typography variant='h5' noWrap textOverflow='clip'>
        {title}
      </Typography>
      <Grid container>
        <Grid item style={{ display: 'flex' }}>
          <div style={{ marginRight: '0.5rem', marginTop: '0.2rem' }}>
            <SendIcon width={16} height={16} style={{ transform: isOriginator ? 'rotate(90deg)' : 'rotate(45deg)' }} />
          </div>
          <Typography variant='body1' noWrap textOverflow='clip'>
            {name}
          </Typography>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default TeamLabel
