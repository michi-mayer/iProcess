import { useQuery } from '@tanstack/react-query'
import { Cause } from 'APIcustom'
import { ReportMeasure } from 'types'
import {
  AttachmentInput,
  GetMeasureReportQuery,
  GetMeasureReportQueryVariables,
  ListMeasuresQuery,
  ListMeasuresQueryVariables
} from 'API'
import { getMeasureReport, listMeasures } from 'graphql/queries'
import { convertBoolToBoolean, defined } from 'helper/utils'
import { call } from 'services/client'

export const fetchReportMeasureById = async (reportId: string | undefined): Promise<ReportMeasure | undefined> => {
  const reportMeasureReponse = await call<GetMeasureReportQuery, GetMeasureReportQueryVariables>(getMeasureReport, {
    id: defined('reportId at useQueryReportMeasureById', reportId)
  })
  const measureListResponse = await call<ListMeasuresQuery, ListMeasuresQueryVariables>(listMeasures, {
    reportId
  })
  const report = reportMeasureReponse.data?.getMeasureReport
  const measureList = measureListResponse.data?.listMeasures?.items

  // TODO: validate with Zod schema VDD-912
  return {
    id: report?.id,
    frequency: defined('frequency at useQueryReportMeasureById', report?.frequency),
    templateId: defined('templateId at useQueryReportMeasureById', report?.templateId),
    classifications: JSON.parse(
      defined('classifications at useQueryReportMeasureById', report?.classifications)
    ) as string[],
    cycleStationName: defined('cycleStationName at useQueryReportMeasureById', report?.cycleStationName),
    description: defined('description at useQueryReportMeasureById', report?.description),
    firstOccurrence: defined('firstOccurrence at useQueryReportMeasureById', report?.firstOccurrence),
    notes: report?.notes ?? undefined,
    isCritical: convertBoolToBoolean(report?.isCritical),
    attachments: JSON.parse(
      defined('attachments at useQueryReportMeasureById', report?.attachments)
    ) as AttachmentInput[],
    productNumber: defined('productNumber at useQueryReportMeasureById', report?.productNumber),
    totalDuration: defined('totalDuration at useQueryReportMeasureById', report?.totalDuration),
    unitId: defined('unitId at useQueryReportMeasureById', report?.unitId),
    unitShortName: defined('shortName at useQueryReportMeasureById', report?.unit?.shortName),
    causes: JSON.parse(defined('causes at useQueryReportMeasureById', report?.causes)) as Cause[],
    progress: defined('progress at useQueryReportMeasureById', report?.progress),
    what: report?.what ?? undefined,
    when: report?.when ?? undefined,
    where: report?.where ?? undefined,
    measures: measureList
      ? measureList?.map((_) => ({
          id: defined('measureId at useQueryReportMeasureById', _?.id),
          description: defined('measure.description at useQueryReportMeasureById', _?.description),
          dueDate: defined('measure.dueDate at useQueryReportMeasureById', _?.dueDate),
          status: defined('measure.status at useQueryReportMeasureById', _?.status),
          subDepartment: defined('measure.subDepartment at useQueryReportMeasureById', _?.subDepartment),
          reportId: _?.reportId,
          attachments: JSON.parse(
            defined('measure.attachments at useQueryReportMeasureById', _?.attachments)
          ) as AttachmentInput[]
        }))
      : []
  }
}

const useQueryReportMeasureById = (reportId: string | undefined) => {
  return useQuery({
    queryKey: ['ReportMeasureById', { reportId }],
    queryFn: () => fetchReportMeasureById(reportId),
    enabled: !!reportId
  })
}

export default useQueryReportMeasureById
