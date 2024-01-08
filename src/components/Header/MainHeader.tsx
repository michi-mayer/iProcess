import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid } from '@mui/material'
import { ROUTER } from 'routes/routing'
import SideBarDialog from 'components/Dialogs/SideBarDialog'
import IProcessLogo from 'components/Navbars/IProcessLogo'
import useDialogHandler from 'hooks/useDialogHandler'
import useMediaQuery from 'hooks/useMediaQuery'
import { colors } from 'theme'
import { HeaderUserDetails } from './HeaderUserDetails'

interface Props {
  navigateTo?: string
  showMobileNavigation?: boolean
}

const MainHeader: FC<Props> = ({ showMobileNavigation, navigateTo = ROUTER.LANDING }) => {
  const { open, handleClickOpen, handleClose } = useDialogHandler()
  const [isDesktopWidth] = useMediaQuery('lg')
  const navigate = useNavigate()

  const handleClick = () => {
    if (showMobileNavigation && !isDesktopWidth) {
      handleClickOpen()
    }
    navigate(navigateTo)
  }

  return (
    <Grid
      item
      container
      xs={12}
      style={{
        height: '4rem',
        padding: '0 1rem',
        backgroundColor: colors.darkBlue
      }}
    >
      <Grid item xs={4}>
        <Grid
          item
          xs={12}
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <IProcessLogo onLogoClick={handleClick} />
        </Grid>
      </Grid>
      <Grid item xs={8} style={{ display: 'flex', justifyContent: 'end' }}>
        <HeaderUserDetails color={colors.white} />
      </Grid>
      <SideBarDialog open={open} onClose={handleClose} />
    </Grid>
  )
}

export default MainHeader
