import { useTranslation } from 'react-i18next'
import { BarTooltipProps } from '@nivo/bar'
import { BarChartTooltip } from 'components/Charts/BarChart'
import { DiagramDatum } from './utils'

const Tooltip = ({ value, color, data: { description } }: BarTooltipProps<DiagramDatum>) => {
  const { t } = useTranslation('teamMonitor')

  return (
    <BarChartTooltip
      color={color}
      top={{ title: t('overview.diagram.disruption'), body: description }}
      bottom={{ title: t('overview.diagram.overallFrequency'), body: `${value} ${t('overview.diagram.occurrences')}` }}
    />
  )
}

export default Tooltip
