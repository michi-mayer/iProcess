import { defined } from 'iprocess-shared'
import {
  Shift,
  Type,
  actualCount as ConfiguredScheduleSlot,
  Bool,
  UnitType,
  ScheduleHour
} from 'iprocess-shared/graphql/index.js'

import { ConfiguredScheduleSlotSchema, ScheduleHourSchema } from '../types.js'

const configurationInputList = [
  {
    cycleTime: 60,
    partId: '0ad51c5c-9e76-40c0-a9be-c9501ea02a43',
    shiftModelId: '1ca67de8-4cce-4b4a-bed7-d630a05adaef',
    shiftTarget: 390,
    timeZone: 'Europe/Berlin',
    validFrom: '05:30:00.000',
    validUntil: '08:30:00.000',
    unitType: UnitType.assemblyLine
  },
  {
    cycleTime: 45,
    partId: '0ad51c5c-9e76-40c0-a9be-c9501ea02a43',
    shiftModelId: '1ca67de8-4cce-4b4a-bed7-d630a05adaef',
    speedMode: 2,
    timeZone: 'Europe/Madrid',
    validFrom: '08:30:00.000',
    validUntil: '13:30:00.000',
    unitType: UnitType.productionUnit
  }
]

export const rawEvent = {
  arguments: {
    unitId: 'cd2bb9bb-b16c-4dac-be5e-c864cb3ffdc5',
    unitName: 'a really hard to build unit',
    shiftType: Shift.morningShift,
    dateTimeStartUTC: '2022-07-26T05:30:00.000Z',
    dateTimeEndUTC: '2022-07-26T13:30:00.000Z',
    configurations: configurationInputList,
    configurationIdsToDelete: ['10ee17cf-fd3e-48ff-8f31-51992a0da51c', '6cdc0c4f-dd2b-45eb-9f1e-6b0083e0c55a']
  }
}

export const scheduleHours = [
  {
    id: '14c6aa50-ef1c-4d73-8681-d507bb09354a',
    hoursEndUTC: '00:15:00.000',
    shiftType: 'nightShift',
    shiftModelId: '14c6aa50-ef1c-4d73-8680-d507bb09354a',
    hoursStartUTC: '22:00:00.000',
    timeZone: 'Europe/Berlin',
    downtime: '00:10',
    createdAt: '2022-03-15T03:37:34.380Z',
    updatedAt: '2022-03-15T03:37:34.380Z',
    type: 'Production'
  },
  {
    id: '16c6aa50-ef1c-4d73-8681-d507bb09354a',
    hoursEndUTC: '13:30:00.000',
    shiftType: 'morningShift',
    shiftModelId: '14c6aa50-ef1c-4d73-8680-d507bb09354a',
    hoursStartUTC: '09:15:00.000',
    timeZone: 'Europe/Berlin',
    duration: null, // eslint-disable-line unicorn/no-null
    createdAt: '2022-03-15T03:37:34.380Z',
    updatedAt: '2022-03-15T03:37:34.380Z',
    type: 'Production'
  }
]

export const scheduleHoursFromDevelopment: ScheduleHour[] = [
  {
    __typename: 'ScheduleHour',
    id: '447787c8-e6cf-4d7b-9ac5-cfdefcfa7cd6',
    shiftType: Shift.afternoonShift,
    type: Type.Production,
    hoursStartUTC: '13:30:00.000',
    hoursEndUTC: '15:30:00.000',
    downtime: null, // eslint-disable-line unicorn/no-null
    timeZone: 'Europe/Berlin',
    shiftModelId: '0c49f133-04b3-4d4d-a3bb-5a2ece0fddc4',
    i: 5,
    createdAt: '2022-11-18T14:35:05.328Z',
    updatedAt: '2022-11-18T14:35:05.328Z'
  },
  {
    __typename: 'ScheduleHour',
    id: 'c834a181-dff5-4dbc-887e-e9c57652716f',
    shiftType: Shift.afternoonShift,
    type: Type.Production,
    hoursStartUTC: '17:30:00.000',
    hoursEndUTC: '19:30:00.000',
    downtime: '00:20',
    timeZone: 'Europe/Berlin',
    shiftModelId: '0c49f133-04b3-4d4d-a3bb-5a2ece0fddc4',
    i: 7,
    createdAt: '2022-11-18T14:35:05.367Z',
    updatedAt: '2022-11-18T14:35:05.367Z'
  },
  {
    __typename: 'ScheduleHour',
    id: 'f7b3c5d4-8be6-4118-b364-5cdde81a5d9e',
    shiftType: Shift.afternoonShift,
    type: Type.Production,
    hoursStartUTC: '15:30:00.000',
    hoursEndUTC: '17:30:00.000',
    downtime: '00:12',
    timeZone: 'Europe/Berlin',
    shiftModelId: '0c49f133-04b3-4d4d-a3bb-5a2ece0fddc4',
    i: 6,
    createdAt: '2022-11-18T14:35:05.303Z',
    updatedAt: '2022-11-18T14:35:05.303Z'
  },
  {
    __typename: 'ScheduleHour',
    id: '35550c30-6638-4740-90b8-6f3a6c73b7e6',
    shiftType: Shift.afternoonShift,
    type: Type.Production,
    hoursStartUTC: '19:30:00.000',
    hoursEndUTC: '21:30:00.000',
    downtime: '00:10',
    timeZone: 'Europe/Berlin',
    shiftModelId: '0c49f133-04b3-4d4d-a3bb-5a2ece0fddc4',
    i: 8,
    createdAt: '2022-11-18T14:35:05.297Z',
    updatedAt: '2022-11-18T14:35:05.297Z'
  }
]

