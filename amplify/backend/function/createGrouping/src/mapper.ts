import { defined, AppSyncClient, DynamoDBClient, fromEnvironment } from 'iprocess-shared'
import {
  CreateGroupingInput,
  CreateGroupingMutation,
  CreateGroupingMutationVariables,
  UnitBasicDataQuery,
  UnitBasicDataQueryVariables
} from 'iprocess-shared/graphql/index.js'
import { createGrouping } from 'iprocess-shared/graphql/mutations/index.js'
import { unitBasicData } from 'iprocess-shared/graphql/queries/index.js'

const UNIT_TABLE = fromEnvironment('API_ERFASSUNGSAPP_UNITTABLE_NAME')

const connector = {
  appsync: new AppSyncClient(),
  dynamo: new DynamoDBClient()
}

export const getUnitItem = async (id: string) => {
  const response = await connector.appsync.get<UnitBasicDataQuery, UnitBasicDataQueryVariables>(unitBasicData, { id })
  return defined(response.getUnit)
}

export const createGroupingItem = async (input: CreateGroupingInput) => {
  const createGroupingResponse = await connector.appsync.mutate<
    CreateGroupingMutation,
    CreateGroupingMutationVariables
  >(createGrouping, {
    input
  })

  return defined(createGroupingResponse?.createGrouping?.id)
}

export const updateUnitsWithGroupingId = async (groupingId: string, unitIds: string[]) =>
  await connector.dynamo.transaction(
    unitIds.map((id) => ({
      Statement: `UPDATE "${UNIT_TABLE}" SET "groupingId"='${groupingId}' WHERE "id"='${id}'`
    }))
  )
