import { createRef, useMemo } from 'react'
import { TemplateBaseWithOriginator } from 'types'
import useQueryListTemplatesFiltered from './services/useQueryListTemplatesFiltered'
import { useIProcessState } from 'contexts/iProcessContext'
import useAllInfiniteData from './useAllInfiniteData'
import usePreviousTeams from './usePreviousTeams'
import useTeams from './useTeams'

const usePreviousOriginatorTeamTemplates = () => {
  const { selectedTeam } = useIProcessState()
  const { teams } = useTeams()
  const { selectedPreviousTeams } = usePreviousTeams(teams)

  const { data, fetchNextPage, hasNextPage } = useQueryListTemplatesFiltered<TemplateBaseWithOriginator>({
    reportedByPreviousTeams: true,
    reportedBySelectedPreviousTeams: selectedPreviousTeams.map((_) => _.id),
    reportedByTeam: selectedTeam?.id
  })

  const listOriginatorTemplates = useAllInfiniteData({ fetchNextPage, hasNextPage, data })

  const previousOriginatorTeamTemplates = useMemo(
    () => listOriginatorTemplates?.filter((_) => _.originatorTeam.index < (selectedTeam?.index || 0)),
    [listOriginatorTemplates, selectedTeam?.index]
  )

  // eslint-disable-next-line unicorn/prevent-abbreviations
  const templateRefs = useMemo(
    () => (previousOriginatorTeamTemplates || []).map(() => createRef<HTMLSpanElement>()),
    [previousOriginatorTeamTemplates]
  )

  return { previousOriginatorTeamTemplates, templateRefs }
}

export default usePreviousOriginatorTeamTemplates
