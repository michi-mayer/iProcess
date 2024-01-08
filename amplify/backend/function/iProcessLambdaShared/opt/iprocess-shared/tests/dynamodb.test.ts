// Test libraries
import { suite, expect, it, beforeEach } from 'vitest'
import { AwsStub, mockClient } from 'aws-sdk-client-mock'

// 3rd party libraries
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
  ScanCommand,
  ServiceInputTypes,
  ServiceOutputTypes
} from '@aws-sdk/lib-dynamodb'

// Local modules
import { Configuration } from '../graphql/API.js'
import { DynamoDBClient } from '../database/dynamodb.js'

import { configuration } from './mocks.test.js'

const connector = new DynamoDBClient()

const CONFIGURATION_TABLE = 'CONFIGURATION_TABLE'

suite('DynamoDB database connector', () => {
  // * see https://github.com/m-radzikowski/aws-sdk-client-mock/issues/64
  let mock: AwsStub<ServiceInputTypes, ServiceOutputTypes>

  beforeEach(() => {
    mock = mockClient(DynamoDBDocumentClient)
  })

  it('should return a value if it can be found', async () => {
    mock.on(GetCommand).resolves({ Item: configuration })

    const result = await connector.get<Configuration>({
      TableName: CONFIGURATION_TABLE,
      Key: {
        id: '6RDcsIfvjcehd5hXpl-Q2'
      }
    })

    expect(result).toBeDefined()
    expect(result).toStrictEqual(configuration)
  })

  it('should return `undefined` if a value cannot be found', async () => {
    mock.on(GetCommand).resolves({ Item: undefined })

    const result = await connector.get<Configuration>({
      TableName: CONFIGURATION_TABLE,
      Key: {
        id: '6RDcsIfvjcehd5hXpl-Q2'
      }
    })

    expect(result).toBeUndefined()
  })

  it('should return a list of values if the queries values can be found', async () => {
    mock.on(ScanCommand).resolves({ Items: [configuration] })

    const result = await connector.scan<Configuration>({
      TableName: CONFIGURATION_TABLE,
      FilterExpression: 'CONTAINS(#id, :substring)',
      ExpressionAttributeNames: {
        '#id': 'id'
      },
      ExpressionAttributeValues: {
        ':substring': 'Q2'
      }
    })

    expect(result).to.have.all.members([configuration])
  })

  it('should return an empty list if the queried values cannot be found', async () => {
    mock.on(ScanCommand).resolves({ Items: undefined })

    const result = await connector.scan<Configuration>({
      TableName: CONFIGURATION_TABLE,
      FilterExpression: 'CONTAINS(#id, :substring)',
      ExpressionAttributeNames: {
        '#id': 'id'
      },
      ExpressionAttributeValues: {
        ':substring': 'Q2'
      }
    })

    expect(result).toHaveLength(0)
  })

  it('should return the value being mutated', async () => {
    mock.on(UpdateCommand).resolves({ Attributes: { ...configuration, timeZone: 'Europe/Madrid' } })

    const result = await connector.update<Configuration>({
      TableName: CONFIGURATION_TABLE,
      Key: {
        id: '6RDcsIfvjcehd5hXpl-Q2'
      },
      UpdateExpression: 'set timeZone = :timeZone',
      ExpressionAttributeValues: {
        ':timeZone': 'Europe/Madrid'
      }
    })

    expect(result?.timeZone).toBe('Europe/Madrid')
  })
})
