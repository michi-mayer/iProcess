import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import BarChart from 'components/Charts/BarChart'
import LoadingContainer from 'components/Charts/LoadingContainer'
import { useIProcessState } from 'contexts/iProcessContext'
import useQueryDisruptionsByTime, { TeamsChoice } from 'hooks/services/useQueryDisruptionsByTime'
import useGetMostFrequentDisruptions from 'hooks/useGetMostFrequentDisruptions'
import { colors } from 'theme'
import { DiagramContainer } from './DisruptionList'
import { useAxisFormatter } from './MostFrequentCurrentDisruptionsDiagram'
import Tooltip from './Tooltip'
import { DiagramDatumKey, indexBy, legends } from './utils'

const TOP_DISRUPTIONS_TO_SHOW = 3

const usePreviousShiftTimeRange = () => {
  const { previousShiftScheduleSlots } = useIProcessState()

  return useMemo(() => {
    const startDateTimes = (previousShiftScheduleSlots || []).map((_) => _.dateTimeStartUTC).sort()
    const endDateTimes = (previousShiftScheduleSlots || []).map((_) => _.dateTimeEndUTC).sort()

    return {
      dateTimeStartUTC: startDateTimes[0],
      dateTimeEndUTC: endDateTimes[startDateTimes.length - 1]
    }
  }, [previousShiftScheduleSlots])
}

const MostFrequentPreviousDisruptionsDiagram = () => {
  const { t } = useTranslation('teamMonitor')
  const { selectedTeam } = useIProcessState()
  const dateTimeRange = usePreviousShiftTimeRange()

  const originatedByMyTeam = useQueryDisruptionsByTime({
    ...dateTimeRange,
    originator: { by: TeamsChoice.SelectedTeam, id: selectedTeam?.id }
  })

  const reportedByMyTeam = useQueryDisruptionsByTime({
    ...dateTimeRange,
    reporter: { by: TeamsChoice.SelectedTeam, id: selectedTeam?.id },
    originator: { by: TeamsChoice.NoTeam }
  })

  const items = useMemo(
    () => [...originatedByMyTeam.data, ...reportedByMyTeam.data],
    [originatedByMyTeam.data, reportedByMyTeam.data]
  )

  const { mostFrequentDisruptions, maxFrequency } = useGetMostFrequentDisruptions(items, TOP_DISRUPTIONS_TO_SHOW)
  const xAxisFormatter = useAxisFormatter()

  const hasData = mostFrequentDisruptions.length > 0

  return (
    <LoadingContainer
      isLoading={originatedByMyTeam.isInitialLoading && reportedByMyTeam.isInitialLoading}
      isSuccess={originatedByMyTeam.isSuccess && reportedByMyTeam.isSuccess}
      hasData={hasData}
      showWhiteBackground={false}
      noDataMessage={t('overview.diagram.noDataMessage')}
    >
      <DiagramContainer container display='flex' alignItems='center'>
        <BarChart
          data={mostFrequentDisruptions}
          keys={[DiagramDatumKey.MyTeamFrequency, DiagramDatumKey.PreviousTeamsFrequency]}
          title={t('overview.diagram.pastShiftTitle')}
          titleColor={colors.black}
          colors={(_) => (_.id === DiagramDatumKey.MyTeamFrequency ? colors.gray3 : colors.gray2)}
          legendLabel={(_) =>
            _.id === DiagramDatumKey.MyTeamFrequency
              ? t('overview.disruptionList.myTeam')
              : t('overview.disruptionList.followingTeams')
          }
          yAxisTitle={t('overview.diagram.overallFrequency')}
          yAxisTickValues={maxFrequency * 2}
          gridYValues={maxFrequency * 2}
          xAxisFormatter={xAxisFormatter}
          indexBy={indexBy}
          tooltip={Tooltip}
          legends={legends}
        />
      </DiagramContainer>
    </LoadingContainer>
  )
}

export default MostFrequentPreviousDisruptionsDiagram
