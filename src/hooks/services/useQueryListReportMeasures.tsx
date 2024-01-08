import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { Measure } from 'APIcustom'
import { NIL as NIL_UUID } from 'uuid'
import { MeasuresBasicDataQuery, MeasuresBasicDataQueryVariables, Progress } from 'API'
import { measuresBasicData } from 'graphql/queriesCustom'
import { convertBoolToBoolean, defined } from 'helper/utils'
import { call, NextTokenProps, scan } from 'services/client'

export interface ReportMeasure {
  id: string
  description: string
  isCritical: boolean
  progress: Progress
  measures: Measure[]
}

interface Props extends NextTokenProps {}

export const fetchMeasureReportsList = async ({ nextToken }: Props) => {
  const response = await call<MeasuresBasicDataQuery, MeasuresBasicDataQueryVariables>(measuresBasicData, {
    reportId: NIL_UUID,
    nextToken
  })
  const reports = await Promise.all(
    response.data?.listMeasures?.items.map(async (report) => {
      const responseMeasures = await scan<Measure, MeasuresBasicDataQueryVariables>(measuresBasicData, {
        reportId: defined('reportId at fetchMeasureReportsList', report?.id)
      })
      return {
        id: defined('useQueryListReportMeasures', report?.id),
        description: defined('useQueryListReportMeasures', report?.description),
        isCritical: convertBoolToBoolean(report?.isCritical),
        progress: report?.progress,
        measures: responseMeasures.map((measure) => {
          return {
            id: measure?.id,
            description: measure?.description,
            dueDate: measure?.dueDate,
            status: measure?.status,
            subDepartment: measure?.subDepartment
          }
        })
      }
    }) || []
  )

  return {
    items: reports as ReportMeasure[],
    nextToken: response.data?.listMeasures?.nextToken
  }
}

const useQueryListReportMeasures = () => {
  return useInfiniteQuery({
    queryKey: ['ListReportMeasures'],
    queryFn: ({ pageParam }) => fetchMeasureReportsList({ nextToken: pageParam }),
    getNextPageParam: (lastPage) => lastPage?.nextToken,
    initialPageParam: undefined as Props['nextToken'],
    placeholderData: keepPreviousData,
    meta: {
      errorMessage: 'Error fetching report Measures:'
    }
  })
}

export default useQueryListReportMeasures
