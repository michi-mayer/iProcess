import type { CycleStation, Type } from 'API'
import type { Moment } from 'moment'
import type { DayJS } from './datetime'

// * --- Generic types ---

export type Brand<A, B> = A & { __brand: B }

export type RecordKey = keyof any // eslint-disable-line @typescript-eslint/no-explicit-any

export type Nullish = undefined | null

export type Nullable<T> = T | Nullish // ? The opposite of 'NonNullable' type

export type NullableRecord<T extends object> = { [P in keyof T]?: Nullable<T[P]> }

// ? Excludes 'null' for all the attributes of an object
export type NonNullFields<T extends object> = { [P in keyof T]: Exclude<T[P], null> }

// ? Discards all attributes of an object that are Nullable
export type Strict<T extends object> = {
  [K in keyof Required<T> as Pick<T, K> extends Required<Pick<T, K>> ? K : never]: T[K]
}

// ? https://en.wikipedia.org/wiki/Complement_(set_theory)#Relative_complement
type Difference<A extends object, B extends object> = Omit<A, keyof B>

// ? Ensures that all properties in Unwanted not present in Main are ever set
export type Exact<Main extends object, Unwanted extends object> = Main & {
  [key in keyof Difference<Unwanted, Main>]?: never
}

// ? Makes all attributes of an object required and non-nullable
export type Must<T extends object> = { [K in keyof T]-?: NonNullable<T[K]> }

export type NonEmptyArray<T> = T[] & { 0: T }

export type TupleOf<T, Length extends number> = [T, ...T[]] & { length: Length }
export type ArrayOf<T, Length extends number> = TupleOf<T, Length>

export interface NoID {
  id?: never
}

export interface MaybeID {
  id?: Nullable<string>
}

export interface WithID {
  id: string
}

export type Ordering<T> = (a: T, b: T) => number

// * --- Parsers (validation functions) ---

export const throwOnNullish =
  (additionalInfo: unknown = {}) =>
  (_: unknown) => {
    throw new Error(`Value is nullish. Additional info: ${JSON.stringify(additionalInfo)}`)
  }

// ? Ensures a value is not nullish. If it is, then it passes the value to a handler. By default, it throws an error
export const defined = <T>(value: Nullable<T>, onNullish: (_: Nullable<T>) => T = throwOnNullish()): T =>
  isNullish(value) ? onNullish(value) : value

// * Ensures an array is defined and all of its elements are defined too. It can be empty
export const definedArray = <T>(array: Nullable<Nullable<T>[]>): NonNullable<T>[] =>
  defined(array, () => []).filter(isDefined)

export const nonEmptyArray = <T>(array: Nullable<Nullable<T>[]>): NonEmptyArray<NonNullable<T>> => {
  const result = defined(array, () => []).filter(isDefined)

  if (result[0]) return result as NonEmptyArray<NonNullable<T>>
  else throw new Error('Array is empty')
}

// * --- Type guards (narrowing) ---

export const isNullish = (value: unknown): value is Nullish => typeof value === 'undefined' || value === null

// ? Checks if a value is not nullish
// * Only use it for type narrowing
export const isDefined = <T>(value: Nullable<T>): value is NonNullable<T> => !isNullish(value)

export const isNonEmptyArray = <T>(array: Nullable<Nullable<T>[]>): array is NonEmptyArray<T> =>
  defined(array, () => []).some(isDefined)

export const isArrayOfStrings = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((_) => typeof _ === 'string')
}

// * --- Shared types ---

export type CycleStationBase = Pick<CycleStation, 'id' | 'index' | 'name' | 'unitId'> & { isActive: boolean }

export interface ParetoProductData {
  name: string
  number: string
}

export interface Classifications {
  category?: Nullable<string>
  cause?: Nullable<string>
  type?: Nullable<string>
}

export interface ParetoData {
  id: string
  templateId: string
  unitId: string
  unitShortName: string
  cycleStationName: string
  description: string
  products: ParetoProductData[]
  totalDurationInMinutes: number
  frequency: number
  firstOccurrence: string
  classifications: string
  totalDuration: string
}

export enum CognitoRoles {
  Admin = 'admin',
  Manager = 'manager',
  Standard = 'standard'
}

export type CognitoAttributes =
  | 'sub'
  | 'custom:subdepartment'
  | 'zoneinfo'
  | 'address'
  | 'identities'
  | 'email_verified'
  | 'profile'
  | 'locale'
  | 'given_name'
  | 'family_name'
  | 'email'

export type OutputEventItem = Record<CognitoAttributes, Nullable<string>>

export interface DateTimeRange<T extends DayJS | Moment | (string | undefined) = DayJS | Moment> {
  dateTimeStartUTC: T
  dateTimeEndUTC: T
  downtime?: Nullable<number>
}

export interface ExtendedDateTimeRange<T extends DayJS | Moment | (string | undefined) = DayJS | Moment>
  extends DateTimeRange<T> {
  type: Type
}

export interface WithTypename<T extends string = string> {
  __typename: T
}

export interface TableInfo<T extends string = string> extends WithTypename<T>, WithID {
  createdAt?: string
  updatedAt?: string
}

export type NoTableInfo<T> = Omit<T, '__typename' | 'id' | 'createdAt' | 'updatedAt'>

export const removeTableInfo = <T extends TableInfo>({
  __typename,
  id: _id,
  createdAt: _createdAt,
  updatedAt: _updatedAt,
  ...rest
}: T): NoTableInfo<T> => rest
