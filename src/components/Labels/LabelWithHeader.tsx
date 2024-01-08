import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { WithGridSize } from 'types'

interface LabelWithHeaderProps extends WithGridSize {
  title: string
  content: string
}

const LabelWithHeader = ({ title, content, xs }: LabelWithHeaderProps) => (
  <Grid item xs={xs} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
    <Typography variant='h5' textOverflow='clip'>
      {title}
    </Typography>
    <Typography variant='body1' textOverflow='clip' style={{ wordBreak: 'break-word' }}>
      {content}
    </Typography>
  </Grid>
)

export default LabelWithHeader
