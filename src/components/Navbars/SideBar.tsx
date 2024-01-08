import { FC, PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid } from '@mui/material'
import { ROUTER } from 'routes/routing'
import { CSSUnitSize } from 'types'
import { colors } from 'theme'
import AuthNavbar from './AuthNavbar'
import InformationProvider from './InformationProvider'
import IProcessLogo from './IProcessLogo'

interface Props {
  showInformationProvider?: boolean
  marginBottomLogo?: CSSUnitSize
}

const SideBar: FC<PropsWithChildren<Props>> = ({ children, marginBottomLogo = '0rem', showInformationProvider }) => {
  const navigate = useNavigate()

  return (
    <div
      id='sideBar'
      style={{
        width: '238px',
        backgroundColor: colors.darkBlue,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: '25px'
      }}
    >
      <Grid item md={12}>
        <Grid
          item
          xs={12}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: marginBottomLogo,
            marginTop: '1.625rem',
            marginLeft: '1rem'
          }}
        >
          <IProcessLogo onLogoClick={() => navigate(ROUTER.LANDING)} />
        </Grid>
        {children}
      </Grid>

      {showInformationProvider ? (
        <InformationProvider />
      ) : (
        <div style={{ marginBottom: '1rem', paddingLeft: '24px' }} />
      )}
      <AuthNavbar />
    </div>
  )
}

export default SideBar
