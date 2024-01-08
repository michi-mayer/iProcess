import { useMemo } from 'react'
import { groupBy, sortBy, sumBy } from 'remeda'
import { DisruptionWithTemplateData } from 'types'
import { DiagramDatum } from 'components/TeamMonitor/utils'
import { useIProcessState } from 'contexts/iProcessContext'

const useGetMostFrequentDisruptions = (items: DisruptionWithTemplateData[], limit: number) => {
  const { selectedTeam } = useIProcessState()

  return useMemo(() => {
    const groupByDescription = groupBy(items, (_) => _.description.trim().toLowerCase())
    const bars = Object.entries(groupByDescription).map(
      ([, disruptions]): DiagramDatum => ({
        description: disruptions[0].description,
        myTeamFrequency: sumBy(disruptions, (_) => Number(_.team?.id === selectedTeam?.id)),
        previousTeamsFrequency: sumBy(disruptions, (_) => Number(_.team?.id !== selectedTeam?.id))
      })
    )

    const mostFrequentDisruptions = sortBy(bars, (_) => -(_.myTeamFrequency + _.previousTeamsFrequency)).slice(0, limit)
    const maxFrequency = Math.max(...mostFrequentDisruptions.map((_) => _.myTeamFrequency + _.previousTeamsFrequency))

    return { mostFrequentDisruptions, maxFrequency }
  }, [items, limit, selectedTeam])
}

export default useGetMostFrequentDisruptions
