import log from 'loglevel'
import { take, drop } from 'remeda'
import type { Get } from 'type-fest'
import { DynamoDBClient as DynamoDBAPIClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  ExecuteStatementCommand,
  BatchExecuteStatementCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
  ExecuteStatementCommandInput,
  UpdateCommandInput,
  ScanCommandInput,
  GetCommandInput,
  DeleteCommandInput,
  BatchWriteCommand,
  BatchWriteCommandInput,
  PutCommandInput,
  PutCommand,
  ExecuteTransactionCommandInput,
  ExecuteTransactionCommand
} from '@aws-sdk/lib-dynamodb'
import type { Tracer } from '@aws-lambda-powertools/tracer'

import { Nullable, TableInfo, definedArray } from '../shared/types.js'
import * as indexQueries from '../graphql/queries/queries.js'
import { DatabaseError } from '../errors.js'

interface SelectOutputParameters {
  ProjectionExpression?: Array<string>
}

export type DynamoDBIndex = Uncapitalize<keyof typeof indexQueries>

// ? See all the allowed keywords in https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#scan-property
interface ScanParameters extends Omit<ScanCommandInput, 'ProjectionExpression'>, SelectOutputParameters {
  FilterExpression?: string
  IndexName?: DynamoDBIndex
}

type ExclusiveStartKey = Record<string, unknown> | undefined

interface GetParameters extends Omit<GetCommandInput, 'ProjectionExpression'>, SelectOutputParameters {}

type BatchUpdateOrDeleteInput = NonNullable<Get<BatchWriteCommandInput, ['RequestItems', '0', '0']>>

type TransactionInput = NonNullable<ExecuteTransactionCommandInput['TransactStatements']>

interface CustomBatchUpdateOrDeleteInput extends BatchUpdateOrDeleteInput {
  PutRequest?: {
    Item: Get<BatchUpdateOrDeleteInput, ['PutRequest', 'Item']> & TableInfo
  }
}

export type DynamoDBItem<T = unknown> = Nullable<Record<string, unknown> | T>

// * As defined in https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html
const BATCH_LIMIT = 25
// * As defined in https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_ExecuteTransaction.html#API_ExecuteTransaction_RequestParameters
const TRANSACT_BATCH_LIMIT = 100

export class DynamoDBClient {
  #client: DynamoDBDocumentClient

