import { List, ListItemButton, Typography } from '@mui/material'
import ArrowIcon from 'components/Icons/ArrowIcon'
import UnitIcon from 'components/Icons/UnitIcon'
import { ExtendedGrouping, ExtendedUnit } from 'contexts/iProcessContext'
import { isUnitConnectedToMachine } from 'helper/units'
import useSidebarScroll from 'hooks/useSidebarScroll'
import { colors, theme } from 'theme'
import { NavLinkAuthDivider } from './AuthNavbar'

const MAX_HEIGHT_SCROLLABLE_AREA = 328.8

interface SideNavbarUnitListingProps {
  units: ExtendedUnit[] | undefined
  unitSelected: ExtendedUnit | undefined
  groupingSelected: ExtendedGrouping | undefined
  isCollapsed: boolean
  showScrollUp: boolean
  showScrollDown: boolean
  handleBackButton: () => void
  handleSelectUnit: (_: ExtendedUnit) => void
  handlePrefetchUnitData?: (_: string | undefined) => void
}

const SideNavbarUnitList = ({
  groupingSelected,
  units,
  unitSelected,
  isCollapsed,
  showScrollUp,
  showScrollDown,
  handleBackButton,
  handleSelectUnit,
  handlePrefetchUnitData
}: SideNavbarUnitListingProps) => {
  const { scrollRef, unitRefs, handleScroll, handleScrollDown, handleScrollUp } = useSidebarScroll(
    units,
    MAX_HEIGHT_SCROLLABLE_AREA
  )

  return (
    <div data-testid='side-navbar-unit-list'>
      <ListItemButton onClick={handleBackButton} color='white' style={{ boxSizing: 'border-box', marginTop: '1rem' }}>
        <ArrowIcon style={{ transform: 'rotate(90deg)' }} fill={colors.white} />
        {!isCollapsed && (
          <Typography variant='h5' color='white' style={{ marginLeft: '0.5rem' }}>
            {groupingSelected?.name}
          </Typography>
        )}
      </ListItemButton>
      {showScrollUp && (
        <>
          <NavLinkAuthDivider />
          <ListItemButton
            onClick={handleScrollUp}
            style={!isCollapsed ? { display: 'flex', justifyContent: 'center' } : {}}
          >
            <ArrowIcon style={{ transform: 'rotate(180deg)', marginLeft: '0.2rem' }} fill={colors.white} />
          </ListItemButton>
        </>
      )}
      <div
        ref={scrollRef}
        style={{ overflowY: 'auto', overflowX: 'hidden', height: `calc(100vh - ${MAX_HEIGHT_SCROLLABLE_AREA}px)` }}
        onScroll={handleScroll}
      >
        <List>
          <NavLinkAuthDivider />
          {units?.map((unit, index) => {
            const isConnected = isUnitConnectedToMachine(unit)
            return (
              <div key={unit.id} ref={unitRefs?.[index]}>
                <ListItemButton
                  id={`select-unit-${unit.shortName}`}
                  onClick={() => handleSelectUnit(unit)}
                  onMouseOver={handlePrefetchUnitData ? () => handlePrefetchUnitData(unit.id) : undefined}
                  onMouseEnter={handlePrefetchUnitData ? () => handlePrefetchUnitData(unit.id) : undefined}
                  style={{
                    display: 'flex',
                    flexDirection: isCollapsed ? 'column' : 'row',
                    justifyContent: isCollapsed ? 'center' : undefined,
                    fontSize: '1rem',
                    fontWeight: !!unitSelected && unit.id === unitSelected?.id ? 'bold' : undefined,
                    fontFamily: theme.typography.fontFamily,
                    color: colors.white,
                    letterSpacing: '0.2px',
                    width: '100%',
                    minHeight: isCollapsed ? '65px' : '48px',
                    paddingLeft: '1rem',
                    borderLeft:
                      !!unitSelected && unit.id === unitSelected?.id ? `2px solid ${colors.white}` : undefined,
                    marginLeft: unit.id !== unitSelected?.id ? '2px' : undefined
                  }}
                >
                  <UnitIcon unitType={unit.type} isConnected={isConnected} />
                  {unit.shortName}
                </ListItemButton>
                <NavLinkAuthDivider />
              </div>
            )
          })}
        </List>
      </div>
      {showScrollDown && (
        <>
          <ListItemButton
            onClick={handleScrollDown}
            style={!isCollapsed ? { display: 'flex', justifyContent: 'center' } : {}}
          >
            <ArrowIcon fill={colors.white} style={{ marginLeft: '0.2rem' }} />
          </ListItemButton>
          <NavLinkAuthDivider />
        </>
      )}
    </div>
  )
}

export default SideNavbarUnitList
