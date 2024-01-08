import { Bool } from '../graphql/API.js'

import type { Nullable } from './types.js'

/** @deprecated use {@link sumBy} from remeda */
export const sumAggregation = <T>(
  values: T[],
  transform: (_: T) => number | undefined,
  initialValue: number = 0,
  defaultValue: number = 0
): number => values.reduce((previous, current) => previous + (transform(current) || defaultValue), initialValue)

// * --- Bool utils ---

export const asBoolean = (value: Nullable<Bool>) => value === Bool.yes
export const fromBoolean = (value: Nullable<boolean>) => (value ? Bool.yes : Bool.no)

// * --- Number utils ---

// ? Type narrowing numbers to exclude NaN, Infinity, and -Infinity
export const RealNumber = (value: Nullable<number>, onErrorMessage: string = '', defaultValue: number = 0) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  } else {
    console.debug(`Invalid value ${value} ${onErrorMessage}. Defaulting to ${defaultValue}`)
    return defaultValue
  }
}

export const toNumber = (value: unknown) => RealNumber(Number(value))

export const round = (value: number, digits: number = 2, onErrorMessage: string = 'on round()') =>
  RealNumber(Number(value.toFixed(digits)), onErrorMessage)

export type RangeInclusivity = '()' | '[)' | '(]' | '[]'

export const isBetween = (value: number, a: number, b: number, inclusivity: RangeInclusivity = '[]') => {
  switch (inclusivity) {
    case '()':
      return value > a && value < b
    case '(]':
      return value > a && value <= b
    case '[)':
      return value >= a && value < b
    case '[]':
      return value >= a && value <= b
  }
}
