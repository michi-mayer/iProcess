import { useEffect } from 'react'
import { NavigateFunction } from 'react-router'
import { ExtendedGrouping } from 'contexts/iProcessContext'

interface useGroupingAuthProps {
  groupingId: string | undefined
  groupings: ExtendedGrouping[] | undefined
  navigate: NavigateFunction
  redirectURL: string
}

const useGroupingAuth = ({ groupingId, groupings, navigate, redirectURL }: useGroupingAuthProps) => {
  useEffect(() => {
    if (groupingId && groupings) {
      const userHasAccessToGroup = groupings.some((_) => _.id === groupingId)
      if (!userHasAccessToGroup) {
        navigate(redirectURL)
      }
    }
  }, [groupingId, groupings, navigate, redirectURL])
}

export default useGroupingAuth
