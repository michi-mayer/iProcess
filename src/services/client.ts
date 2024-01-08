// GraphQL
import type { GraphQLQuery, GraphQLSubscription } from '@aws-amplify/api'
import { API, graphqlOperation } from '@aws-amplify/api'
import type { Nullable, WithTypename } from 'shared/types'

export interface NextTokenProps {
  nextToken?: Nullable<string>
}

export interface ScanResult<T extends Nullable<object> = Nullable<Record<string, unknown>>> extends NextTokenProps {
  items: T[]
}

interface GraphQLQueryResult {
  [key: string]: WithTypename & ScanResult
}

const getScanParameters = (data: GraphQLQueryResult): ScanResult => {
  const result = Object.values(data)[0]
  return { items: result?.items || [], nextToken: result?.nextToken }
}

/**
 *
 * @param {string} query
 * @param {object} variables
 * @param {string} authToken
 * @returns
 */
export const call = async <
  TQuery extends object | unknown = unknown,
  TVariables extends object | undefined = undefined
>(
  query: string,
  variables?: TVariables,
  authToken?: string
) => await API.graphql<GraphQLQuery<TQuery>>(graphqlOperation(query, variables, authToken))

/**
 * @param {string} query
 * @param {object} variables
 * @param {string} authToken
 * @returns {Promise<TItem[]>} A Promise of {@link TItem}[]
 */
export const scan = async <TItem extends object | unknown = unknown, TVariables extends object | undefined = undefined>(
  query: string,
  variables?: TVariables,
  authToken?: string
): Promise<TItem[]> => {
  let nextToken: string | null | undefined
  let result: TItem[] = []

  do {
    const response = await call(query, { ...variables, nextToken }, authToken)

    if (response.data) {
      const { items, nextToken: newNextToken } = getScanParameters(response.data)
      result = [...result, ...(items as TItem[])]
      nextToken = newNextToken
    }
  } while (nextToken)
  return result
}

export const subscribe = <TSubscription extends object, TVariables extends object = object>(
  subscription: string,
  variables: TVariables,
  authToken?: string
) => API.graphql<GraphQLSubscription<TSubscription>>(graphqlOperation(subscription, variables, authToken))
