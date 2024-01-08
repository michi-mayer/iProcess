import { useMemo } from 'react'
import { ExtendedUnit, useIProcessState } from 'contexts/iProcessContext'

const canShowTeams = (unit: ExtendedUnit | undefined) => ({
  teams: unit?.teams || [],
  showTeams: !!unit?.teams && unit.teams.length > 0
})

export type UseTeamsReturn = ReturnType<typeof canShowTeams>

const useTeams = () => {
  const { unitSelected } = useIProcessState()
  return useMemo(() => canShowTeams(unitSelected), [unitSelected])
}

export default useTeams
