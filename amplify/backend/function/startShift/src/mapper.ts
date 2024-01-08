import log from 'loglevel'
import { Get } from 'type-fest'

import { AppSyncClient, getScanParameters } from 'iprocess-shared'

import type {
  CreateActualCountInput,
  CreateActualCountMutationVariables,
  CreateConfigurationInput,
  Shift,
  CreateConfigurationMutationVariables,
  ScheduleHoursByShiftQuery as ScheduleHoursQuery,
  ScheduleHoursByShiftQueryVariables as ScheduleHoursQueryVariables,
  TimeSlotsByUnitAndDateTimeStartCountQuery as TimeSlotsQuery,
  TimeSlotsByUnitAndDateTimeStartCountQueryVariables as TimeSlotsQueryVariables,
  TimeRange
} from 'iprocess-shared/graphql/index.js'
import { scheduleHoursByShift, timeSlotsByUnitAndDateTimeStartCount } from 'iprocess-shared/graphql/queries/index.js'
import { createActualCount, createConfiguration } from 'iprocess-shared/graphql/mutations/index.js'

import { ScheduleHourSchema } from './types.js'

const connector = new AppSyncClient()

type ScheduleHoursValues = Get<ScheduleHoursQuery, ['getShiftModel', 'scheduleHours', 'items', '0']>
type TimeSlotValues = Get<TimeSlotsQuery, ['scheduleSlotByUnitAndDateTimeStart', 'items', '0']>

export const listScheduleHours = async (shiftModelId: string, shiftType: Shift) => {
  const response = await connector.scan<ScheduleHoursQuery, ScheduleHoursQueryVariables, ScheduleHoursValues>(
    scheduleHoursByShift,
    (_) => {
      const values = _.getShiftModel?.scheduleHours
      return { items: values?.items || [], nextToken: values?.nextToken }
    },
    { shiftModelId, shiftType }
  )

  const result = response.map((_) => ScheduleHourSchema.parse(_))
  log.debug('Schedule hours retrieved from DB', { shiftModelId, shiftType, count: result.length })

  return result
}

export const listTimeSlotsPerShift = async (unitId: string, { startDateTime, endDateTime }: TimeRange, type: Shift) =>
  await connector.scan<TimeSlotsQuery, TimeSlotsQueryVariables, TimeSlotValues>(
    timeSlotsByUnitAndDateTimeStartCount,
    getScanParameters,
    {
      unitId,
      dateTimeStartUTC: { between: [startDateTime, endDateTime] },
      filter: { shift: { eq: type } }
    }
  )

export const createConfigurationItem = async (input: CreateConfigurationInput) =>
  await connector.mutate<unknown, CreateConfigurationMutationVariables>(createConfiguration, { input })

export const createActualCountItem = async (input: CreateActualCountInput) =>
  await connector.mutate<unknown, CreateActualCountMutationVariables>(createActualCount, { input })
