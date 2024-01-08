import { defined, AppSyncClient } from 'iprocess-shared'
import {
  CreatePartInput,
  CreatePartMutation,
  CreatePartMutationVariables,
  CreatePartUnitInput,
  CreatePartUnitMutationVariables,
  DeletePartInput,
  DeletePartMutationVariables,
  DeletePartUnitInput,
  DeletePartUnitMutationVariables,
  GetProductWithUnitsQuery,
  GetProductWithUnitsQueryVariables,
  UpdatePartInput,
  UpdatePartMutationVariables,
  UpdatePartUnitInput,
  UpdatePartUnitMutationVariables
} from 'iprocess-shared/graphql/API.js'
import {
  createPart,
  createPartUnit,
  deletePart,
  deletePartUnit,
  updatePart,
  updatePartUnit
} from 'iprocess-shared/graphql/mutations/index.js'
import { getProductWithUnits } from 'iprocess-shared/graphql/queries/index.js'

const connector = new AppSyncClient()

export const getProductItem = async (id: string) => {
  const response = await connector.get<GetProductWithUnitsQuery, GetProductWithUnitsQueryVariables>(
    getProductWithUnits,
    {
      id
    }
  )
  return response.getPart
}

export const createProductItem = async (input: CreatePartInput) => {
  const response = await connector.mutate<CreatePartMutation, CreatePartMutationVariables>(createPart, { input })
  return defined(response.createPart?.id)
}

export const updateProductItem = async (input: UpdatePartInput) =>
  await connector.mutate<unknown, UpdatePartMutationVariables>(updatePart, { input })

export const deleteProductItem = async (input: DeletePartInput) =>
  await connector.mutate<unknown, DeletePartMutationVariables>(deletePart, { input })

export const createPartUnitItem = async (input: CreatePartUnitInput) =>
  await connector.mutate<unknown, CreatePartUnitMutationVariables>(createPartUnit, { input })

export const updatePartUnitItem = async (input: UpdatePartUnitInput) =>
  await connector.mutate<unknown, UpdatePartUnitMutationVariables>(updatePartUnit, { input })

export const deletePartUnitItem = async (input: DeletePartUnitInput) =>
  await connector.mutate<unknown, DeletePartUnitMutationVariables>(deletePartUnit, { input })
