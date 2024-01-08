import { useMemo } from 'react'
import { useStoreReport } from 'routes/measures/MeasuresApp'
import { ReportMeasure } from './services/useQueryListReportMeasures'
import { Group } from 'components/Measures/ReportFilter'
import { convertBooleanToBool } from 'helper/utils'

const useReportFilterOptions = (listReportMeasures: ReportMeasure[]) => {
  const [filter] = useStoreReport((store) => store.options)
  return useMemo(() => {
    const filterValues = filter.map((filterOption) => filterOption.value)

    const hasProgress = filter.some((filterOption) => filterOption.group === Group.Status)
    const hasCritical = filter.some((filterOption) => filterOption.group === Group.Critical)
    const hasAssignee = filter.some((filterOption) => filterOption.group === Group.Assignee)

    const conditions = {
      includesProgress: (item: ReportMeasure) => (hasProgress ? filterValues.includes(item.progress) : true),
      includesCritical: (item: ReportMeasure) =>
        hasCritical ? filterValues.includes(convertBooleanToBool(item.isCritical)) : true,
      includesAssignee: (item: ReportMeasure) => {
        const reportAssignees = new Set(item.measures.map((measure) => measure.subDepartment))
        return hasAssignee ? filterValues.some((filter) => reportAssignees.has(filter)) : true
      }
    }

    const selected = [conditions.includesProgress, conditions.includesCritical, conditions.includesAssignee]

    return listReportMeasures?.filter((report) => selected.every((f) => f(report)))
  }, [filter, listReportMeasures])
}

export default useReportFilterOptions
