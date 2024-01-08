import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { QUERY_PARAMS } from 'routes/routing'
import { Team } from 'types'
import { z } from 'zod'
import { PreviousTeamSchema } from 'zodSchemas'
import { useIProcessState } from 'contexts/iProcessContext'
import { ALL_PREVIOUS_TEAMS } from 'helper/constants'
import { parseQueryParameter } from 'helper/utils'

interface ReturnSelectedPreviousTeams {
  selectedPreviousTeams: Team[]
}

type GetSelectedPreviousTeams = (team: Team, isAlreadySelected: boolean) => Team[]

interface ReturnPreviousTeams extends ReturnSelectedPreviousTeams {
  previousTeams: Team[]
  filteredTeams: Team[]
  selectedItemsName: string
  getSelectedPreviousTeams: GetSelectedPreviousTeams
}

const getPickedPreviousTeams = (teams: Team[], selectedTeams: Team[], team: Team, isAlreadySelected: boolean) => {
  switch (true) {
    case isAlreadySelected && team.id === ALL_PREVIOUS_TEAMS.id:
      return []
    case team.id === ALL_PREVIOUS_TEAMS.id:
    case !isAlreadySelected && teams.length === selectedTeams.length + 2: // * Is 2 because by the time we click the last item, there are only 2 checkboxes left
      return teams
    case isAlreadySelected:
      return selectedTeams.filter((_) => _.id !== team.id && _.id !== ALL_PREVIOUS_TEAMS.id)
    default:
      return [...selectedTeams, team]
  }
}

/**
 * @param teams is here to make sure the useEffect doesn't run multiple times when using this hook inside of other hooks
 */
function usePreviousTeams(teams: Team[]): ReturnPreviousTeams
function usePreviousTeams(teams?: undefined): ReturnSelectedPreviousTeams
function usePreviousTeams(teams?: Team[]): ReturnPreviousTeams | ReturnSelectedPreviousTeams {
  const [params, setParams] = useSearchParams()
  const { selectedTeam } = useIProcessState()
  const { t } = useTranslation('iProcess')
  const allPreviousTeams: Team = useMemo(
    () => ({
      ...ALL_PREVIOUS_TEAMS,
      name: t('disruptionReview.allTeams')
    }),
    [t]
  )

  const { filteredTeams, previousTeams } = useMemo(() => {
    const filteredTeams = teams?.filter((_) => _.index < (selectedTeam?.index || 0)) || []
    return {
      filteredTeams,
      previousTeams: [allPreviousTeams, ...filteredTeams]
    }
  }, [allPreviousTeams, selectedTeam?.index, teams])

  const selectedPreviousTeams = useMemo(
    () => parseQueryParameter<Team[]>(params.get(QUERY_PARAMS.previousTeams), z.array(PreviousTeamSchema)) || [],
    [params]
  )

  const selectedItemsName = useMemo(() => {
    if (previousTeams.length === selectedPreviousTeams.length && selectedPreviousTeams.length > 0) {
      return allPreviousTeams.name
    }
    return selectedPreviousTeams?.map((_) => _.name).toLocaleString()
  }, [allPreviousTeams.name, previousTeams.length, selectedPreviousTeams])

  const getSelectedPreviousTeams = useCallback<GetSelectedPreviousTeams>(
    (team, isAlreadySelected) => getPickedPreviousTeams(previousTeams, selectedPreviousTeams, team, isAlreadySelected),
    [previousTeams, selectedPreviousTeams]
  )

  useEffect(() => {
    /**
     * @param teams is here to make sure it doesnt run multiple times when using this hook inside of other hooks
     */
    if (teams && selectedTeam && selectedTeam.index > 0 && !params.has(QUERY_PARAMS.previousTeams)) {
      params.set(QUERY_PARAMS.previousTeams, JSON.stringify(previousTeams))
      setParams(params)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previousTeams, selectedTeam])

  if (teams) {
    return { previousTeams, filteredTeams, selectedPreviousTeams, selectedItemsName, getSelectedPreviousTeams }
  }
  return { selectedPreviousTeams }
}

export default usePreviousTeams
