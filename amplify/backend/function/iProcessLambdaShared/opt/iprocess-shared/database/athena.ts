import { Readable } from 'node:stream'

// 3rd party libs
import log from 'loglevel'
import { parse as csvParse } from '@fast-csv/parse'

import {
  AthenaClient,
  StartQueryExecutionCommand,
  StopQueryExecutionCommand,
  GetQueryExecutionCommand,
  GetQueryExecutionCommandOutput,
  QueryExecutionState,
  GetWorkGroupCommand,
  WorkGroup
} from '@aws-sdk/client-athena'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

// Lambda Layer
import { extractValues, fromEnvironment, defined } from 'iprocess-shared'

export type Column<T> = string & keyof T
export type Columns<T extends object> = Column<T>[]

export type ItemProcessor<TInput extends object, TOutput extends object | undefined> = (
  item: TInput
) => Promise<TOutput>

export interface AthenaConfiguration {
  secondsToWait: number
  workGroupName: string
}

const S3_OBJECT_REGEX = /s3:\/\/([^/]+)\/(.+)/g

export class AthenaConnector {
  readonly #athenaClient: AthenaClient
  readonly #s3Client: S3Client

  #workGroup: WorkGroup
  #initialized: boolean
  #timeout: number
  #defaultConfiguration: AthenaConfiguration

  constructor() {
    const region = fromEnvironment('REGION')

    this.#athenaClient = new AthenaClient({ region })
    this.#s3Client = new S3Client({ region })
    this.#timeout = Number(fromEnvironment('TIMEOUT', () => '180')) // * 180 is a sane default (3 minutes)

    this.#initialized = false
    this.#workGroup = {} as WorkGroup // ? will be set as soon as a call is done
    this.#defaultConfiguration = { secondsToWait: this.#timeout, workGroupName: 'primary' }
  }

  async #setup(workGroupName: string) {
    const { WorkGroup: workGroupInfo } = await this.#athenaClient.send(
      new GetWorkGroupCommand({ WorkGroup: workGroupName })
    )

    this.#workGroup = defined(workGroupInfo)
    log.debug('Workgroup info', { workGroup: this.#workGroup })

    this.#initialized = true
  }

  async #start(query: string) {
    const { QueryExecutionId: commandId } = await this.#athenaClient.send(
      new StartQueryExecutionCommand({
        QueryString: query,
        WorkGroup: this.#workGroup?.Name,
        ResultConfiguration: this.#workGroup?.Configuration?.ResultConfiguration
      })
    )

    log.info(`Started query commmand with ID ${commandId}`)
    return defined(commandId)
  }

  async #stop(commandId: string) {
    await this.#athenaClient.send(new StopQueryExecutionCommand({ QueryExecutionId: commandId }))
  }

  async call<TInput extends object, TOutput extends object>(
    query: string,
    processItem: ItemProcessor<TInput, TOutput | undefined>,
    { secondsToWait, workGroupName }: AthenaConfiguration = this.#defaultConfiguration
  ) {
    if (!this.#initialized) await this.#setup(workGroupName)

    const commandId = await this.#start(query)

    try {
      await this.#waitUntilCompletion(commandId, secondsToWait)
      return await this.#getData(commandId, processItem)
    } catch (error) {
      log.warn(`Error in Athena query. Stopping the query with ID ${commandId}`)
      await this.#stop(commandId)

      throw error
    }
  }

  async #waitUntilCompletion(commandId: string, secondsToWait: number) {
    log.debug(`Waiting ${secondsToWait} until command ${commandId} is finished`)

    await withTimeout(
      async () => {
        let finished = false
        let response: GetQueryExecutionCommandOutput
        do {
          response = await this.#athenaClient.send(new GetQueryExecutionCommand({ QueryExecutionId: commandId }))
          finished = response.QueryExecution?.Status?.State === QueryExecutionState.SUCCEEDED
        } while (!finished)

        return finished
      },
      secondsToWait * 1000,
      async () => await this.#stop(commandId)
    )
  }

  async #getData<TInput extends object, TOutput extends object>(
    commandId: string,
    processItem: ItemProcessor<TInput, TOutput | undefined>
  ) {
    const results: TOutput[] = []

    // * Get the result's S3 Path from Athena
    const { QueryExecution: response } = await this.#athenaClient.send(
      new GetQueryExecutionCommand({ QueryExecutionId: commandId })
    )

    // * Get the object from S3 as a stream
    const parameters = getS3PathParameters(defined(response?.ResultConfiguration?.OutputLocation))
    const { Body: body } = await this.#s3Client.send(new GetObjectCommand(parameters))

    const stream = defined(body) as Readable

    for await (const row of stream.pipe(csvParse({ headers: true }))) {
      const processedItem = await processItem(row as TInput)

      if (processedItem) {
        results.push(processedItem)
      }
    }

    return results
  }
}

const getS3PathParameters = (s3Path: string) => {
  const [, Bucket, Key] = extractValues(s3Path, S3_OBJECT_REGEX)
  return { Bucket, Key }
}

const withTimeout = <T>(runnable: () => Promise<T>, secondsToWait: number, onFailure: () => Promise<void>) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Function execution timed out'))
    }, secondsToWait * 1000)

    return void runnable()
      .then((result) => {
        clearTimeout(timeoutId)
        return void resolve(result)
      })
      .catch((error) => {
        log.error(error)
        return onFailure()
      })
      .finally(() => {
        clearTimeout(timeoutId)
      })
  }).catch((error) => {
    log.error(error)
    return onFailure()
  })
}
