import { useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_PARAMS, ROUTER } from 'routes/routing'
import { useAuth } from 'contexts/authContext'
import { ExtendedGrouping, ExtendedUnit, useIProcessDispatch, useIProcessState } from 'contexts/iProcessContext'
import { useStoreSideBar } from 'contexts/sidebarStore'
import { getDefaultTeam } from 'helper/utils'
import { fetchConfigurationByUnitAndValidFrom } from 'hooks/services/useQueryConfigurationByUnitAndValidFrom'
import useQueryListGrouping from 'hooks/services/useQueryListGrouping'
import { fetchScheduleSlots } from 'hooks/services/useQueryScheduleSlots'
import useQueryUnitListByGrouping, { fetchUnitList } from 'hooks/services/useQueryUnitListByGrouping'
import useGroupingAuth from 'hooks/useGroupingAuth'
import useSideNavbar from 'hooks/useSideNavbar'
import { UNIT_SPECIFIC_CYCLE_STATION } from 'shared'
import SideNavbarGroupingList from './SideNavbarGroupingList'
import SideNavbarUnitList from './SideNavbarUnitList'

const ProductionNavbar = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { groupingSelected, shiftTimeRange, isSorting, unitSelected } = useIProcessState()
  const dispatch = useIProcessDispatch()
  const [, setStore] = useStoreSideBar((_) => _)
  const [params, setParams] = useSearchParams()
  const groupingId = params.get(QUERY_PARAMS.groupingId)
  const unitId = params.get(QUERY_PARAMS.unitId)
  const teamId = params.get(QUERY_PARAMS.teamId)

  const { data: listUnits } = useQueryUnitListByGrouping()
  const user = useAuth()

  const { data: listGrouping } = useQueryListGrouping({
    isSorting,
    userSubDepartment: user.authInfo?.userAttributes?.['custom:subdepartment']
  })

  useGroupingAuth({
    groupingId: groupingId || undefined,
    groupings: listGrouping?.items,
    navigate,
    redirectURL: ROUTER.PRODUCTION
  })

  const { showGroupings, isCollapsed, showScrollDown, showScrollUp } = useSideNavbar({
    groupingId,
    groupings: listGrouping
  })

  const handleSelectGrouping = (grouping: ExtendedGrouping) => {
    const groupingId = grouping?.id as string
    const defaultUnit = grouping?.units?.[0] // Default select the first unit
    const defaultTeam = getDefaultTeam(defaultUnit, teamId)

    dispatch({ type: 'groupingSelected', groupingSelected: grouping })
    dispatch({ type: 'selectedTeam', selectedTeam: defaultTeam })
    params.set(QUERY_PARAMS.groupingId, groupingId)

    if (defaultUnit && defaultUnit.id) params.set(QUERY_PARAMS.unitId, defaultUnit?.id)
    if (defaultTeam) params.set(QUERY_PARAMS.teamId, defaultTeam.id)
    params.set('cycleStationId', UNIT_SPECIFIC_CYCLE_STATION.id)
    dispatch({ type: 'cycleStationSelected', cycleStationSelected: UNIT_SPECIFIC_CYCLE_STATION })
    setParams(params)
    setStore({ showGroupings: false })
  }

  const handleSelectUnit = (unit: ExtendedUnit) => {
    if (unit.id) {
      dispatch({ type: 'unitSelected', unitSelected: unit })
      const defaultTeam = getDefaultTeam(unit, teamId)
      dispatch({ type: 'selectedTeam', selectedTeam: defaultTeam })

      if (groupingSelected && groupingSelected.id) params.set(QUERY_PARAMS.groupingId, groupingSelected.id)
      params.set(QUERY_PARAMS.unitId, unit.id)

      if (defaultTeam) {
        params.set(QUERY_PARAMS.teamId, defaultTeam.id)
      }
      params.set(QUERY_PARAMS.cycleStationId, UNIT_SPECIFIC_CYCLE_STATION.id)
      dispatch({ type: 'cycleStationSelected', cycleStationSelected: UNIT_SPECIFIC_CYCLE_STATION })

      setParams(params)
    }
  }

  const handleBackButton = () => {
    setStore({ showGroupings: true, isCollapsed: false })
    dispatch({ type: 'groupingSelected', groupingSelected: undefined })
    dispatch({ type: 'unitSelected', unitSelected: undefined })
    dispatch({ type: 'shiftModelSelected', shiftModelSelected: undefined })
    dispatch({ type: 'productSelected', productSelected: {} })
    dispatch({ type: 'selectedTeam', selectedTeam: undefined })
    setParams([])
  }

  const handlePrefetchUnitData = useCallback(
    (unitId: string | undefined) => {
      queryClient.prefetchQuery({
        queryKey: [
          'ValidConfigurationByUnit',
          {
            unitId,
            dateTimeStartUTC: shiftTimeRange?.dateTimeStartUTC,
            dateTimeEndUTC: shiftTimeRange?.dateTimeEndUTC
          }
        ],
        queryFn: () =>
          fetchConfigurationByUnitAndValidFrom({
            unitId,
            dateTimeStartUTC: shiftTimeRange?.dateTimeStartUTC,
            dateTimeEndUTC: shiftTimeRange?.dateTimeEndUTC
          })
      })
      queryClient.prefetchQuery({
        queryKey: [
          'FetchCalculationPerScheduleSlot',
          {
            unitId,
            shiftStart: shiftTimeRange?.dateTimeStartUTC,
            shiftEnd: shiftTimeRange?.dateTimeEndUTC
          }
        ],
        queryFn: () =>
          fetchScheduleSlots({
            unitId,
            dateTimeStartUTC: shiftTimeRange?.dateTimeStartUTC,
            dateTimeEndUTC: shiftTimeRange?.dateTimeEndUTC
          })
      })
    },
    [queryClient, shiftTimeRange?.dateTimeEndUTC, shiftTimeRange?.dateTimeStartUTC]
  )

  const handlePrefetchGroupingData = (groupingId: string | undefined) =>
    queryClient.prefetchQuery({
      queryKey: ['UnitListByGrouping', { groupingId }],
      queryFn: () => fetchUnitList(groupingId)
    })

  useEffect(() => {
    if (unitId && unitId !== unitSelected?.id) {
      const selectedUnit = listUnits?.find(({ id }) => unitId === id)
      const defaultTeam = selectedUnit ? getDefaultTeam(selectedUnit, teamId) : undefined
      if (defaultTeam) {
        params.set(QUERY_PARAMS.teamId, defaultTeam.id)
        setParams(params)
      }
      dispatch({ type: 'selectedTeam', selectedTeam: defaultTeam })
      dispatch({ type: 'unitSelected', unitSelected: selectedUnit })
      setStore({
        showGroupings: false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitId, unitSelected?.id, listUnits, teamId])

  return showGroupings && !isCollapsed ? (
    <SideNavbarGroupingList
      groupings={listGrouping}
      handleSelectGrouping={handleSelectGrouping}
      handlePrefetchGroupingData={handlePrefetchGroupingData}
    />
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
      handlePrefetchUnitData={handlePrefetchUnitData}
    />
  )
}

export default ProductionNavbar
