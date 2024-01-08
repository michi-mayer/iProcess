// 3rd party
import log from 'loglevel'

// 3rd party AWS
import crypto from '@aws-crypto/sha256-js'
import { defaultProvider } from '@aws-sdk/credential-provider-node'
import { SignatureV4 } from '@aws-sdk/signature-v4'
import { HttpRequest } from '@aws-sdk/protocol-http'
import type { GraphQLResult } from '@aws-amplify/api'

// Local modules
import { fromEnvironment } from '../utils/index.js'
import { Nullable, WithTypename, definedArray } from '../shared/types.js'
import { DatabaseError } from '../errors.js'

interface ScanParameters<T> {
  items: Nullable<T>[]
  nextToken?: Nullable<string>
}

interface AppSyncScan<T> {
  [key: string]: Nullable<WithTypename & ScanParameters<T>>
}

type GraphQLData<T extends object = object> = Nullable<T> | NonNullable<unknown>

export interface GraphQLClientSpec {
  call: <Result extends GraphQLData, Variables extends object>(query: string, variables: Variables) => Promise<Result>
}

class GraphQLClient implements GraphQLClientSpec {
  endpoint: URL
  #signer: SignatureV4

  constructor(url: string) {
    const region = fromEnvironment('REGION')

    this.endpoint = new URL(url)
    this.#signer = new SignatureV4({
      credentials: defaultProvider(),
      region,
      service: 'appsync',
      sha256: crypto.Sha256
    })
  }

  async call<Result extends GraphQLData, Variables extends object>(query: string, variables: Variables) {
    try {
      const { data, errors, extensions } = await this.#fetch<Result, Variables>(query, variables)

      if (extensions) {
        log.debug('GraphQL response with extensions', { extensions })
      }

      // ! TODO VDD-884: Implement a more reliable error-handling strategy
      if (errors) {
        const errorMessages = errors.map((_) => _?.message)
        throw new DatabaseError('Request failed', errorMessages, 424)
      } else if (data) {
        return data
      } else {
        throw new DatabaseError('Request is empty')
      }
    } catch (error) {
      log.error(`Error in Database.call`, JSON.stringify({ query, variables, error }))
      throw error
    }
  }

  async #fetch<Result extends GraphQLData, Variables extends object>(query: string, variables: Variables) {
    const request = await this.#buildRequest(query, variables)
    const response = await fetch(request)
    const body = await response.json()

    return body as GraphQLResult<Result>
  }

  async #buildRequest<Variables extends object>(query: string, variables: Variables) {
    const signed = await this.#sign({
      method: 'POST',
      headers: { 'Content-Type': 'application/json', host: this.endpoint.host },
      hostname: this.endpoint.host,
      path: this.endpoint.pathname,
      body: JSON.stringify({ query, variables })
    })

    return new Request(this.endpoint.toString(), signed)
  }

  async #sign(requestOptions: object) {
    const requestToBeSigned = new HttpRequest(requestOptions)
    return await this.#signer.sign(requestToBeSigned)
  }
}

export const getScanParameters = <T, ScanQuery extends AppSyncScan<T>>(_: ScanQuery): ScanParameters<T> => {
  const values = Object.values(_ || {})[0]
  return { items: values?.items || [], nextToken: values?.nextToken }
}

export class AppSyncClient {
  #client: GraphQLClientSpec

  constructor(client?: GraphQLClientSpec, url = fromEnvironment('API_ERFASSUNGSAPP_GRAPHQLAPIENDPOINTOUTPUT')) {
    this.#client = client || new GraphQLClient(url)
  }

  // TODO (VDD-535): add option to return already validated output with zod
  async mutate<Mutation extends GraphQLData, Variables extends object>(mutation: string, variables: Variables) {
    return await this.#client.call<Mutation, Variables>(mutation, variables)
  }

  async get<GetQuery extends GraphQLData, Variables extends object>(query: string, variables: Variables) {
    return await this.#client.call<GetQuery, Variables>(query, variables)
  }

  async scan<ScanQuery extends GraphQLData, Variables extends object, T extends GraphQLData>(
    query: string,
    getParameters: (_: ScanQuery) => ScanParameters<T>,
    variables?: Variables
  ) {
    log.debug('Scan operation', JSON.stringify({ query, variables }))
    let nextToken: Nullable<string>
    const result: NonNullable<T>[] = []

    do {
      const data = await this.#client.call<ScanQuery, Variables>(query, { ...variables, nextToken } as Variables)
      const { items, nextToken: newNextToken } = getParameters(data)
      result.push(...definedArray(items))

      nextToken = newNextToken
    } while (nextToken)

    return result
  }
}
