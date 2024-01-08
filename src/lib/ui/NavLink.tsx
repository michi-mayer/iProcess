import { CSSProperties, FC, forwardRef, ReactNode } from 'react'
// React Router
import { NavLink as NavLinkBase, NavLinkProps } from 'react-router-dom'
import { ListItemButton } from '@mui/material'
import { Route } from 'routes/routing'
// Theme
import { colors, theme } from 'theme'

const selectionLine = '2px'

const RouterNavLink = forwardRef<HTMLAnchorElement, NavLinkProps>((props, ref) => (
  <NavLinkBase
    ref={ref}
    {...props}
    style={{
      ...props.style,
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      color: colors.white
    }}
  />
))
RouterNavLink.displayName = 'RouterNavLink'

interface Props {
  children: ReactNode[] | ReactNode
  to: Route | string
  style?: CSSProperties
  onHover?: () => void
}

const NavLink: FC<Props> = ({ children, to, style, onHover }) => {
  return (
    <ListItemButton
      component={RouterNavLink}
      onMouseEnter={onHover}
      onMouseOver={onHover}
      to={to}
      sx={{
        fontSize: '1rem',
        fontFamily: theme.typography.fontFamily,
        color: colors.white,
        letterSpacing: '0.2px',
        width: '100%',
        minHeight: '48px',
        alignItems: 'center',
        paddingLeft: '18px',
        ...style,
        '&.active': {
          paddingLeft: '16px',
          borderLeft: `${selectionLine} solid ${colors.white}`,
          fontWeight: 'bold'
        }
      }}
    >
      {children}
    </ListItemButton>
  )
}

export default NavLink
