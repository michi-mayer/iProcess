/* c8 ignore start */
import { match } from 'ts-pattern'
import { uniqWith } from 'remeda'
import { Get } from 'type-fest'
import log from 'loglevel'

import {
  DynamoDBClient,
  AppSyncClient,
  definedArray,
  defined,
  DATETIME_FORMAT,
  DATE_FORMAT,
  fromEnvironment,
  isAfterMidnight,
  nonEmptyArray,
  DynamoDBItem,
  DynamoDBIndex,
  getScanParameters,
  parseArray,
  ShiftSlotKey,
  getDates,
  isNonEmptyArray
} from 'iprocess-shared'
import {
  Bool,
  Type,
  Defective,
  Shift,
  actualCount as ActualCount,
  disruption as Disruption,
  OeeIdsByUnitAndDateTimeUTCQueryVariables as OeeIDsQueryVariables,
  OeeIdsByUnitAndDateTimeUTCQuery as OeeIDsQuery
} from 'iprocess-shared/graphql/index.js'
import type {
  CreateOEEInput,
  DeleteOEECustomMutationVariables as DeleteOEEMutationVariables,
  UpdateOEEInput,
  UpdateOEECustomMutationVariables as UpdateOEEMutationVariables,
  CreateOEECustomMutationVariables as CreateOEEMutationVariables,
  CreateOEECustomMutation as CreateOEEMutation
} from 'iprocess-shared/graphql/index.js'
import { oeeIdsByUnitAndDateTimeUTC } from 'iprocess-shared/graphql/queries/index.js'
import {
  createOEECustom as createOEE,
  deleteOEECustom as deleteOEE,
  updateOEECustom as updateOEE
} from 'iprocess-shared/graphql/mutations/index.js'
import { dayjs, DayJS } from 'iprocess-shared/shared/datetime.js'

import { tracer } from './services/tracer.js'
import { sortByUpdatedAt, TimeRange, updateDuration } from './time.js'
import type { ZodDisruption } from './types.js'
import { DefectiveSchema, DisruptionSchema, OEESchema, TimeSlotSchema } from './types.js'

type OeeIDsValue = NonNullable<Get<OeeIDsQuery, ['listOEEsByUnitIdAndTimeDateUTC', 'items', '0']>>

const TIME_SLOT_TABLE = fromEnvironment('API_ERFASSUNGSAPP_ACTUALCOUNTTABLE_NAME')
const DEFECTIVE_TABLE = fromEnvironment('API_ERFASSUNGSAPP_DEFECTIVETABLE_NAME')
const DISRUPTION_TABLE = fromEnvironment('API_ERFASSUNGSAPP_DISRUPTIONTABLE_NAME')

const dynamoDBClient = new DynamoDBClient(tracer)
const connector = new AppSyncClient()

const { morningShift, afternoonShift, nightShift } = Shift

export const scanTimeSlotsByUpdatedAt = async ({ start, end }: TimeRange) => {
  const response = await listUpdatedItemsOn(TIME_SLOT_TABLE, 'timeSlotByDeletedAndUpdatedAt', start, end)
  return parseArray(TimeSlotSchema, response)
}

export const scanDisruptionsByUpdatedAt = async ({ start, end }: TimeRange) => {
  const response = await listUpdatedItemsOn(DISRUPTION_TABLE, 'disruptionsByDeletedAndUpdatedAt', start, end)
  return parseArray(DisruptionSchema, response)
}

export const scanDefectivesByUpdatedAt = async ({ start, end }: TimeRange) => {
  const response = await listUpdatedItemsOn(DEFECTIVE_TABLE, 'defectivesByDeletedAndUpdatedAt', start, end)
  return parseArray(DefectiveSchema, response)
}

const listUpdatedItemsOn = async <T extends DynamoDBItem>(
  tableName: string,
  indexName: DynamoDBIndex,
  start: DayJS,
  end: DayJS
) =>
  await dynamoDBClient.scan<T>({
    TableName: tableName,
    IndexName: indexName,
    FilterExpression: 'deleted = :deleted AND (#updatedAt BETWEEN :start AND :end)',
    ExpressionAttributeNames: {
      '#updatedAt': 'updatedAt'
    },
    ExpressionAttributeValues: {
      ':start': start.toISOString(),
      ':end': end.toISOString(),
      ':deleted': Bool.no
    }
  })

/**
 * ? Retrieves all timeslots linked to a ShiftPeriod.
 *
 * ? If it's a night shift, then it gets first all timeslots before midnight, then all timeslots after midnight, as the
 * ? referenced date is different for each group; and then it combines all timeslots
 */
