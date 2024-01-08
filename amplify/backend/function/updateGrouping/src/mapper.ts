import type { Get } from 'type-fest'
import { AppSyncClient, DynamoDBClient, getScanParameters, fromEnvironment, WithID } from 'iprocess-shared'
import { getGrouping, unitsByGroupingId } from 'iprocess-shared/graphql/queries/index.js'
import {
  UnitsByGroupingIdQuery,
  UnitsByGroupingIdQueryVariables,
  UpdateGroupingInput,
  UpdateGroupingMutationVariables
} from 'iprocess-shared/graphql/index.js'
import { updateGrouping } from 'iprocess-shared/graphql/mutations/index.js'
import { GetGroupingQuery, GetGroupingQueryVariables } from 'iprocess-shared/graphql/API.js'

type UnitsByGroupingIDValues = Get<UnitsByGroupingIdQuery, ['unitsByGrouping', 'items', '0']>

const UNIT_TABLE = fromEnvironment('API_ERFASSUNGSAPP_UNITTABLE_NAME')

const connector = {
  appsync: new AppSyncClient(),
  dynamo: new DynamoDBClient()
}

export const getGroupingItem = async (id: string) => {
  const response = await connector.appsync.get<GetGroupingQuery, GetGroupingQueryVariables>(getGrouping, { id })
  return response.getGrouping
}

export const getUnitIDsByGrouping = async (groupingId: string) => {
  const response = await connector.appsync.scan<
    UnitsByGroupingIdQuery,
    UnitsByGroupingIdQueryVariables,
    UnitsByGroupingIDValues
  >(unitsByGroupingId, getScanParameters, { groupingId })
  return response.map(({ id }) => ({ id }))
}

export const updateGroupingItem = async (input: UpdateGroupingInput) =>
  await connector.appsync.mutate<unknown, UpdateGroupingMutationVariables>(updateGrouping, { input })

export const updateUnits = async (groupingId: string, input: string[]) =>
  await connector.dynamo.transaction(
    input.map((id) => ({
      Statement: `UPDATE "${UNIT_TABLE}" SET "groupingId"='${groupingId}' WHERE "id"='${id}'`
    }))
  )

export const deleteAttachedUnits = async (input: WithID[]) =>
  await connector.dynamo.transaction(
    input.map(({ id }) => ({
      Statement: `UPDATE "${UNIT_TABLE}" REMOVE "groupingId" WHERE "id"='${id}'`
    }))
  )
