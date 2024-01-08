import { Grid, Typography } from '@mui/material'
import { useAuth } from '../contexts/authContext'
import { truncateText } from '../helper/truncateText'

export const UserInfo = () => {
  const { authInfo } = useAuth()
  return (
    <Grid
      container
      item
      direction='column'
      alignItems='flex-start'
      style={{
        margin: '8px',
        marginRight: '20px',
        marginBottom: '0px',
        paddingTop: '10px',
        paddingLeft: '5px',
        minWidth: '200px'
      }}
    >
      <Typography variant='body2'>{truncateText({ maxTextLength: 25, text: authInfo?.userName })}</Typography>
    </Grid>
  )
}
