import { defined, AppSyncClient } from 'iprocess-shared'
import {
  CreateScheduleHourInput,
  CreateScheduleHourMutationVariables,
  CreateShiftModelInput,
  CreateShiftModelMutation,
  CreateShiftModelMutationVariables,
  CreateShiftModelUnitInput,
  CreateShiftModelUnitMutationVariables,
  DeleteScheduleHourInput,
  DeleteScheduleHourMutationVariables,
  DeleteShiftModelInput,
  DeleteShiftModelMutationVariables,
  DeleteShiftModelUnitInput,
  DeleteShiftModelUnitMutationVariables,
  GetShiftModelWithScheduleHoursAndUnitsQuery,
  GetShiftModelWithScheduleHoursAndUnitsQueryVariables,
  UpdateScheduleHourInput,
  UpdateScheduleHourMutationVariables,
  UpdateShiftModelInput,
  UpdateShiftModelMutationVariables,
  UpdateShiftModelUnitInput,
  UpdateShiftModelUnitMutationVariables
} from 'iprocess-shared/graphql/API.js'
import {
  createScheduleHour,
  createShiftModel,
  createShiftModelUnit,
  deleteScheduleHour,
  deleteShiftModel,
  deleteShiftModelUnit,
  updateScheduleHour,
  updateShiftModel,
  updateShiftModelUnit
} from 'iprocess-shared/graphql/mutations/index.js'
import { getShiftModelWithScheduleHoursAndUnits } from 'iprocess-shared/graphql/queries/index.js'

const connector = new AppSyncClient()

export const getShiftModelItem = async (id: string) => {
  const response = await connector.get<
    GetShiftModelWithScheduleHoursAndUnitsQuery,
    GetShiftModelWithScheduleHoursAndUnitsQueryVariables
  >(getShiftModelWithScheduleHoursAndUnits, { id })
  return response.getShiftModel
}

export const createShiftModelItem = async (input: CreateShiftModelInput) => {
  const response = await connector.mutate<CreateShiftModelMutation, CreateShiftModelMutationVariables>(
    createShiftModel,
    { input }
  )
  return defined(response.createShiftModel?.id)
}

export const updateShiftModelItem = async (input: UpdateShiftModelInput) =>
  await connector.mutate<unknown, UpdateShiftModelMutationVariables>(updateShiftModel, { input })

export const deleteShiftModelItem = async (input: DeleteShiftModelInput) =>
  await connector.mutate<unknown, DeleteShiftModelMutationVariables>(deleteShiftModel, { input })

export const createShiftModelUnitItem = async (input: CreateShiftModelUnitInput) =>
  await connector.mutate<unknown, CreateShiftModelUnitMutationVariables>(createShiftModelUnit, { input })

export const updateShiftModelUnitItem = async (input: UpdateShiftModelUnitInput) =>
  await connector.mutate<unknown, UpdateShiftModelUnitMutationVariables>(updateShiftModelUnit, { input })

export const deleteShiftModelUnitItem = async (input: DeleteShiftModelUnitInput) =>
  await connector.mutate<unknown, DeleteShiftModelUnitMutationVariables>(deleteShiftModelUnit, { input })

export const createScheduleHourItem = async (input: CreateScheduleHourInput) =>
  await connector.mutate<unknown, CreateScheduleHourMutationVariables>(createScheduleHour, { input })

export const updateScheduleHourItem = async (input: UpdateScheduleHourInput) =>
  await connector.mutate<unknown, UpdateScheduleHourMutationVariables>(updateScheduleHour, { input })

export const deleteScheduleHourItem = async (input: DeleteScheduleHourInput) =>
  await connector.mutate<unknown, DeleteScheduleHourMutationVariables>(deleteScheduleHour, { input })