  constructor(tracer?: Tracer) {
    this.#client = DynamoDBDocumentClient.from(new DynamoDBAPIClient({}), {
      marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true
      }
    })

    if (tracer) {
      tracer.captureAWSv3Client(this.#client)
    }
  }

  /**
   * Retrieves an item from the database, if it is found
   *
   * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/GetCommand Documentation}
   */
  async get<T extends DynamoDBItem>(parameters: GetParameters) {
    return await handle('get', parameters, async () => {
      const command = new GetCommand({
        ...parameters,
        ProjectionExpression: parameters?.ProjectionExpression?.join(', ')
      })

      const { Item: item } = await this.#client.send(command)
      return item as T | undefined
    })
  }

  /**
   * Executes a PartiQL statement
   *
   * This method requires the {@link https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_ExecuteStatement.html Execute action}
   * to be assigned to the Lambda Function using it. You can add it in the 'custom-policies.json' file. Check it on the
   * 'disruptionResolver' Function to see how it's done.
   *
   * @see {@link https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ql-reference.html PartiQL reference}
   * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/ExecuteStatementCommand Documentation}
   * @deprecated This method doesn't rollback if the statement fails. Please use {@link transaction}
   */
  async execute<T extends DynamoDBItem>(parameters: ExecuteStatementCommandInput) {
    return await handle('execute', parameters, async () => {
      const command = new ExecuteStatementCommand(parameters)
      const { Items } = await this.#client.send(command)
      return definedArray(Items) as T[]
    })
  }

  /**
   * Executes a set of PartiQL statements in batches
   *
   * This method requires the {@link https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchExecuteStatement.html Batch Execute action}
   * to be assigned to the Lambda Function using it. You can add it in the 'custom-policies.json' file. Check it on the
   * 'disruptionResolver' Function to see how it's done.
   *
   * @see {@link https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ql-reference.html PartiQL reference}
   * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/BatchExecuteStatementCommand Documentation}
   * @deprecated This method doesn't rollback if any statement fail. Please use {@link transaction}
   */
  async batchExecute<T extends DynamoDBItem>(parameters: ExecuteStatementCommandInput[]) {
    const results: T[] = []
    let remaining: ExecuteStatementCommandInput[] = parameters

    if (parameters.length <= 0) {
      log.debug('Empty list of input parameters for DynamoDBClient.batchExecute. Returning an empty array')
      return []
    }

    return await handle('batchExecute', parameters, async () => {
      do {
        const givenParameters = take(remaining, BATCH_LIMIT)
        const command = new BatchExecuteStatementCommand({ Statements: givenParameters })
        const { Responses } = await this.#client.send(command)
        const errors = definedArray(Responses?.map((_) => _.Error))
        const items = definedArray(Responses?.map((_) => _.Item)) as T[]

        remaining = drop(remaining, BATCH_LIMIT)

        // ! TODO VDD-884: Implement a more reliable error-handling strategy
        if (errors?.length > 0) {
          const errorMessages = definedArray(errors.map((_) => _?.Message))
          throw new DatabaseError(
            `Request failed (${remaining.length} items of ${parameters.length} remaining)`,
            errorMessages,
            424
          )
        }

        results.push(...items)
      } while (remaining.length > 0)

      return results
    })
  }

  /**
   * Executes a set of PartiQL statements. If any of the statements fail, all the changes will be rollbacked.
   *
   * This method requires the {@link https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchExecuteStatement.html Batch Execute action}
   * to be assigned to the Lambda Function using it. You can add it in the 'custom-policies.json' file. Check it on the
   * 'disruptionResolver' Function to see how it's done.
   *
   * @see {@link https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ql-reference.html PartiQL reference}
   * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/ExecuteTransactionCommand Documentation}
   */
  async transaction<T extends DynamoDBItem>(parameters: TransactionInput) {
    const results: T[] = []
    let remaining: ExecuteStatementCommandInput[] = parameters

    if (parameters.length <= 0) {
      log.warn('Empty list of input parameters for DynamoDBClient.batchExecute. Returning an empty array')
      return []
    }

    return await handle('batchExecute', parameters, async () => {
      do {
        const givenParameters = take(remaining, TRANSACT_BATCH_LIMIT)
        const command = new ExecuteTransactionCommand({ TransactStatements: givenParameters })
        const { Responses } = await this.#client.send(command) // TODO: Check if it can also return a 'NextToken' value
        const items = definedArray(Responses?.map((_) => _.Item)) as T[]

        remaining = drop(remaining, TRANSACT_BATCH_LIMIT)
        results.push(...items)
      } while (remaining.length > 0)

      return results
    })
  }

  /**
   * Retrieves a set of items from the database
   *
   * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/ScanCommand Documentation}
   */
  async scan<T extends DynamoDBItem>(parameters: ScanParameters) {
    const results: T[] = []
    let exclusiveStartKey: ExclusiveStartKey

    return await handle('scan', parameters, async () => {
      do {
        const command = new ScanCommand({
          ...parameters,
          ProjectionExpression: parameters?.ProjectionExpression?.join(', '),
          ExclusiveStartKey: exclusiveStartKey
        })

        const { Items, LastEvaluatedKey } = await this.#client.send(command)

        results.push(...definedArray(Items as T[]))
        exclusiveStartKey = LastEvaluatedKey
      } while (exclusiveStartKey)

      return results
    })
  }

  /**
   * Updates an item from the database
   *
   * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/UpdateCommand Documentation}
   * @deprecated This method doesn't validate whether you pass one or multiple fields, so this can potentially delete required data.
   * Please use {@link execute} to update a single value or {@link batchExecute} to update multiple values,
   * as they force you to explicitly set which values you want to update or delete.
   */
  async update<T extends DynamoDBItem>(parameters: UpdateCommandInput) {
    return await handle('update', parameters, async () => {
      const command = new UpdateCommand(parameters)

      const { Attributes: item } = await this.#client.send(command)
      return item as T | undefined
    })
  }

  /**
   * Creates a new item, or replaces an old item with a new item
   *
   * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/PutCommand Documentation}
   * @deprecated This method doesn't validate whether you pass one or multiple fields, so this can potentially delete required data.
   * Please use {@link execute} to update a single value or {@link batchExecute} to update multiple values,
   * as they force you to explicitly set which values you want to update or delete.
   */
  async put<T extends DynamoDBItem>(parameters: PutCommandInput) {
    return await handle('put', parameters, async () => {
      const command = new PutCommand(parameters)

      const { Attributes: item } = await this.#client.send(command)
      return item as T | undefined
    })
  }

  /**
   * Deletes an item from the database, if it is found
   *
   * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/DeleteCommand Documentation}
   * @deprecated This method doesn't validate whether you pass one or multiple fields, so this can potentially delete required data.
   * Please use {@link execute} to update a single value or {@link batchExecute} to update multiple values,
   * as they force you to explicitly set which values you want to update or delete.
   */
  async delete(parameters: DeleteCommandInput) {
    return await handle('delete', parameters, async () => {
      const command = new DeleteCommand(parameters)
      await this.#client.send(command)
    })
  }

  /**
   * Runs a batch of Delete or Update operations
   *
   * ! BatchWriteItem cannot update items. If you perform a BatchWriteItem operation on an existing item, that item's
   * ! values will be overwritten by the operation and it will appear like it was updated. To update items,
   * ! we recommend you use the UpdateItem action
   *
   * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/BatchWriteCommand Documentation}
   * @deprecated This method doesn't validate whether you pass one or multiple fields, so this can potentially delete required data.
   * Please use {@link execute} to update a single value or {@link batchExecute} to update multiple values,
   * as they force you to explicitly set which values you want to update or delete.
   */
  async batchUpdateOrDelete(tableName: string, parameters: CustomBatchUpdateOrDeleteInput[]) {
    const unprocessedItems: BatchUpdateOrDeleteInput[] = []
    let remaining: CustomBatchUpdateOrDeleteInput[] = parameters

    if (parameters.length > 0) {
      await handle('batchUpdateOrDelete', parameters, async () => {
        do {
          const givenParameters = take(remaining, BATCH_LIMIT)
          const command = new BatchWriteCommand({ RequestItems: { [tableName]: givenParameters } })
          const { UnprocessedItems } = await this.#client.send(command)

          unprocessedItems.push(...definedArray(UnprocessedItems?.[tableName]))
          remaining = drop(remaining, BATCH_LIMIT)
        } while (remaining.length > 0)
      })
    } else {
      log.debug('Empty list of input parameters for DynamoDBClient.batchUpdateOrDelete. Doing nothing')
    }

    // ! TODO VDD-884: Implement a more reliable error-handling strategy
    for (const item of unprocessedItems) {
      log.warn(`Unable to process item`, JSON.stringify(item))
    }
  }
}

const handle = async <T>(methodName: string, parameters: unknown, method: () => Promise<T>) => {
  try {
    return await method()
  } catch (error) {
    log.error(`Error in DynamoDBClient.${methodName} (parameters: ${JSON.stringify(parameters)})`)
    throw error
  }
}
