import { NonEmptyString, parse, zodDateTimeParser } from 'iprocess-shared'
import { DayJS } from 'iprocess-shared/shared/datetime.js'
import { z } from 'zod'

export interface IOTEvent {
  topicName: string
  OverflowCounter: number
  clientId: string
  NBTimestamp: DayJS
}

export interface AppSyncEvent {
  typeName: string
}

export const IOTEventSchema = parse<IOTEvent>().with({
  clientId: NonEmptyString,
  topicName: NonEmptyString,
  OverflowCounter: z.number(),
  NBTimestamp: zodDateTimeParser
})

export const isIOTEvent = (value: object): value is IOTEvent => 'topicName' in value
export const isAppSyncEvent = (value: object): value is AppSyncEvent => 'typeName' in value
