import { useMemo } from 'react'
import { ParetoBarDatum, TemplateDashboard } from 'types'
import TemplateRow from 'components/Dashboard/TemplateRow'
import { EnhancedHeader } from 'components/Tables/EnhancedTableHead'
import SortableTable from 'components/Tables/SortableTable'
import useQueryScanBasicReportMeasures from 'hooks/services/useQueryScanBasicReportMeasures'

const TABLE_HEAD: EnhancedHeader<TemplateDashboard>[] = [
  {
    id: 'description',
    numeric: false,
    label: 'description'
  },
  {
    id: 'totalDuration',
    numeric: false,
    label: 'totalDuration'
  },
  {
    id: 'frequency',
    numeric: true,
    label: 'frequency'
  },
  {
    id: 'unitShortName',
    numeric: false,
    label: 'unitName'
  }
]

interface DisruptionListProps {
  paretoData: ParetoBarDatum[]
}

const DashboardDisruptionList = ({ paretoData }: DisruptionListProps) => {
  const { data: reportMeasures } = useQueryScanBasicReportMeasures()

  const renderTemplateRow = (template: TemplateDashboard, index: number) => {
    if (template?.frequency && template?.frequency > 0) {
      return (
        <TemplateRow
          template={template}
          key={template.templateId + template.classifications + template.productNumber + index}
          reportMeasures={reportMeasures}
        />
      )
    }
    return undefined
  }

  const templates = useMemo(
    () =>
      paretoData.map(({ classifications, ...rest }) => ({
        ...rest,
        classifications: Object.values(JSON.parse(classifications) as string[]).filter(Boolean)
      })),
    [paretoData]
  )

  return (
    <SortableTable
      headers={TABLE_HEAD}
      orderByDefault={'description'}
      data={templates}
      renderTableRow={renderTemplateRow}
    />
  )
}

export default DashboardDisruptionList
