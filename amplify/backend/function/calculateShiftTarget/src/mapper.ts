import { Get } from 'type-fest'

import { AppSyncClient, getScanParameters } from 'iprocess-shared'
import {
  ListScheduleHoursByShiftModelIdQuery as Query,
  ListScheduleHoursByShiftModelIdQueryVariables as Variables,
  Shift
} from 'iprocess-shared/graphql/index.js'
import { listScheduleHoursByShiftModelId } from 'iprocess-shared/graphql/queries/index.js'

import { ScheduleHourSchema } from './types.js'

type Values = Get<Query, ['listScheduleHoursByShiftModelId', 'items', '0']>

const connector = new AppSyncClient()

export const scanScheduleHours = async (shiftModelId: string, shiftType: Shift) => {
  const result = await connector.scan<Query, Variables, Values>(listScheduleHoursByShiftModelId, getScanParameters, {
    shiftModelId,
    filter: { shiftType: { eq: shiftType } }
  })

  return result.map((_) => ScheduleHourSchema.parse(_))
}
