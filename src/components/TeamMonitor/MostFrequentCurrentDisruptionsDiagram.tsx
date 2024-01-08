import { useTranslation } from 'react-i18next'
import { DisruptionWithTemplateData } from 'types'
import BarChart from 'components/Charts/BarChart'
import { CHART_LABEL_SPEC } from 'components/Charts/constants'
import LoadingContainer from 'components/Charts/LoadingContainer'
import { trim } from 'helper/utils'
import useGetMostFrequentDisruptions from 'hooks/useGetMostFrequentDisruptions'
import useMediaQuery from 'hooks/useMediaQuery'
import { colors } from 'theme'
import { DiagramContainer } from './DisruptionList'
import Tooltip from './Tooltip'
import { DiagramDatumKey, fromIndex, indexBy, legends } from './utils'

const TOP_DISRUPTIONS_TO_SHOW = 5

export const useAxisFormatter = () => {
  const [isDesktopWidth] = useMediaQuery('lg')

  return (value: string) => {
    const { description } = fromIndex(value)
    return trim(description, isDesktopWidth ? CHART_LABEL_SPEC.MAX_CHARS_DESKTOP : CHART_LABEL_SPEC.MAX_CHARS_MOBILE)
  }
}

interface MostFrequentCurrentDisruptionsDiagramProps {
  items: DisruptionWithTemplateData[]
  isLoading: boolean
  isSuccess: boolean
}

const MostFrequentCurrentDisruptionsDiagram = ({
  items,
  isLoading,
  isSuccess
}: MostFrequentCurrentDisruptionsDiagramProps) => {
  const { t } = useTranslation('teamMonitor')
  const { mostFrequentDisruptions, maxFrequency } = useGetMostFrequentDisruptions(items, TOP_DISRUPTIONS_TO_SHOW)
  const xAxisFormatter = useAxisFormatter()

  const hasData = mostFrequentDisruptions.length > 0

  return (
    <LoadingContainer
      isLoading={isLoading}
      isSuccess={isSuccess}
      hasData={hasData}
      showWhiteBackground={false}
      noDataMessage={t('overview.diagram.noDataMessage')}
    >
      <DiagramContainer container display='flex' alignItems='center'>
        <BarChart
          data={mostFrequentDisruptions}
          keys={[DiagramDatumKey.MyTeamFrequency, DiagramDatumKey.PreviousTeamsFrequency]}
          title={t('overview.diagram.currentShiftTitle')}
          titleColor={colors.black}
          colors={(_) => (_.id === DiagramDatumKey.MyTeamFrequency ? colors.babyblue : colors.blue)}
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

export default MostFrequentCurrentDisruptionsDiagram
