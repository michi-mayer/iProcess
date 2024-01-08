/* c8 ignore start */
import log from 'loglevel'
import middy from '@middy/core'
import { logMetrics } from '@aws-lambda-powertools/metrics'
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer'

import { getCurrentDateTime, getLogLevel, lambdaHandlerBuilder, throwOnError } from 'iprocess-shared'

import { tracer } from './services/tracer.js'
import { metrics, increaseErrorCountMetric } from './services/metrics.js'
import type { ShiftPeriod } from './shift.js'
import { EventSchema } from './types.js'
import { handleItems } from './preprocess.js'
import { buildOEEItem, toOEE } from './ops.js'
import {
  scanDefectives,
  scanDisruptions,
  scanDisruptionsOnBoundaries,
  createOEEItem,
  scanTimeSlotsByUpdatedAt,
  scanDisruptionsByUpdatedAt,
  scanDefectivesByUpdatedAt
} from './mapper.js'

log.setLevel(getLogLevel())

const onError = (name: string, error: unknown, inputEvent: unknown) => {
  increaseErrorCountMetric()
  throwOnError(name, error, inputEvent)
}

const handler = lambdaHandlerBuilder(
  'OEE',
  async (inputEvent) => {
    const now = getCurrentDateTime({ utc: true })
    const { timeRange, persistToDB } = EventSchema.parse(inputEvent)
    const computeOEE = calculateOEE.bind({}, persistToDB)

    log.debug(
      `Getting all updated timeslots, disruptions and defectives with the following condition (${timeRange.toString()})`
    )

    const [timeslots, disruptions, defectives] = await Promise.all([
      scanTimeSlotsByUpdatedAt(timeRange),
      scanDisruptionsByUpdatedAt(timeRange),
      scanDefectivesByUpdatedAt(timeRange)
    ])

    log.debug('[Input] Updated items:', JSON.stringify({ timeslots, disruptions, defectives }))

    const shifts = await handleItems(timeslots, disruptions, defectives, now)
    log.debug('[Input] Shifts:', JSON.stringify(shifts))

    return await Promise.all(shifts.map(computeOEE))
  },
  onError
)

const onDryRun = () => {
  log.warn(`Dry run mode is enabled. OEE won't be saved in the database`)
  return 'unknown'
}

const calculateOEE = async (persistToDB: boolean, shift: ShiftPeriod) => {
  const { unitId, timeRange } = shift

  const [defectives, disruptions, disruptionsOnBoundaries] = await Promise.all([
    scanDefectives(unitId, timeRange),
    scanDisruptions(unitId, timeRange),
    scanDisruptionsOnBoundaries(unitId, timeRange)
  ])

  log.debug('Build OEE input:', JSON.stringify({ shift, defectives, disruptions, disruptionsOnBoundaries }))
  const input = buildOEEItem(shift, defectives, disruptions, disruptionsOnBoundaries)

  const id = persistToDB ? await createOEEItem(input) : onDryRun()
  return toOEE(id, input)
}

export const lambdaHandler = middy(handler).use(logMetrics(metrics)).use(captureLambdaHandler(tracer))
/* c8 ignore stop */
