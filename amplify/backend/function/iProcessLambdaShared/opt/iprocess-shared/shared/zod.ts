import { sortBy } from 'remeda'
import { Merge } from 'type-fest'
import { AnyZodObject, z, ZodType, ZodTypeAny, ZodTypeDef } from 'zod'

import { Bool, TimeRange, Type } from '../graphql/API.js'

import type { DayJS } from './datetime.js'
import { dateParser, DateTimeParser, dateTimeParser, durationInMinutesParser, timeParser } from './time.js'
import { DateTimeRange, Nullable } from './types.js'

type ZodShape<T> = Record<keyof T, ZodTypeAny>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ZodExactShape<T, S> = { [P in keyof S]: P extends keyof T ? ZodType<T[P], any, any> : never }

// * --- Scalar Schemas ---

export const ZodPlaceholder = z.unknown().transform((_) => undefined)
export const EmptyZodObject = z.object({})

export const NonEmptyString = z.string().min(1)
export const MaybeEmptyString = z.string().transform((_) => (_.trim().length === 0 ? undefined : _))
export const NonNegativeNumber = z.number().min(0)
export const PositiveNumber = z.number().positive()

// * --- Utilities ---

// * Overrides the '.default' method by replacing null & undefined with the default value (https://zod.dev/?id=default)
export const defaultOf = <I, O>(parser: ZodType<O, ZodTypeDef, I>, defaultValue: O) =>
  parser.nullish().transform((_) => _ ?? defaultValue) as typeof parser

/**
 *
 * Creates an object parser that ensures the parser's shape has the exact same fields than the specified type
 *
 * @see {@link https://github.com/colinhacks/zod/issues/372#issuecomment-1688487683 `zod` issue in GitHub}
 */
export const parse = <T extends object>() => ({
  with: <S extends ZodShape<T> & ZodExactShape<T, S>>(shape: S) => z.object(shape)
})

/**
 * Creates an {@link z.ZodObject object parser} that only parses some attributes while inferring the others from an
 * existing type.
 *
 * This is useful when we handle data fetched from AppSync yet we need additional validations (e.g. create a new Date
 * instance from an 'AWSDateTime' string from AppSync)
 *
 */
export const objectOf = <I extends AnyZodObject>(parser: I) => ({
  withType: <O extends object>() => parser.passthrough().transform((_) => _ as Merge<O, z.infer<typeof parser>>)
})

export const arrayOf = <I, O>(parser: ZodType<O, ZodTypeDef, I>, defaultValues: O[] = []) =>
  defaultOf(z.array(parser), defaultValues)

const safeParse = <I, O>(parser: ZodType<O, ZodTypeDef, I>, value: unknown) => {
  const result = parser.safeParse(value)
  return result.success ? result.data : undefined
}

export const parseRawJSON = NonEmptyString.nullish().transform((_) => JSON.parse(_ ?? '{}'))

export const parseArray = <I, O>(parser: ZodType<O, ZodTypeDef, I>, values: unknown[]) => {
  const results = []

  for (const value of values) {
    const data = safeParse(parser, value)
    if (data) results.push(data)
  }

  return results
}

// * --- Schemas for API types ---

export const BoolSchema = z.nativeEnum(Bool)

export const DurationSchema = z
  .string()
  .min(1)
  .nullish()
  .transform((_) => durationInMinutesParser(_))

const zodTemporalParser = (parser: DateTimeParser<DayJS> = dateTimeParser) =>
  z
    .string()
    .refine(
      (_) => parser(_).isValid(),
      (_) => ({ message: `Value ${_} is not a valid DateTime` })
    )
    .transform((_) => parser(_))

export const zodDateTimeParser = zodTemporalParser()

export const zodDateParser = zodTemporalParser(dateParser)

export const zodTimeParser = zodTemporalParser(timeParser)

// eslint-disable-next-line unicorn/no-object-as-default-parameter
export const BaseAWSType = ({ strict } = { strict: false }) =>
  z.object({
    id: strict ? defaultOf(z.string(), undefined) : NonEmptyString,
    createdAt: NonEmptyString,
    updatedAt: NonEmptyString
  })

export const WithUnitID = z.object({ unitId: NonEmptyString })

export const WithPartID = z.object({ partId: NonEmptyString })

export const DateTimeRangeSchema = parse<DateTimeRange>().with({
  dateTimeStartUTC: zodDateTimeParser,
  dateTimeEndUTC: zodDateTimeParser,
  downtime: defaultOf(z.number(), undefined)
})

// ? 'ExtendedDateTimeRange'
export const ExtendedDateTimeRangeSchema = DateTimeRangeSchema.extend({ type: z.nativeEnum(Type) })

export const TimeRangeSchema: z.ZodType<TimeRange> = z.object({
  startDateTime: z.string().datetime(),
  endDateTime: z.string().datetime()
})

export const conditionallySortArray = <I, O extends { index?: Nullable<number> }>(
  parser: ZodType<O, ZodTypeDef, I>,
  values: unknown[],
  defaultSort: (values: O[]) => O[]
): O[] => {
  const response = z
    .array(parser)
    .transform((items) => {
      const hasIndex = items.some(({ index }) => typeof index === 'number')
      return hasIndex ? sortBy(items, (item) => item.index || 0) : defaultSort(items)
    })
    .safeParse(values)
  if (response.success) {
    return response.data
  }
  console.error(response.error)
  return values as O[]
}
