/* c8 ignore start */
import { v4 as uuidv4 } from 'uuid'
import log from 'loglevel'

import { AppError, getLogLevel, lambdaHandlerBuilder } from 'iprocess-shared'
import { CreateConfigurationInput } from 'iprocess-shared/graphql/index.js'

import * as mapper from './mapper.js'
import { Event, ZodConfigurationInput, eventSchema, ZodConfiguredScheduleSlot } from './types.js'
import { createSlots, buildNewConfiguration, sortByDateTimeStart } from './ops.js'
import { parseConfiguredScheduleSlots, processSlots } from './postprocess.js'
import { buildDateTimeWithShift } from './time.js'

interface HandleEventResult {
  configurations: CreateConfigurationInput[]
  slots: ZodConfiguredScheduleSlot[]
}

interface HandleConfigurationResult {
  configuration: CreateConfigurationInput
  slots: ZodConfiguredScheduleSlot[]
}

log.setLevel(getLogLevel())

export const lambdaHandler = lambdaHandlerBuilder('updateConfigurationsAndActualCounts', async (inputEvent) => {
  const event = eventSchema.parse(inputEvent)
  const { configurations, slots } = await handleEvent(event)

  await updateConfigurationsAndConfiguredScheduleSlots(event, configurations, slots)
})

async function handleEvent(event: Event): Promise<HandleEventResult> {
  const configurations = [] as CreateConfigurationInput[]
  const slots: ZodConfiguredScheduleSlot[] = []

  const results = await Promise.all(event.configurations.map(async (_) => await handleConfiguration(_, event)))

  for (const { configuration, slots: configurationSlots } of results) {
    configurations.push(configuration)
    slots.push(...configurationSlots)
  }

  const sortedSlots = slots.sort(sortByDateTimeStart)
  log.debug('All schedule slots:', JSON.stringify({ sortedSlots }))

  const finalConfiguredScheduleSlots = parseConfiguredScheduleSlots(sortedSlots)
  log.debug('All validated schedule slots:', JSON.stringify({ finalConfiguredScheduleSlots }))

  return { configurations, slots }
}

async function handleConfiguration(
  inputConfiguration: ZodConfigurationInput,
  { shiftType, dateTimeStartUTC, dateTimeEndUTC, unitId }: Event
): Promise<HandleConfigurationResult> {
  const { shiftModelId, partId, validFrom, validUntil, parameters } = inputConfiguration

  const configurationId = uuidv4()
  const { scheduleHours, scheduleHoursForWholeShift } = await mapper.scanScheduleHoursWithDateTime(
    { shiftModelId, shiftType },
    { dateTimeStartUTC, dateTimeEndUTC },
    { dateTimeStartUTC: validFrom, dateTimeEndUTC: validUntil }
  )

  if (scheduleHours.length === 0) {
    const message = `There is no matching schedule for ${validFrom.toISOString()}-${validUntil.toISOString()} with shift type ${shiftType}`
    log.warn(message)

    throw new AppError(message, 404)
  }

  const { slots, cycleTime } = createSlots(scheduleHours, scheduleHoursForWholeShift, parameters, {
    partId,
    unitId,
    configurationId
  })

  const newValidFrom = buildDateTimeWithShift(validFrom, { dateTimeStartUTC, dateTimeEndUTC }, shiftType)
  const newValidUntil = buildDateTimeWithShift(validUntil, { dateTimeStartUTC, dateTimeEndUTC }, shiftType)

  const configuration = await buildNewConfiguration(
    slots,
    { ...inputConfiguration, id: configurationId, unitId },
    { dateTimeStartUTC: newValidFrom, dateTimeEndUTC: newValidUntil },
    cycleTime,
    shiftType
  )

  return { configuration, slots }
}

async function updateConfigurationsAndConfiguredScheduleSlots(
  event: Event,
  configurations: CreateConfigurationInput[],
  slots: ZodConfiguredScheduleSlot[]
): Promise<void> {
  const slotsInDatabase = await mapper.scanConfiguredScheduleSlots(
    event.unitId,
    event.dateTimeStartUTC,
    event.dateTimeEndUTC
  )

  const { itemsToCreate, itemsToUpdate, itemsToDelete } = processSlots(slots, slotsInDatabase, {})
  const slotDateTimeRanges = itemsToCreate.map((_) => `${_.dateTimeStartUTC} - ${_.dateTimeEndUTC}`)

  log.debug('Configurations to delete', JSON.stringify({ ids: event.configurationIdsToDelete }))
  log.debug('Configurations to create', JSON.stringify({ ids: configurations.map((_) => _.id) }))
  log.debug('ConfiguredScheduleSlots to delete', JSON.stringify({ ids: itemsToDelete }))
  log.debug('ConfiguredScheduleSlots to update', JSON.stringify({ ids: itemsToUpdate.map((_) => _.id) }))
  log.debug('ConfiguredScheduleSlots to create', JSON.stringify({ slotDateTimeRanges }))

  await Promise.all([
    ...event.configurationIdsToDelete.map(mapper.deleteConfigurationFromId),
    ...configurations.map(mapper.createConfigurationFromItem),
    ...itemsToDelete.map(mapper.deleteConfiguredScheduleSlotFromId),
    ...itemsToUpdate.map(mapper.updateConfiguredScheduleSlot),
    ...itemsToCreate.map(mapper.createConfiguredScheduleSlot)
  ])
}
/* c8 ignore stop */
