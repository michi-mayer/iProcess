import { DynamoDBClient, fromEnvironment, getCurrentDateTime } from 'iprocess-shared'
import { TemplateInput } from 'iprocess-shared/graphql/API.js'

const TABLE_NAME = fromEnvironment('API_ERFASSUNGSAPP_DISRUPTIONTABLE_NAME')

const client = new DynamoDBClient()

export const batchUpdateTemplates = async (templates: TemplateInput[]) => {
  const now = getCurrentDateTime({ utc: true })
  const statements = templates.map(({ index, id }) => ({
    Statement: `UPDATE "${TABLE_NAME}" SET "index"=${index} SET "updatedAt"='${now.toISOString()}' WHERE "id"='${id}'`
  }))

  await client.batchExecute(statements)
}
