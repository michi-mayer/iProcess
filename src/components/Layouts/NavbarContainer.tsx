import { FC, ReactNode, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import MainContainer from 'components/Layouts/MainContainer'
import CollapseSideBar from 'components/Navbars/CollapseSideBar'
import { Container } from 'components/styled'
import { useStoreSideBar } from 'contexts/sidebarStore'
import useMediaQuery from 'hooks/useMediaQuery'
import type { Nullable } from 'shared/types'
import { colors } from 'theme'

interface NavbarContainerProps {
  id: string
  navbarId: string
  renderNavbar: () => ReactNode
  children: ReactNode
  unitId: Nullable<string>
}

const WhiteScreen = styled('div')({
  position: 'absolute',
  zIndex: 999,
  height: '100vh',
  width: '100vw',
  backgroundColor: colors.white,
  opacity: 0.5
})

const NavbarContainer: FC<NavbarContainerProps> = ({ id, navbarId, renderNavbar, children, unitId }) => {
  const [isDesktopWidth] = useMediaQuery('lg')
  const [{ isCollapsed, hasUnitSelected }, setStore] = useStoreSideBar((_) => _)

  useEffect(() => {
    setStore({ hasUnitSelected: !!unitId, showGroupings: !unitId })
  }, [setStore, unitId])

  return (
    <>
      {!isDesktopWidth && (
        <>
          <div id={navbarId} style={{ position: 'absolute', zIndex: 1000 }}>
            <CollapseSideBar>{renderNavbar()}</CollapseSideBar>
          </div>
          {!isCollapsed && (
            // * This creates the white screen and covers any chance of clicking on the app.
            // * Once we click on that div, the sidebar will collapse
            <WhiteScreen onClick={hasUnitSelected ? () => setStore({ isCollapsed: true }) : undefined} />
          )}
        </>
      )}
      <MainContainer id={id} container>
        {isDesktopWidth ? <CollapseSideBar>{renderNavbar()}</CollapseSideBar> : <div style={{ width: '64px' }} />}
        <Container id={`${id}-container`}>{children}</Container>
      </MainContainer>
    </>
  )
}

export default NavbarContainer
