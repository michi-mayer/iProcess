import log from 'loglevel'
import { pipe } from 'remeda'
import { match } from 'ts-pattern'
import { lambdaHandlerBuilder, getLogLevel } from 'iprocess-shared'

import { IOTEventSchema, isAppSyncEvent, isIOTEvent } from './types.js'
import { handleAppSyncEvent } from './events/appsync.js'
import { handleIOTEvent } from './events/iot.js'

log.setLevel(getLogLevel())

export const handler = lambdaHandlerBuilder(
  'MachineResolver',
  async (inputEvent) =>
    await match(inputEvent)
      .when(isIOTEvent, (_) => pipe(IOTEventSchema.parse(_), handleIOTEvent))
      .when(isAppSyncEvent, handleAppSyncEvent)
      .otherwise(() => {
        throw new Error('MachineResolver: Unknown input event')
      })
)