export const fetchTimeSlots = async ({ unitId, date, type }: ShiftSlotKey) => {
  const parameters = getDates({ date, type })
  const timeslots = await match(parameters)
    .with({ type: morningShift }, async (_) => await getShiftTimeslots(unitId, _.currentDate, type))
    .with({ type: afternoonShift }, async (_) => await getShiftTimeslots(unitId, _.currentDate, type))
    .with({ type: nightShift }, async (_) => await getNightShiftTimeSlots(unitId, _.currentDate, _.nextDate))
    .exhaustive()

  if (isNonEmptyArray(timeslots)) {
    log.debug(`Got ${timeslots.length} timeslots for`, JSON.stringify({ unitId, parameters }))

    const earliestStart = dayjs.min(timeslots.map((_) => _.dateTimeStartUTC))
    const latestEnd = dayjs.max(timeslots.map((_) => _.dateTimeEndUTC))

    return {
      timeRange: new TimeRange(earliestStart, latestEnd),
      slots: timeslots.filter((_) => _.type === Type.Production)
    }
  }

  log.warn('Got 0 timeslots for', JSON.stringify({ unitId, parameters }))
  return { timeRange: TimeRange.empty(), slots: [] }
}

const getShiftTimeslots = async (unitId: string, date: DayJS, shiftType: Shift) => {
  const items = await dynamoDBClient.scan<ActualCount>({
    TableName: TIME_SLOT_TABLE,
    FilterExpression: 'unitId = :unitId AND shift = :shiftType AND begins_with(dateTimeStartUTC, :date)',
    ExpressionAttributeValues: {
      ':unitId': unitId,
      ':date': date.format(DATE_FORMAT),
      ':shiftType': shiftType
    }
  })

  return items.map((_) => TimeSlotSchema.parse(_))
}

const getNightShiftTimeSlots = async (unitId: string, currentDate: DayJS, nextDate: DayJS) => {
  const currentDateSlots = await getShiftTimeslots(unitId, currentDate, nightShift)
  const nextDateSlots = await getShiftTimeslots(unitId, nextDate, nightShift)

  const currentDateBeforeMidnightSlots = currentDateSlots.filter((_) => !isAfterMidnight(_.dateTimeStartUTC))
  const nextDateAfterMidnightSlots = nextDateSlots.filter((_) => isAfterMidnight(_.dateTimeStartUTC))

  if (currentDateBeforeMidnightSlots)
    log.debug('Timeslots before midnight are', JSON.stringify(currentDateBeforeMidnightSlots))

  if (nextDateAfterMidnightSlots) log.debug('Timeslots after midnight are', JSON.stringify(nextDateAfterMidnightSlots))

  return [...currentDateBeforeMidnightSlots, ...nextDateAfterMidnightSlots]
}

/**
 * * A disruption COULD start e.g. in the morning shift and end in the afternoon shift
 * ! Here it's handling the simplest case from the complex one - a disruption only spans at max over 2 sequential shifts
 * ! e.g. this code won't handle a disruption that starts in the morning shift and ends in the night shift
 */
export const getShiftPeriodFromDisruption = async (unitId: string, { start, end }: TimeRange) => {
  // ? In case the filters get an exact match on datetime fields, let's just add a second so they don't
  const startDatePlus1Second = start.clone().add(1, 'second').format(DATETIME_FORMAT)
  const endDatePlus1Second = end.clone().add(1, 'second').format(DATETIME_FORMAT)

  // * Get the timeslot belonging to the disruption's start datetime
  const startDateTimeTimeslots = await dynamoDBClient.scan<ActualCount>({
    TableName: TIME_SLOT_TABLE,
    FilterExpression: 'unitId = :unitId AND dateTimeStartUTC <= :start AND dateTimeEndUTC >= :end',
    ExpressionAttributeValues: {
      ':unitId': unitId,
      ':start': startDatePlus1Second,
      ':end': startDatePlus1Second
    }
  })

  const maybeFirstTimeslot = startDateTimeTimeslots.find((_) => _.shift)
  const firstTimeslot = maybeFirstTimeslot ? TimeSlotSchema.parse(maybeFirstTimeslot) : undefined

  // * Get the timeslot belonging to the disruption's end datetime
  const endDateTimeTimeslots = await dynamoDBClient.scan<ActualCount>({
    TableName: TIME_SLOT_TABLE,
    FilterExpression: 'unitId = :unitId AND dateTimeStartUTC <= :start AND dateTimeEndUTC >= :end',
    ExpressionAttributeValues: {
      ':unitId': unitId,
      ':start': endDatePlus1Second,
      ':end': endDatePlus1Second
    }
  })

  const maybeEndTimeslot = endDateTimeTimeslots.find((_) => _.shift)
  const secondTimeslot = maybeEndTimeslot ? TimeSlotSchema.parse(maybeEndTimeslot) : undefined

  return uniqWith(
    definedArray([firstTimeslot, secondTimeslot]),
    ({ dateTimeStartUTC: firstDate, shift: firstShift }, { dateTimeStartUTC: secondDate, shift: secondShift }) => {
      return firstShift === secondShift && firstDate.format(DATE_FORMAT) === secondDate.format(DATE_FORMAT)
    }
  ).map((_) => _.shift)
}