export const parsedScheduleHours = () =>
  structuredClone(scheduleHoursFromDevelopment).map((_) => ScheduleHourSchema.parse(_))

export const configuredScheduleSlots: ConfiguredScheduleSlot[] = [
  {
    id: 'actual-count-id-1',
    __typename: 'actualCount',
    dateTimeStartUTC: '2022-03-14T22:00:00.000Z',
    dateTimeEndUTC: '2022-03-15T00:15:00.000Z',
    shift: Shift.nightShift,
    shiftModelId: '14c6aa50-ef1c-4d73-8680-d507bb09354a',
    timeZone: 'Europe/Berlin',
    createdAt: '2022-03-15T03:37:34.380Z',
    updatedAt: '2022-03-15T03:37:34.380Z',
    unitId: 'unit-id',
    partId: 'part-id',
    quota: 5,
    downtime: null, // eslint-disable-line unicorn/no-null
    deleted: Bool.no,
    type: Type.Production,
    configurationId: '6cdc0c4f-dd2b-45eb-9f1e-6b0083e0c55a'
  },
  {
    id: 'actual-count-id-2',
    __typename: 'actualCount',
    dateTimeStartUTC: '2022-03-15T00:15:00.000Z',
    dateTimeEndUTC: '2022-03-15T04:15:00.000Z',
    shift: Shift.nightShift,
    shiftModelId: '14c6aa50-ef1c-4d73-8680-d507bb09354a',
    timeZone: 'Europe/Berlin',
    createdAt: '2022-03-15T03:37:34.380Z',
    updatedAt: '2022-03-15T03:37:34.380Z',
    unitId: 'unit-id',
    partId: 'part-id',
    downtime: '00:10',
    deleted: Bool.no,
    type: Type.Pause,
    configurationId: '6cdc0c4f-dd2b-45eb-9f1e-6b0083e0c55a',
    quota: 15
  },
  {
    id: 'actual-count-id-3',
    __typename: 'actualCount',
    dateTimeStartUTC: '2022-03-15T04:15:00.000Z',
    dateTimeEndUTC: '2022-03-15T05:15:00.000Z',
    shift: Shift.nightShift,
    shiftModelId: '14c6aa50-ef1c-4d73-8680-d507bb09354a',
    timeZone: 'Europe/Berlin',
    createdAt: '2022-03-15T03:37:34.380Z',
    updatedAt: '2022-03-15T03:37:34.380Z',
    unitId: 'unit-id',
    partId: 'part-id',
    downtime: '00:01',
    quota: 5,
    deleted: Bool.no,
    type: Type.Production,
    configurationId: '6cdc0c4f-dd2b-45eb-9f1e-6b0083e0c55a'
  },
  {
    id: 'actual-count-id-4',
    __typename: 'actualCount',
    dateTimeStartUTC: '2022-03-15T04:15:00.000Z',
    dateTimeEndUTC: '2022-03-15T05:15:00.000Z',
    shift: Shift.nightShift,
    shiftModelId: '14c6aa50-ef1c-4d73-8680-d507bb09354a',
    timeZone: 'Europe/Berlin',
    createdAt: '2022-03-15T03:37:34.380Z',
    updatedAt: '2022-03-15T03:37:34.380Z',
    unitId: 'unit-id',
    partId: 'part-id',
    quota: 5,
    downtime: undefined,
    deleted: Bool.no,
    type: Type.Production,
    configurationId: '6cdc0c4f-dd2b-45eb-9f1e-6b0083e0c55a'
  }
]

export const parsedConfiguredScheduleSlots = () =>
  structuredClone(configuredScheduleSlots).map((_) => ConfiguredScheduleSlotSchema.parse(_))

export const configuredScheduleSlotsInDatabase: ConfiguredScheduleSlot[] = [
  {
    ...defined(configuredScheduleSlots[0]),
    id: 'actual-count-id-10',
    actualCount: 5,
    defective: 0
  },
  {
    ...defined(configuredScheduleSlots[1]),
    id: 'actual-count-id-11',
    actualCount: 1,
    defective: 1,
    quota: 30
  }
]

export type RawEvent = typeof rawEvent
export type RawConfig = (typeof configurationInputList)[0]
