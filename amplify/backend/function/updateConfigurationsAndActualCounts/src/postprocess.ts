import { match, P } from 'ts-pattern'
import { drop, last, noop, take, uniq } from 'remeda'

import { AppError, UpdateItemHandler, defined, GenericItemsToUpdate, durationIn, DateTimeRange } from 'iprocess-shared'
import { SplitPosition, CreateActualCountInput, UpdateActualCountInput, Type } from 'iprocess-shared/graphql/index.js'
import { DayJS } from 'iprocess-shared/shared/datetime.js'

import { ZodConfiguredScheduleSlot, ScheduleHourEnriched, ZodScheduleHour } from './types.js'
import { mergeSlots, toCreateActualCountInput } from './ops.js'
import { checkSplitPosition, setDateTimeRange, filterByTimeRange } from './time.js'

const { First, Middle, Last } = SplitPosition

export type ProcessedConfiguredScheduleSlots = GenericItemsToUpdate<CreateActualCountInput, UpdateActualCountInput>

export const processScheduleHours = (
  values: ZodScheduleHour[],
  shiftTimeRange: DateTimeRange<DayJS>,
  configurationTimeRange: DateTimeRange<DayJS>
) => {
  const results: ScheduleHourEnriched[] = []

  for (const scheduleHour of values) {
    const enrichedScheduleHour = setDateTimeRange(scheduleHour, shiftTimeRange)
    const timeRange = {
      dateTimeStartUTC: enrichedScheduleHour.dateTimeStartUTC,
      dateTimeEndUTC: enrichedScheduleHour.dateTimeEndUTC
    }

    // ! Beware! Here momentJS treats 'hoursStartUTC' as a datetime object instead of only time
    // TODO (VDD-533): Move JS filters to DynamoDB indexes
    if (filterByTimeRange(timeRange, shiftTimeRange, configurationTimeRange)) {
      const withDateTimeRange = checkSplitPosition(enrichedScheduleHour, configurationTimeRange)

      // ? Edge case: filter ScheduleHours where the duration in minutes is 0
      if (
        durationIn(withDateTimeRange.dateTimeStartUTC, withDateTimeRange.dateTimeEndUTC, { granularity: 'minutes' }) > 0
      ) {
        results.push(withDateTimeRange)
      }
    }
  }
  return results
}

export function parseConfiguredScheduleSlots(slots: ZodConfiguredScheduleSlot[]): ZodConfiguredScheduleSlot[] {
  const result = take(slots, 1)
  const items = drop(slots, 1)

  let previous: ZodConfiguredScheduleSlot

  for (const slot of items) {
    previous = defined(last(result))

    match([slot.split, previous.split] as const)
      .with([undefined, First], () => {
        slot.split = Last
      })
      .with([Last, undefined], () => {
        previous.split = First
      })
      .with(
        P.union([undefined, P._], [First, P._], [Middle, Middle], [Middle, First], [Last, First], [Last, Middle]),
        noop
      )
      .with(P.union([Middle, Last], [Last, Last], [Middle, undefined]), ([slotSplit, previous]) => {
        throw new AppError(
          `Unexpected case ${slotSplit} and ${previous} (ConfiguredSchuleSlot with ID ${slot.id})`,
          500
        )
      })
      .exhaustive()

    result.push(slot)
  }

  return result
}

export const processSlots: UpdateItemHandler<
  ZodConfiguredScheduleSlot,
  Record<string, never>,
  ProcessedConfiguredScheduleSlots,
  ZodConfiguredScheduleSlot
> = (slots, slotsInDatabase, _) => {
  const itemsToCreate = [] as CreateActualCountInput[]
  const itemsToUpdate = [] as UpdateActualCountInput[]
  const availableSlotIds = uniq(slotsInDatabase.map((_) => defined(_.id)))

  for (const item of slots) {
    const itemToUpdate = findItemToUpdate(slotsInDatabase, item)

    if (itemToUpdate) {
      itemsToUpdate.push(itemToUpdate)
    } else {
      itemsToCreate.push(toCreateActualCountInput(item))
    }
  }

  // ? Only delete the ones not being updated
  const itemsToDelete = availableSlotIds.filter((_) => !itemsToUpdate.some(({ id }) => _ === id))

  return { itemsToCreate, itemsToUpdate, itemsToDelete }
}

export const findItemToUpdate = (
  slotsInDatabase: ZodConfiguredScheduleSlot[],
  item: ZodConfiguredScheduleSlot
): UpdateActualCountInput | undefined => {
  const maybeMatch = slotsInDatabase.find(
    (_) =>
      item.unitId === _.unitId &&
      item.dateTimeStartUTC.isSame(_.dateTimeStartUTC) &&
      item.dateTimeEndUTC.isSame(_.dateTimeEndUTC) &&
      item.type === _.type &&
      item.type === Type.Production // ? Both are equal on type, which is 'Production'
  )

  return maybeMatch ? mergeSlots(maybeMatch, item) : undefined
}