const createOEEFromItem = async (input: CreateOEEInput) => {
  const result = await connector.mutate<CreateOEEMutation, CreateOEEMutationVariables>(createOEE, { input })
  return defined(result?.createOEE).id
}

const updateOEEFromItem = async (input: UpdateOEEInput) =>
  await connector.mutate<unknown, UpdateOEEMutationVariables>(updateOEE, { input })

const deleteOEEFromItem = async (id: string) =>
  await connector.mutate<unknown, DeleteOEEMutationVariables>(deleteOEE, { input: { id } })

// * Makes sure to delete any matching OEE before writing a new one.
// * There should be only 1 OEE per unitId and time range
export const createOEEItem = async ({ unitId, startTimeDateUTC, endTimeDateUTC, ...input }: CreateOEEInput) => {
  const timeRange = TimeRange.fromString(startTimeDateUTC, endTimeDateUTC)
  const availableOEEs = await scanOEEs(unitId, timeRange)

  if (availableOEEs.length > 0) {
    const [id, ...toDelete] = nonEmptyArray(availableOEEs.sort(sortByUpdatedAt).map((_) => _.id))
    const updated: UpdateOEEInput = { ...input, unitId, startTimeDateUTC, endTimeDateUTC, id }

    log.info('Updating OEE:', { unitId, timeRange })
    await Promise.all([...toDelete.map(deleteOEEFromItem), updateOEEFromItem(updated)])

    return id
  } else {
    log.info('Creating OEE:', { unitId, timeRange })
    return await createOEEFromItem({ ...input, unitId, startTimeDateUTC, endTimeDateUTC })
  }
}

const scanOEEs = async (unitId: string, shiftTimeRange: TimeRange) => {
  const items = await connector.scan<OeeIDsQuery, OeeIDsQueryVariables, OeeIDsValue>(
    oeeIdsByUnitAndDateTimeUTC,
    getScanParameters,
    {
      unitId,
      startTimeDateUTCEndTimeDateUTC: {
        eq: {
          startTimeDateUTC: shiftTimeRange.start.toISOString(),
          endTimeDateUTC: shiftTimeRange.end.toISOString()
        }
      }
    }
  )

  return items.map((_) => OEESchema.parse(_))
}

export async function scanDisruptionsOnBoundaries(unitId: string, shiftTimeRange: TimeRange) {
  const items = await dynamoDBClient.scan<Disruption>({
    TableName: DISRUPTION_TABLE,
    FilterExpression:
      'template = :template AND deleted = :deleted AND unitId = :unitId AND ((startTimeDateUTC < :end AND endTimeDateUTC > :end) OR (startTimeDateUTC < :start AND endTimeDateUTC > :start))',
    ExpressionAttributeValues: {
      ':template': Bool.no,
      ':deleted': Bool.no,
      ':unitId': unitId,
      ':start': shiftTimeRange.start.toISOString(),
      ':end': shiftTimeRange.end.toISOString()
    }
  })

  return items.map((_) => updateDuration(DisruptionSchema.parse(_), shiftTimeRange)) // ! may be empty
}

export async function scanDisruptions(unitId: string, shiftTimeRange: TimeRange): Promise<ZodDisruption[]> {
  const items = await dynamoDBClient.scan<Disruption>({
    TableName: DISRUPTION_TABLE,
    FilterExpression:
      'template = :template AND deleted = :deleted AND unitId = :unitId AND startTimeDateUTC >= :start AND endTimeDateUTC <= :end',
    ExpressionAttributeValues: {
      ':template': Bool.no,
      ':deleted': Bool.no,
      ':unitId': unitId,
      ':start': shiftTimeRange.start.toISOString(),
      ':end': shiftTimeRange.end.toISOString()
    }
  })

  return items.map((_) => updateDuration(DisruptionSchema.parse(_), shiftTimeRange)) // ! may be empty
}

export async function scanDefectives(unitId: string, shiftTimeRange: TimeRange): Promise<Defective[]> {
  const items = await dynamoDBClient.scan<Defective>({
    TableName: DEFECTIVE_TABLE,
    FilterExpression: 'deleted = :deleted AND (dateTimeUTC BETWEEN :start AND :end) AND unitId = :unitId',
    ExpressionAttributeValues: {
      ':deleted': Bool.no,
      ':start': shiftTimeRange.start.toISOString(),
      ':end': shiftTimeRange.end.toISOString(),
      ':unitId': unitId
    }
  })

  return items // ! may be empty
}
/* c8 ignore start */
