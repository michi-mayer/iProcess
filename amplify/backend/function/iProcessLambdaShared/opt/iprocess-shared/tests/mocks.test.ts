import type { GraphQLResult } from '@aws-amplify/api'

import { Configuration } from '../graphql/index.js'

import { GraphQLClientSpec } from '../database/appsync.js'
import { DatabaseError } from '../errors.js'

export class MockedGraphQLClient implements GraphQLClientSpec {
  #response: unknown
  #errors?: string[]

  constructor({ data, errors }: GraphQLResult<unknown>) {
    this.#response = data
    this.#errors = errors?.map((_) => _.message)
  }

  call<Result>(_query: string, _variables: unknown) {
    if (this.#errors) {
      throw new DatabaseError('Unexpected errors', this.#errors)
    } else {
      return this.#response as Result
    }
  }
}

export const configuration: Configuration = {
  __typename: 'Configuration',
  id: '6RDcsIfvjcehd5hXpl-Q2',
  createdAt: '',
  updatedAt: '',
  validFrom: '',
  validUntil: '',
  partId: '',
  unitId: '',
  shiftModelId: '',
  shiftTarget: 5,
  cycleTime: 5,
  timeZone: ''
}
