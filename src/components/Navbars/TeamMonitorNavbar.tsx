import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTER } from 'routes/routing'
import { UnitType } from 'API'
import { useAuth } from 'contexts/authContext'
import { ExtendedGrouping, ExtendedUnit, useIProcessDispatch, useIProcessState } from 'contexts/iProcessContext'
import { useStoreSideBar } from 'contexts/sidebarStore'
import { getDefaultTeam } from 'helper/utils'
import useQueryListGrouping from 'hooks/services/useQueryListGrouping'
import useQueryUnitListByGrouping from 'hooks/services/useQueryUnitListByGrouping'
import useGroupingAuth from 'hooks/useGroupingAuth'
import useSideNavbar from 'hooks/useSideNavbar'
import SideNavbarGroupingList from './SideNavbarGroupingList'
import SideNavbarUnitList from './SideNavbarUnitList'

const TeamMonitorNavbar = () => {
  const navigate = useNavigate()

  const { isSorting, unitSelected } = useIProcessState()
  const dispatch = useIProcessDispatch()

  const [, setStore] = useStoreSideBar((_) => _)
  const { groupingId, unitId, teamId } = useParams()
  const user = useAuth()

  const { data: listUnits } = useQueryUnitListByGrouping({ type: UnitType.assemblyLine })
  const { data: listGrouping } = useQueryListGrouping({
    isSorting,
    byAssemblyLine: true,
    userSubDepartment: user.authInfo?.userAttributes?.['custom:subdepartment']
  })

  useGroupingAuth({ groupingId, groupings: listGrouping?.items, navigate, redirectURL: ROUTER.TEAM_MONITOR })

  const { showGroupings, isCollapsed, showScrollDown, showScrollUp, groupingSelected } = useSideNavbar({
    groupingId,
    groupings: listGrouping
  })

  const handleSelectGrouping = (grouping: ExtendedGrouping) => {
    const defaultUnit = grouping?.units?.[0] // Default select the first unit
    const defaultTeam = getDefaultTeam(defaultUnit, teamId)

    setStore({ showGroupings: false })
    dispatch({ type: 'groupingSelected', groupingSelected: grouping })
    dispatch({ type: 'selectedTeam', selectedTeam: defaultTeam })
    navigate(`${ROUTER.TEAM_MONITOR}/groupingId/${grouping.id}/unitId/${defaultUnit?.id}/teamId/${defaultTeam?.id}`)
    setStore({ isCollapsed: true })
  }

  const handleSelectUnit = (unit: ExtendedUnit) => {
    const defaultTeam = getDefaultTeam(unit, teamId)

    dispatch({ type: 'unitSelected', unitSelected: unit })
    dispatch({ type: 'selectedTeam', selectedTeam: defaultTeam })
    navigate(`${ROUTER.TEAM_MONITOR}/groupingId/${groupingId}/unitId/${unit?.id}/teamId/${defaultTeam?.id}`)
  }

  const handleBackButton = () => {
    setStore({ showGroupings: true, isCollapsed: false })
    dispatch({ type: 'groupingSelected', groupingSelected: undefined })
    dispatch({ type: 'unitSelected', unitSelected: undefined })
    dispatch({ type: 'shiftModelSelected', shiftModelSelected: undefined })
    dispatch({ type: 'configurationByUnitId', configurationByUnitId: {} })
    dispatch({ type: 'productSelected', productSelected: {} })
    dispatch({ type: 'selectedTeam', selectedTeam: undefined })
    navigate(ROUTER.TEAM_MONITOR)
  }

  useEffect(() => {
    if (groupingId && unitId && unitId !== unitSelected?.id) {
      const selectedUnit = listUnits?.find((_) => _.groupingId === groupingId && _.id === unitId)
      const selectedTeam = teamId
        ? selectedUnit?.teams?.find((_) => _.id === teamId)
        : getDefaultTeam(selectedUnit, teamId)

      dispatch({ type: 'selectedTeam', selectedTeam })
      dispatch({ type: 'unitSelected', unitSelected: selectedUnit })
      setStore({ showGroupings: false })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listGrouping, unitId, unitSelected?.id, listUnits, teamId, groupingId, getDefaultTeam])

  return showGroupings && !isCollapsed ? (
    <SideNavbarGroupingList groupings={listGrouping} handleSelectGrouping={handleSelectGrouping} />
  ) : (
    <SideNavbarUnitList
      groupingSelected={groupingSelected}
      units={listUnits}
      unitSelected={unitSelected}
      isCollapsed={isCollapsed}
      showScrollUp={showScrollUp}
      showScrollDown={showScrollDown}
      handleBackButton={handleBackButton}
      handleSelectUnit={handleSelectUnit}
    />
  )
}

export default TeamMonitorNavbar
