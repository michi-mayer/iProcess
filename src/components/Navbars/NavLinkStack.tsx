import { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { ListItemButton } from '@mui/material'
import { ROUTER } from 'routes/routing'
import ChangeLogIcon from 'components/Icons/ChangeLogIcon'
import DataPrivacyIcon from 'components/Icons/DataPrivacyIcon'
import FeedbackIcon from 'components/Icons/FeedbackIcon'
import OverviewIcon from 'components/Icons/OverviewIcon'
import NavLink from 'lib/ui/NavLink'
import { colors, theme } from 'theme'

export const iconsStyle: CSSProperties = {
  marginRight: '1rem'
}

const NavLinkStack = ({ onClick }: { onClick?: () => void }) => {
  const { t } = useTranslation('landing')

  return (
    <div style={{ height: '16rem' }} onClick={onClick}>
      <NavLink to={ROUTER.LANDING}>
        <OverviewIcon style={iconsStyle} />
        {t('sidebar.overview')}
      </NavLink>
      <a
        href={`mailto:${process.env.VITE_ADMIN_EMAIL}`}
        target='_blank'
        rel='noreferrer'
        style={{ color: colors.white, textDecoration: 'none' }}
      >
        <ListItemButton
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            fontFamily: theme.typography.fontFamily,
            fontSize: '1.125rem',
            height: '48px',
            paddingRight: '1.5rem',
            paddingLeft: '18px'
          }}
        >
          <FeedbackIcon style={{ ...iconsStyle }} />
          {t('sidebar.feedback')}
        </ListItemButton>
      </a>
      {/* // * This link is disabled until there is any actual route to access it. Remove {pointerEvents: 'none'} to enable it */}
      <NavLink to={ROUTER.LANDING_DATA_PRIVACY} style={{ pointerEvents: 'none' }}>
        <DataPrivacyIcon style={iconsStyle} />
        {t('sidebar.dataPrivacy')}
      </NavLink>
      <NavLink to={ROUTER.LANDING_CHANGE_LOG}>
        <ChangeLogIcon style={iconsStyle} />
        {t('sidebar.changelog')}
      </NavLink>
    </div>
  )
}

export default NavLinkStack
