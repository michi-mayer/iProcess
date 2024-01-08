import AdminContainer from 'components/Layouts/AdminContainer'
import MainContainer from 'components/Layouts/MainContainer'
import NavLinkAdminStack from 'components/Navbars/NavLinkAdminStack'
import SideBar from 'components/Navbars/SideBar'

const AdminApp = () => {
  return (
    <MainContainer id='outer-grid-AdminApp' container>
      <SideBar showInformationProvider={false}>
        <NavLinkAdminStack />
      </SideBar>
      <AdminContainer />
    </MainContainer>
  )
}

export default AdminApp
