// 3rd party libs
import type { Merge } from 'type-fest'
import { z } from 'zod'

// Lambda Layer
import {
  allArraysHaveData,
  arrayOf,
  lambdaInput,
  NonEmptyString,
  ParetoProductData,
  zodDateParser
} from 'iprocess-shared'
import { CalculateDisruptionKPIsInput, Shift } from 'iprocess-shared/graphql/index.js'

const BaseEventSchema = z
  .object({
    startDate: zodDateParser.transform((_) => _.startOf('day')),
    endDate: zodDateParser.transform((_) => _.add(1, 'day').startOf('day')),
    shifts: arrayOf(z.nativeEnum(Shift), Object.values(Shift))
  })
  .passthrough()
  .transform((_) => _ as Merge<CalculateDisruptionKPIsInput, typeof _>)

export const EventSchema = lambdaInput(
  BaseEventSchema.transform((_) => {
    const { unitIds, shifts, disruptionTypes, disruptionDescriptions, disruptionCategories } = _

    return allArraysHaveData(unitIds, shifts, disruptionTypes, disruptionDescriptions, disruptionCategories)
      ? _
      : undefined
  })
)

export type Event = NonNullable<z.infer<typeof EventSchema>>

export const ParetoProductsSchema = z
  .string()
  .transform((_) => JSON.parse(_))
  .pipe(
    arrayOf(
      z
        .tuple([NonEmptyString, NonEmptyString])
        .transform(([name, number]) => ({ name, number }) satisfies ParetoProductData)
    )
  )
