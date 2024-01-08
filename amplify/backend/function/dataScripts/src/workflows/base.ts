import log from 'loglevel'

import { AppSyncClient, DynamoDBClient, batchOperation } from 'iprocess-shared'

export type ScanOperation<T extends object, I extends [...unknown[]] = unknown[]> = (...args: I) => Promise<T[]>

export type UpdateOperation<T extends object> = (item: T, persistToDB: boolean) => Promise<unknown>

export interface ScriptInfo {
  tableName: string
  version: string
  updatedAt: string // * follows 'YYYY-MM-DD' format
}

export const client = new DynamoDBClient()
export const connector = new AppSyncClient()

export const updateTableBuilder = async <T>(
  { tableName, version, updatedAt }: ScriptInfo,
  scanOperation: () => Promise<T[]>,
  updateOperation: (_: T) => Promise<unknown>,
  batchSize: number = 100
) => {
  log.info(`Starting script targeting table ${tableName} (version ${version}, updated at ${updatedAt})`)

  const all = await scanOperation()
  log.info(`Scanned ${all.length} items from ${tableName} table`)

  // ! TODO: Replace 'batchOperation' with DynamoDB batch operation (better perf & way cheaper)
  const numberOfItemsUpdated = await batchOperation(updateOperation, `update${tableName}Table`, all, batchSize)

  return `Succesfully updated ${numberOfItemsUpdated} ${tableName} table items`
}
