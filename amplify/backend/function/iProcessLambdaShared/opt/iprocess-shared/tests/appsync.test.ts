// Test libraries
import { suite, assert, it } from 'vitest'
import { Get } from 'type-fest'

import { GraphQLResult } from '@aws-amplify/api'

import { AppSyncClient, getScanParameters } from '../database/appsync.js'
import { getConfiguration, listConfigurations } from '../graphql/queries/index.js'
import { updateConfiguration } from '../graphql/mutations/index.js'
import {
  GetConfigurationQuery,
  GetConfigurationQueryVariables,
  ListConfigurationsQuery as Query,
  ListConfigurationsQueryVariables as Variables,
  ModelConfigurationFilterInput,
  UpdateConfigurationInput,
  UpdateConfigurationMutation,
  UpdateConfigurationMutationVariables
} from '../graphql/index.js'

import { MockedGraphQLClient, configuration } from './mocks.test.js'

type Values = Get<Query, ['listConfigurations', 'items', '0']>

const getDBWrapper = (response: GraphQLResult<unknown>) => {
  const client = new MockedGraphQLClient(response)
  return new AppSyncClient(client)
}

suite('GraphQL database connector', () => {
  it('should return a value if it can be found', async () => {
    const expectedResult: GetConfigurationQuery = {
      getConfiguration: { ...configuration, __typename: 'Configuration', id: '6RDcsIfvjcehd5hXpl-Q2' }
    }

    const database = getDBWrapper({ data: expectedResult })
    const result = await database.get<GetConfigurationQuery, GetConfigurationQueryVariables>(getConfiguration, {
      id: '6RDcsIfvjcehd5hXpl-Q2'
    })

    assert.deepEqual(result, expectedResult)
  })

  it('should return `null` if a value cannot be found', async () => {
    const expectedResult = { getConfiguration: null } // eslint-disable-line unicorn/no-null

    const database = getDBWrapper({ data: expectedResult })
    const result = await database.get<GetConfigurationQuery, GetConfigurationQueryVariables>(getConfiguration, {
      id: '6RDcsIfvjcehd5hX123-Qa2'
    })

    assert.deepEqual(result, expectedResult)
  })

  it('should return a list of values if the queries values can be found', async () => {
    const database = getDBWrapper({
      data: { listConfigurations: { __typename: 'ModelConfigurationConnection', items: [configuration] } }
    })

    const expectedResult = [{ ...configuration, __typename: 'Configuration', id: '6RDcsIfvjcehd5hXpl-Q2' }]

    const result = await database.scan<Query, Variables, Values>(listConfigurations, getScanParameters, {
      filter: { id: { contains: 'Q2' } }
    })

    assert.deepEqual(result, expectedResult as typeof result)
  })

  it('should return an empty list if the queried values cannot be found', async () => {
    const database = getDBWrapper({
      data: { listConfigurations: { __typename: 'ModelConfigurationConnection', items: [] } }
    })

    const filter: ModelConfigurationFilterInput = { id: { contains: 'Qa2' } }
    const result = await database.scan<Query, Variables, Values>(listConfigurations, getScanParameters, {
      filter
    })

    assert.lengthOf(result, 0)
  })

  it('should return the value being mutated', async () => {
    const input: UpdateConfigurationInput = { id: '6RDcsIfvjcehd5hXpl-Q2', speedMode: 10 }
    const expectedResult: UpdateConfigurationMutation = {
      updateConfiguration: { ...input, ...configuration, __typename: 'Configuration' }
    }

    const database = getDBWrapper({
      extensions: {
        updateConfiguration: undefined
      },
      data: structuredClone(expectedResult)
    })

    const result = await database.mutate<UpdateConfigurationMutation, UpdateConfigurationMutationVariables>(
      updateConfiguration,
      { input }
    )

    assert.deepEqual(result, expectedResult)
  })
})
