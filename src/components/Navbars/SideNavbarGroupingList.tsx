import { useTranslation } from 'react-i18next'
import { List, ListItemButton, Typography } from '@mui/material'
import { ExtendedGrouping } from 'contexts/iProcessContext'
import type { GroupingList } from 'hooks/useSideNavbar'
import { colors, theme } from 'theme'
import { NavLinkAuthDivider } from './AuthNavbar'

interface SideNavbarGroupingListingProps {
  groupings: GroupingList
  handleSelectGrouping: (grouping: ExtendedGrouping) => void
  handlePrefetchGroupingData?: (_: string | undefined) => void
}

const SideNavbarGroupingList = ({
  groupings,
  handleSelectGrouping,
  handlePrefetchGroupingData
}: SideNavbarGroupingListingProps) => {
  const { t } = useTranslation('iProcess')

  return (
    <div data-testid='side-navbar-grouping-list'>
      <Typography variant='h5' color='white' style={{ margin: '1rem 2rem', boxSizing: 'border-box' }}>
        {t('header.grouping')}
      </Typography>
      <List style={{ padding: 0, paddingTop: '2.5px' }}>
        <NavLinkAuthDivider />
        {groupings?.items?.map((grouping) => {
          return (
            <div key={grouping.id}>
              <ListItemButton
                id={`select-grouping-${grouping.name}`}
                onClick={() => handleSelectGrouping(grouping)}
                onMouseEnter={handlePrefetchGroupingData ? () => handlePrefetchGroupingData(grouping.id) : undefined}
                style={{
                  fontSize: '1rem',
                  fontFamily: theme.typography.fontFamily,
                  color: colors.white,
                  letterSpacing: '0.2px',
                  width: '100%',
                  minHeight: '48px',
                  alignItems: 'center',
                  paddingLeft: '48px'
                }}
              >
                {grouping.name}
              </ListItemButton>
              <NavLinkAuthDivider />
            </div>
          )
        })}
      </List>
    </div>
  )
}

export default SideNavbarGroupingList
