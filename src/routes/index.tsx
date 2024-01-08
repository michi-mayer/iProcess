import { Outlet } from 'react-router-dom'
import NavLinkStack from 'components/Navbars/NavLinkStack'
import { Container, OutletContainer } from 'components/styled'
import MainHeader from '../components/Header/MainHeader'
import MainContainer from '../components/Layouts/MainContainer'
// Custom Components
import SideBar from '../components/Navbars/SideBar'
import useMediaQuery from '../hooks/useMediaQuery'

const Landing = () => {
  const [isDesktopWidth] = useMediaQuery('lg')

  return (
    <MainContainer id='landing-container' container>
      {isDesktopWidth ? (
        <>
          <SideBar showInformationProvider={true} marginBottomLogo='3rem'>
            <NavLinkStack />
          </SideBar>
          <Container id='landing-container'>
            <OutletContainer item xs={12}>
              <Outlet />
            </OutletContainer>
          </Container>
        </>
      ) : (
        <Container id='landing-container'>
          <MainHeader showMobileNavigation />
          <OutletContainer item xs={12}>
            <Outlet />
          </OutletContainer>
        </Container>
      )}
    </MainContainer>
  )
}

export default Landing
