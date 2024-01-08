import { useQuery } from '@tanstack/react-query'
import { Get } from 'type-fest'
import { NIL as NIL_UUID } from 'uuid'
import { MeasuresBasicDataQuery, MeasuresBasicDataQueryVariables, Progress } from 'API'
import { measuresBasicData } from 'graphql/queriesCustom'
import { scan } from 'services/client'

// This infers the type of the item within the Array without null or undefined
type ReportMeasureItem = NonNullable<Get<MeasuresBasicDataQuery, ['listMeasures', 'items', '0']>>
export type BasicReportMeasure = Pick<
  ReportMeasureItem,
  'id' | 'description' | 'progress' | 'templateId' | 'classifications' | 'unitId' | 'productNumber' | 'cycleStationName'
>

const fetchBasicReportMeasure = async () => {
  const reports = await scan<BasicReportMeasure, MeasuresBasicDataQueryVariables>(measuresBasicData, {
    reportId: NIL_UUID
  })
  return reports.filter((_) => _.progress !== Progress.Completed)
}

const useQueryScanBasicReportMeasures = () => {
  return useQuery({
    queryKey: ['ListBasicReportMeasures'],
    queryFn: fetchBasicReportMeasure
  })
}

export default useQueryScanBasicReportMeasures
