import { Outlet } from 'react-router-dom'
import { Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Container } from 'components/styled'
// Error Boundary
import ErrorBoundary from '../Error/ErrorBoundary'
import ErrorFallback from '../Error/ErrorFallback'

const DashBoard = styled(Grid)({
  paddingTop: '1rem',
  width: '100%'
})

const AdminContainer = () => {
  return (
    <Container id='admin-container'>
      <DashBoard container item xs={12} md={12}>
        <Grid container item xs={12} md={12} style={{ width: '100%' }}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Outlet />
          </ErrorBoundary>
        </Grid>
      </DashBoard>
    </Container>
  )
}

export default AdminContainer
