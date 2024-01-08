import { AppSyncClient, DynamoDBClient, WithID, fromEnvironment } from 'iprocess-shared'
import {
  DeleteGroupingInput,
  DeleteGroupingMutationVariables,
  GetGroupingWithUnitsQuery,
  GetGroupingWithUnitsQueryVariables
} from 'iprocess-shared/graphql/API.js'
import { deleteGrouping } from 'iprocess-shared/graphql/mutations/index.js'
import { getGroupingWithUnits } from 'iprocess-shared/graphql/queries/index.js'

const UNIT_TABLE = fromEnvironment('API_ERFASSUNGSAPP_UNITTABLE_NAME')

const connector = {
  appsync: new AppSyncClient(),
  dynamo: new DynamoDBClient()
}

export const getGroupingItem = async (id: string) => {
  const response = await connector.appsync.get<GetGroupingWithUnitsQuery, GetGroupingWithUnitsQueryVariables>(
    getGroupingWithUnits,
    { id }
  )
  return response.getGrouping
}

export const deleteGroupingItem = async (input: DeleteGroupingInput) =>
  await connector.appsync.mutate<unknown, DeleteGroupingMutationVariables>(deleteGrouping, { input })

export const deleteAttachedUnits = async (unitIds: WithID[]) =>
  await connector.dynamo.transaction(
    unitIds.map(({ id }) => ({
      Statement: `UPDATE "${UNIT_TABLE}" REMOVE "groupingId" WHERE "id"='${id}'`
    }))
  )
