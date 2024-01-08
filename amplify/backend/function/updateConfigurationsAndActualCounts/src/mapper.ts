/* c8 ignore start */
import { Get } from 'type-fest'
import log from 'loglevel'

import {
  AppSyncClient,
  DATETIME_FORMAT,
  defined,
  getScanParameters,
  DateTimeRange,
  sortByDateTimeDayJS
} from 'iprocess-shared'
import { DayJS } from 'iprocess-shared/shared/datetime.js'
import {
  GetPartQuery,
  CreateConfigurationMutation,
  CreateActualCountMutation,
  CreateConfigurationInput,
  CreateActualCountInput,
  DeleteConfigurationMutation,
  GetPartQueryVariables,
  CreateConfigurationMutationVariables,
  DeleteConfigurationMutationVariables,
  CreateActualCountMutationVariables,
  DeleteActualCountMutationVariables,
  UpdateActualCountMutationVariables,
  UpdateActualCountInput,
  CalculateShiftTargetCustomQuery,
  CalculateShiftTargetCustomQueryVariables,
  ScheduleHoursByShiftQuery as ScheduleHoursQuery,
  ScheduleHoursByShiftQueryVariables as ScheduleHoursQueryVariables,
  ScheduleSlotByUnitAndDateTimeStartQueryVariables as ScheduleSlotsQueryVariables,
  ScheduleSlotByUnitAndDateTimeStartQuery as ScheduleSlotsQuery
} from 'iprocess-shared/graphql/index.js'
import {
  getPart,
  scheduleSlotByUnitAndDateTimeStart,
  scheduleHoursByShift,
  calculateShiftTargetCustom
} from 'iprocess-shared/graphql/queries/index.js'
import {
  createActualCount,
  createConfiguration,
  deleteActualCount,
  deleteConfiguration,
  updateActualCount
} from 'iprocess-shared/graphql/mutations/index.js'

import { ConfiguredScheduleSlotSchema, ScheduleHourSchema, ShiftData, ScheduleHourResults } from './types.js'
import { processScheduleHours } from './postprocess.js'
import { checkSplitPosition, setDateTimeRange } from './time.js'

type ScheduleHoursValue = Get<ScheduleHoursQuery, ['scheduleSlotByUnitAndDateTimeStart', 'items', '0']>

const connector = new AppSyncClient()

export async function scanConfiguredScheduleSlots(unitId: string, validFrom: DayJS, validUntil: DayJS) {
  const items = await connector.scan<ScheduleSlotsQuery, ScheduleSlotsQueryVariables, ScheduleHoursValue>(
    scheduleSlotByUnitAndDateTimeStart,
    getScanParameters,
    {
      unitId,
      dateTimeStartUTC: {
        between: [validFrom.format(DATETIME_FORMAT), validUntil.format(DATETIME_FORMAT)]
      }
    }
  )

  return items.map((_) => ConfiguredScheduleSlotSchema.parse(_))
}

export async function scanScheduleHoursWithDateTime(
  variables: ShiftData,
  shiftTimeRange: DateTimeRange<DayJS>,
  configurationTimeRange: DateTimeRange<DayJS>
): Promise<ScheduleHourResults> {
  const response = await connector.scan<ScheduleHoursQuery, ScheduleHoursQueryVariables, ScheduleHoursValue>(
    scheduleHoursByShift,
    (_) => {
      const values = _.getShiftModel?.scheduleHours
      return { items: values?.items || [], nextToken: values?.nextToken }
    },
    variables
  )

  const items = response.map((_) => ScheduleHourSchema.parse(_)).sort(sortByDateTimeDayJS((_) => _.hoursStartUTC))

  const scheduleHours = processScheduleHours(items, shiftTimeRange, configurationTimeRange)
  const scheduleHoursForWholeShift = items.map((_) => checkSplitPosition(setDateTimeRange(_, shiftTimeRange)))

  log.debug(
    'ScheduleHour data for configuration',
    JSON.stringify({
      variables,
      configurationTimeRange,
      items,
      scheduleHours
    })
  )

  return { scheduleHours, scheduleHoursForWholeShift }
}

export async function getPartFromId(id: string) {
  const variables = { id }
  const result = await connector.get<GetPartQuery, GetPartQueryVariables>(getPart, variables)
  return defined(result.getPart)
}

export async function createConfigurationFromItem(
  input: CreateConfigurationInput
): Promise<CreateConfigurationMutation> {
  const variables = { input }
  return await connector.mutate<CreateConfigurationMutation, CreateConfigurationMutationVariables>(
    createConfiguration,
    variables
  )
}

export async function deleteConfigurationFromId(configurationId: string): Promise<DeleteConfigurationMutation> {
  const variables = { input: { id: configurationId } }
  return await connector.mutate<DeleteConfigurationMutation, DeleteConfigurationMutationVariables>(
    deleteConfiguration,
    variables
  )
}

export async function createConfiguredScheduleSlot(input: CreateActualCountInput): Promise<CreateActualCountMutation> {
  const variables = { input }
  return await connector.mutate<CreateActualCountMutation, CreateActualCountMutationVariables>(
    createActualCount,
    variables
  )
}

export async function updateConfiguredScheduleSlot(input: UpdateActualCountInput): Promise<void> {
  const variables = { input }
  await connector.mutate<unknown, UpdateActualCountMutationVariables>(updateActualCount, variables)
}

export async function deleteConfiguredScheduleSlotFromId(id: string): Promise<void> {
  const variables = { input: { id } }
  await connector.mutate<unknown, DeleteActualCountMutationVariables>(deleteActualCount, variables)
}

export const getShiftTarget = async (variables: CalculateShiftTargetCustomQueryVariables): Promise<number> => {
  const response = await connector.get<CalculateShiftTargetCustomQuery, CalculateShiftTargetCustomQueryVariables>(
    calculateShiftTargetCustom,
    variables
  )

  return defined(response.calculateShiftTargetCustom)
}

/* c8 ignore stop */
