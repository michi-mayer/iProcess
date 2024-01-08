import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Breadcrumbs, Grid, Link, Typography } from '@mui/material'
import { dashboards, ROUTER } from 'routes/routing'
import ApplicationCard from 'components/Cards/ApplicationCard'
import LandingContainer from 'components/Layouts/LandingContainer'
import MainContainer from 'components/Layouts/MainContainer'
import NavLinkStack from 'components/Navbars/NavLinkStack'
import SideBar from 'components/Navbars/SideBar'
import { Container, OutletContainer } from 'components/styled'
import { colors } from 'theme'

const Overview = () => {
  const { t } = useTranslation(['dashboard', 'landing'])

  return (
    <LandingContainer>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize='small' color='primary' />}
        style={{ paddingBottom: '0.5rem' }}
      >
        <Link component={RouterLink} to={ROUTER.LANDING} underline='hover'>
          <Typography variant='body1' color={colors.blue}>
            {t('landing:sidebar.overview')}
          </Typography>
        </Link>
        <Typography variant='body1' color={colors.disabled}>
          {t('landing:applications.dashboard')}
        </Typography>
      </Breadcrumbs>
      <Typography variant='h1' fontSize='2rem' marginBottom='2rem'>
        {t('dashboard:panel.header')}
      </Typography>
      <Typography variant='h2' marginBottom='1rem'>
        {t('dashboard:panel.options')}
      </Typography>
      <Grid container item xs={12} spacing={2} style={{ marginBottom: '3rem' }}>
        {dashboards.map((application) => (
          <Grid
            item
            xs={6}
            sm={4}
            md={3}
            lg={2.4}
            key={`application-${application.path}`}
            id={`application-card-${application.title}`}
          >
            <ApplicationCard application={application} />
          </Grid>
        ))}
      </Grid>
    </LandingContainer>
  )
}

const DashboardApp = () => {
  return (
    <MainContainer id='dashboard-container' container>
      <SideBar showInformationProvider marginBottomLogo='3rem'>
        <NavLinkStack />
      </SideBar>
      <Container id='landing-container'>
        <OutletContainer item xs={12}>
          <Overview />
        </OutletContainer>
      </Container>
    </MainContainer>
  )
}

export default DashboardApp
