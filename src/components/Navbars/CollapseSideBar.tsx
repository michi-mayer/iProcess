import { PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Collapse, IconButton, Stack } from '@mui/material'
import { ROUTER } from 'routes/routing'
import BurgerIcon from 'components/Icons/BurgerIcon'
import { useStoreSideBar } from 'contexts/sidebarStore'
import { colors } from 'theme'
import AuthNavbar from './AuthNavbar'
import IProcessLogo from './IProcessLogo'

const CollapseSideBar = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate()
  const [{ isCollapsed, hasUnitSelected, showScrollDown, showScrollUp }, setStore] = useStoreSideBar((_) => _)

  return (
    <Collapse
      orientation='horizontal'
      in={!isCollapsed}
      collapsedSize='64px'
      style={{
        height: '100vh',
        width: isCollapsed ? '64px' : '238px'
      }}
    >
      <div
        id='sideBar'
        style={{
          width: isCollapsed ? '64px' : '238px',
          height: '100vh',
          backgroundColor: colors.darkBlue,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingBottom: '25px',
          paddingTop: '25px'
        }}
      >
        <Stack>
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '11px'
            }}
          >
            {hasUnitSelected && (
              <IconButton onClick={() => setStore({ isCollapsed: !isCollapsed })}>
                <BurgerIcon />
              </IconButton>
            )}
            {!isCollapsed && (
              <IProcessLogo showLogo={!isCollapsed && !hasUnitSelected} onLogoClick={() => navigate(ROUTER.LANDING)} />
            )}
          </Box>
          {children}
        </Stack>
        <AuthNavbar isCollapsed={isCollapsed} showScrollDown={showScrollDown} showScrollUp={showScrollUp} />
      </div>
    </Collapse>
  )
}

export default CollapseSideBar
