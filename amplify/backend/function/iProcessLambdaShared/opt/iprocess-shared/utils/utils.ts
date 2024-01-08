import type { LogLevelNames } from 'loglevel'
import log from 'loglevel'
import moment, { Moment } from 'moment'

import { DayJS } from 'iprocess-shared/shared/datetime.js'

import { DeleteInput, DuplicateInput } from '../graphql/API.js'
import { MaybeID, Nullable, Ordering, WithID, isDefined, isNullish } from '../shared/types.js'

import { LambdaArguments } from './template.js'

export const dropEmptyStrings = <T>(item: unknown): T =>
  // eslint-disable-next-line unicorn/no-null
  JSON.parse(JSON.stringify(item ?? null, (_, value: unknown) => (value === '' ? null : value))) as T

export const getEvent = <T extends object>(_: LambdaArguments<T>): T => dropEmptyStrings(_.arguments)

interface ResolverEvent {
  put?: Nullable<MaybeID>
  delete?: Nullable<DeleteInput>
  duplicate?: Nullable<DuplicateInput>
}

export const isCreateResolverEvent =
  <I extends ResolverEvent, O extends I>() =>
  (event: I): event is O =>
    isDefined(event.put) && isNullish(event.delete) && isNullish(event.duplicate) && isNullish(event.put.id)

export const isUpdateResolverEvent =
  <I extends ResolverEvent, O extends I>() =>
  (event: I): event is O =>
    isDefined(event.put) && isNullish(event.delete) && isNullish(event.duplicate) && isDefined(event.put.id)

export const isDeleteResolverEvent =
  <I extends ResolverEvent, O extends I>() =>
  (event: I): event is O =>
    isNullish(event.put) && isDefined(event.delete) && isNullish(event.duplicate)

export const isDuplicateResolverEvent =
  <I extends ResolverEvent, O extends I>() =>
  (event: I): event is O =>
    isNullish(event.put) && isNullish(event.delete) && isDefined(event.duplicate)

/** @deprecated Please use 'compareItems' */
export interface GenericItemsToUpdate<ItemsToCreate = unknown, ItemsToUpdate = unknown> {
  itemsToCreate: ItemsToCreate[]
  itemsToUpdate: ItemsToUpdate[]
  itemsToDelete: string[]
}

/** @deprecated Please use 'compareItems' */
export type UpdateItemHandler<
  I,
  A extends object,
  O extends GenericItemsToUpdate,
  D extends object | string = string
> = (inputItems: I[], itemsInDatabaseIds: D[], attributesToUpdate: A) => O

type GetIDsFunction<TDatabase extends WithID = WithID, TUpdateItem extends WithID = WithID> = (
  itemsFromDatabase: TDatabase[],
  updatedItems: TUpdateItem[]
) => WithID[]

const keepNotUpdatedIDs: GetIDsFunction = (itemsFromDatabase, updatedItems) =>
  // * It must ONLY contain an attribute 'id', nothing more
  itemsFromDatabase.filter((_) => !updatedItems.some(({ id }) => id === _.id)).map(({ id }) => ({ id }))

const findByID = <TClient extends object, TDatabase extends WithID>(item: TClient, itemsFromDatabase: TDatabase[]) =>
  'id' in item ? itemsFromDatabase.find(({ id }) => id === item.id) : undefined

export const compareItems = <
  TClient extends object,
  TDatabase extends WithID,
  Attributes,
  TCreateItem,
  TUpdateItem extends WithID
>(
  itemsFromClient: TClient[],
  itemsFromDatabase: TDatabase[],
  attributes: Attributes,
  addCreateItem: (item: TClient, attributes: Attributes) => TCreateItem,
  addUpdateItem: (item: TClient, attributes: Attributes, match: TDatabase) => TUpdateItem,
  find: (item: TClient, itemsFromDatabase: TDatabase[]) => TDatabase | undefined = findByID,
  getIDsToDelete: GetIDsFunction<TDatabase, TUpdateItem> = keepNotUpdatedIDs
) => {
  const itemsToCreate: TCreateItem[] = []
  const itemsToUpdate: TUpdateItem[] = []

  for (const item of itemsFromClient) {
    const match = find(item, itemsFromDatabase)
    if (match) {
      itemsToUpdate.push(addUpdateItem(item, attributes, match))
    } else {
      itemsToCreate.push(addCreateItem(item, attributes))
    }
  }

  return { itemsToCreate, itemsToUpdate, itemsToDelete: getIDsToDelete(itemsFromDatabase, itemsToUpdate) }
}

const throwOnUndefined = (key: string) => {
  throw new ReferenceError(`${key} key is not an environment variable`)
}

// ? Retrieves an environment variable, or an error if it's not available
export const fromEnvironment = <T = string>(key: string, onUndefined: (key: string) => T = throwOnUndefined) => {
  const value = process.env[key]
  return value || onUndefined(key)
}

export const isDebugModeEnabled = (): boolean => fromEnvironment('DEBUG', () => 'false').toLowerCase() === 'true'

export const getLogLevel = (): LogLevelNames => (isDebugModeEnabled() ? 'debug' : 'info')

export const sortByDateTimeDayJS =
  <T extends object>(getDateTimeField: (_: T) => DayJS) =>
  (a: T, b: T) =>
    getDateTimeField(a).diff(getDateTimeField(b))

export const sortByDateTime =
  <T extends object>(getDateTimeField: (_: T) => DayJS): Ordering<T> =>
  (a, b) =>
    -getDateTimeField(a).diff(getDateTimeField(b))

/**
 * @deprecated Use {@link sortByDateTime}
 */
export const legacySortByDateTime =
  <T extends object>(getDateTimeField: (_: T) => Moment | string) =>
  (firstValue: T, secondValue: T) => {
    const start1 = moment(getDateTimeField(firstValue))
    const start2 = moment(getDateTimeField(secondValue))

    return start1.isBefore(start2) ? -1 : start2.isBefore(start1) ? 1 : 0
  }

export const allArraysHaveData = (...values: Nullable<unknown[]>[]) => values.every((_) => (_?.length || 0) > 0)

export const batchOperation = async <T>(
  operation: (_: T) => Promise<unknown>,
  name: string,
  items: T[],
  batchSize: number = 100
) => {
  let totalItemsUpdated = 0
  let remainingItems = items

  do {
    const batch = remainingItems.slice(0, batchSize)
    remainingItems = remainingItems.slice(batchSize)

    log.debug(`Running ${name}. Current index: ${totalItemsUpdated}`)
    await Promise.all(batch.map(async (_) => await operation(_)))

    totalItemsUpdated += batch.length
  } while (remainingItems.length > 0)

  return totalItemsUpdated
}
