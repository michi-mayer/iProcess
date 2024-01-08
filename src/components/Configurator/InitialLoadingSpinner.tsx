// Custom Components
import { CircularProgress } from '@mui/material'
import DashboardContainer from '../Dashboard/DashboardContainer'

const InitialLoadingSpinner = () => {
  return (
    <DashboardContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress color='primary' size={100} thickness={1} variant='indeterminate' />
    </DashboardContainer>
  )
}

export default InitialLoadingSpinner
