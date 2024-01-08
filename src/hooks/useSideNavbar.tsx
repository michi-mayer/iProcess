import { useEffect } from 'react'
import type { Nullable } from 'shared'
import { useIProcessDispatch, useIProcessState } from 'contexts/iProcessContext'
import { useStoreSideBar } from 'contexts/sidebarStore'
import useQueryListGrouping from 'hooks/services/useQueryListGrouping'

type GroupingList = ReturnType<typeof useQueryListGrouping>['data']

interface UseSideNavbarProps {
  groupingId: Nullable<string>
  groupings: GroupingList
}

const useSideNavbar = ({ groupings, groupingId }: UseSideNavbarProps) => {
  const { groupingSelected } = useIProcessState()
  const [{ isCollapsed, showGroupings, showScrollDown, showScrollUp }, setStore] = useStoreSideBar((_) => _)
  const dispatch = useIProcessDispatch()

  useEffect(() => {
    if (groupingId && groupingId !== groupingSelected?.id) {
      const selectedGrouping = groupings?.items.find((grouping) => groupingId === grouping.id)
      dispatch({ type: 'groupingSelected', groupingSelected: selectedGrouping })
      setStore({
        showGroupings: false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupingId, groupingSelected?.id, groupings?.items])

  return { showGroupings, isCollapsed, showScrollDown, showScrollUp, groupingSelected }
}

export default useSideNavbar
export type { GroupingList }
