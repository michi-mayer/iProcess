import { Get } from 'type-fest'

import { defined, definedArray, AppSyncClient, getScanParameters } from 'iprocess-shared'
import { getMeasureReport, measureIds } from 'iprocess-shared/graphql/queries/index.js'
import {
  updateMeasureReport,
  deleteMeasureReport,
  createMeasureReport
} from 'iprocess-shared/graphql/mutations/index.js'
import {
  CreateMeasureReportInput,
  CreateMeasureReportMutation,
  CreateMeasureReportMutationVariables,
  DeleteMeasureReportInput,
  DeleteMeasureReportMutationVariables,
  GetMeasureReportQuery,
  GetMeasureReportQueryVariables,
  MeasureIdsQuery as MeasureIDsQuery,
  MeasureIdsQueryVariables as MeasureIDsQueryVariables,
  UpdateMeasureReportInput,
  UpdateMeasureReportMutationVariables
} from 'iprocess-shared/graphql/API.js'

type MeasureIDsValues = Get<MeasureIDsQuery, ['listMeasures', 'items', '0']>

const connector = new AppSyncClient()

export const getMeasureReportItem = async (id: string) => {
  const response = await connector.get<GetMeasureReportQuery, GetMeasureReportQueryVariables>(getMeasureReport, {
    id
  })

  return response.getMeasureReport
}

export const getMeasureIDs = async (reportId: string) => {
  const response = await connector.scan<MeasureIDsQuery, MeasureIDsQueryVariables, MeasureIDsValues>(
    measureIds,
    getScanParameters,
    {
      reportId
    }
  )
  return definedArray(response).map(({ id }) => ({ id }))
}

export const createMeasureReportItem = async (item: CreateMeasureReportInput): Promise<string> => {
  const response = await connector.mutate<CreateMeasureReportMutation, CreateMeasureReportMutationVariables>(
    createMeasureReport,
    { input: item }
  )

  return defined(response?.createMeasureReport).id
}

export const updateMeasureReportItem = async (item: UpdateMeasureReportInput) =>
  await connector.mutate<unknown, UpdateMeasureReportMutationVariables>(updateMeasureReport, { input: item })

export const deleteMeasureReportItem = async (input: DeleteMeasureReportInput) =>
  await connector.mutate<unknown, DeleteMeasureReportMutationVariables>(deleteMeasureReport, { input })
