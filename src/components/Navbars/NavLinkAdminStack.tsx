import { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { Stack, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { ROUTER } from 'routes/routing'
import { DisruptionIcon, ShiftModelIcon } from 'components/Icons/AdminIcons'
import groupingIcon from 'components/Icons/grouping.svg'
import unitIcon from 'components/Icons/unit.svg'
import wrenchIcon from 'components/Icons/wrench.svg'
import { fetchShiftModelList } from 'hooks/services/useQueryListShiftModels'
import NavLink from 'lib/ui/NavLink'
import { colors } from 'theme'
import { NavLinkAuthDivider } from './AuthNavbar'

const iconsStyle: CSSProperties = {
  marginRight: '1rem',
  color: colors.white,
  height: '24px',
  width: '24px'
}

const NavLinkAdminStack = () => {
  const { t } = useTranslation('admin')
  const { pathname } = useLocation()
  const queryClient = useQueryClient()

  return (
    <Stack>
      <NavLinkAuthDivider />
      <NavLink to={ROUTER.ADMIN_UNITS}>
        <img src={unitIcon} style={iconsStyle} loading='lazy' />
        <Typography
          id='sideBar-unitsSection'
          variant='body1'
          style={{ color: colors.white, fontWeight: pathname.includes(ROUTER.ADMIN_UNITS) ? 'bold' : 'normal' }}
        >
          {t('sideBar.unitsSection')}
        </Typography>
      </NavLink>
      <NavLinkAuthDivider />

      <NavLink to={ROUTER.ADMIN_PRODUCTS}>
        <img src={wrenchIcon} style={iconsStyle} loading='lazy' />
        <Typography
          id='sideBar-partsSection'
          variant='body1'
          style={{ color: colors.white, fontWeight: pathname.includes(ROUTER.ADMIN_PRODUCTS) ? 'bold' : 'normal' }}
        >
          {t('sideBar.productsSection')}
        </Typography>
      </NavLink>

      <NavLinkAuthDivider />

      <NavLink to={ROUTER.ADMIN_DISRUPTION_CATEGORIES}>
        <DisruptionIcon style={iconsStyle} />
        <Typography
          id='sideBar-disruptionsSections'
          variant='body1'
          style={{
            color: colors.white,
            fontWeight: pathname.includes(ROUTER.ADMIN_DISRUPTION_CATEGORIES) ? 'bold' : 'normal'
          }}
        >
          {t('sideBar.disruptionsSections')}
        </Typography>
      </NavLink>

      <NavLinkAuthDivider />

      <NavLink to={ROUTER.ADMIN_GROUPINGS}>
        <img src={groupingIcon} style={iconsStyle} loading='lazy' />
        <Typography
          id='sideBar-groupingSection'
          variant='body1'
          style={{ color: colors.white, fontWeight: pathname.includes(ROUTER.ADMIN_GROUPINGS) ? 'bold' : 'normal' }}
        >
          {t('sideBar.groupingSection')}
        </Typography>
      </NavLink>

      <NavLinkAuthDivider />

      <NavLink
        to={ROUTER.ADMIN_SHIFT_MODEL}
        onHover={() => queryClient.prefetchQuery({ queryKey: ['ListShiftModels'], queryFn: fetchShiftModelList })}
      >
        <ShiftModelIcon style={iconsStyle} />
        <Typography
          id='sideBar-shiftModelSection'
          variant='body1'
          style={{ color: colors.white, fontWeight: pathname.includes(ROUTER.ADMIN_SHIFT_MODEL) ? 'bold' : 'normal' }}
        >
          {t('sideBar.shiftModelSection')}
        </Typography>
      </NavLink>
      <NavLinkAuthDivider />
    </Stack>
  )
}

export default NavLinkAdminStack
