import { NonEmptyArray, dateTimeParser, defined, invalidDateTime } from 'iprocess-shared'
import { Defective, Bool, Shift, Type, OEE } from 'iprocess-shared/graphql/API.js'

import { ZodTimeSlot, ZodDisruption } from '../types.js'
import { TimeRange } from '../time.js'
import { ShiftPeriod } from '../shift.js'

export const defaultTimeRangeInput = { start: '2021-11-10T06:00:00.000Z', end: '2021-11-10T15:00:00.000Z' }

export const baseOEE: Readonly<OEE> = {
  __typename: 'OEE',
  id: '8061cda6-d97f-4367-a057-d90793a6df3a',
  unitId: '8d58f332-2e9f-4132-8f20-7d3964e5c10d',
  startTimeDateUTC: defaultTimeRangeInput.start,
  endTimeDateUTC: defaultTimeRangeInput.end,
  createdAt: '2021-11-09T12:00:00.000Z',
  updatedAt: '2021-11-09T12:00:00.000Z',
}

export const baseDisruption: Readonly<ZodDisruption> = {
  __typename: 'disruption',
  id: '8f8fb673-cfbb-423d-9f7e-cf682fc13519',
  description: 'A test disruption',
  template: Bool.no,
  templateId: '26ab2757-c57d-423d-9e98-6074a247397f',
  cycleStationId: 'f43f9577-bfe2-4801-8221-219f13158b8e',
  deleted: Bool.no,
  unitId: '96c79ff0-5db7-4ccf-8769-3550da6a11ff',
  startTimeDateUTC: invalidDateTime(),
  endTimeDateUTC: invalidDateTime()
}

const baseTimeSlot: Readonly<ZodTimeSlot> = {
  __typename: 'actualCount',
  id: 'afd16818-cbfe-471a-b5fd-e8d7fdc34cdb',
  timeZone: 'Europe/Berlin',
  partId: 'bf4b5a66-25dc-48aa-8161-9499ef0bb520',
  unitId: '18c592c6-86f3-4a3e-845f-1b6d35e36724',
  shiftModelId: 'c7feb05e-2b82-4776-99bb-c682c0e5472b',
  configurationId: 'ab0684ec-57d0-4213-88fb-63ce58741b91',
  deleted: Bool.no,
  shift: Shift.morningShift,
  quota: 0,
  type: Type.Inactive,
  dateTimeStartUTC: invalidDateTime(),
  dateTimeEndUTC: invalidDateTime()
}

export const timeSlots: ZodTimeSlot[] = [
  {
    ...structuredClone(baseTimeSlot),
    unitId: '7cd0c408-e619-41ee-be66-54317aaf411e',
    dateTimeStartUTC: dateTimeParser('2021-11-10T08:30:00.000Z'),
    dateTimeEndUTC: dateTimeParser('2021-11-10T09:30:00.000Z'),
    quota: 11,
    actualCount: 6,
    type: Type.Production
  },
  {
    ...structuredClone(baseTimeSlot),
    unitId: '7cd0c408-e619-41ee-be66-54317aaf411e',
    dateTimeStartUTC: dateTimeParser('2021-11-10T09:30:00.000Z'),
    dateTimeEndUTC: dateTimeParser('2021-11-10T10:30:00.000Z'),
    quota: 11,
    actualCount: 11,
    type: Type.Production
  },
  {
    ...structuredClone(baseTimeSlot),
    unitId: '7cd0c408-e619-41ee-be66-54317aaf411e',
    dateTimeStartUTC: dateTimeParser('2021-11-10T10:30:00.000Z'),
    dateTimeEndUTC: dateTimeParser('2021-11-10T13:30:00.000Z'),
    quota: 11,
    actualCount: 11,
    type: Type.Pause
  },
  {
    ...structuredClone(baseTimeSlot),
    unitId: '7cd0c408-e619-41ee-be66-54317aaf411e',
    dateTimeStartUTC: dateTimeParser('2021-11-10T13:30:00.000Z'),
    dateTimeEndUTC: dateTimeParser('2021-11-10T14:00:00.000Z'),
    quota: 0,
    actualCount: 5,
    downtime: 30,
    type: Type.Production
  },
  {
    ...structuredClone(baseTimeSlot),
    unitId: '7cd0c408-e619-41ee-be66-54317aaf411e',
    dateTimeStartUTC: dateTimeParser('2021-11-10T14:00:00.000Z'),
    dateTimeEndUTC: dateTimeParser('2021-11-10T14:15:00.000Z'),
    quota: 0,
    type: Type.ShiftChange
  },
  {
    ...structuredClone(baseTimeSlot),
    unitId: '7cd0c408-e619-41ee-be66-54317aaf411e',
    dateTimeStartUTC: dateTimeParser('2021-11-10T14:15:00.000Z'),
    dateTimeEndUTC: dateTimeParser('2021-11-10T14:30:00.000Z'),
    quota: 0,
    type: Type.Inactive
  },
]

export const firstSlot = defined(timeSlots.at(0))

// * A shift consisting of a single timeslot (smallest Shift possible)
export const shift = new ShiftPeriod(
  { unitId: firstSlot.unitId, date: firstSlot.dateTimeStartUTC, type: firstSlot.shift },
  [firstSlot],
  new TimeRange(firstSlot.dateTimeStartUTC, firstSlot.dateTimeEndUTC)
)

export const defectives: NonEmptyArray<Defective> = [
  {
    __typename: 'Defective',
    dateTimeUTC: '2021-11-10T10:46:00.000Z',
    createdAt: '2021-11-12T19:47:36.359Z',
    unitId: '64cf0d25-8f2b-450f-88fd-96c9653fa665',
    defectiveCause: 'Anlage',
    count: 1,
    deleted: Bool.no,
    updatedAt: '2021-11-12T19:47:36.359Z',
    defectiveGrid: 'A14;B8',
    shift: Shift.afternoonShift,
    id: 'c54c25b2-da87-4d3f-8b5e-513c09752783',
    defectiveType: '',
    partId: '080354bd-3757-4d11-8a81-77185b698ebe'
  },
  {
    __typename: 'Defective',
    dateTimeUTC: '2021-11-10T11:06:00.000Z',
    createdAt: '2021-11-10T09:07:42.229Z',
    unitId: '64cf0d25-8f2b-450f-88fd-96c9653fa665',
    defectiveCause: 'Anlage',
    deleted: Bool.no,
    updatedAt: '2021-11-10T09:07:42.229Z',
    defectiveGrid: 'A12;A13;B12;B13',
    shift: Shift.morningShift,
    id: '585a7de7-fc95-4248-8784-0924e41c0be1',
    defectiveType: '',
    partId: '080354bd-3757-4d11-8a81-77185b698ebe'
  }
]

export const disruptions: NonEmptyArray<ZodDisruption> = [
  {
    ...structuredClone(baseDisruption),
    unitId: '080354bd-3757-4d11-8a81-77185b698ebe',
    startTimeDateUTC: dateTimeParser('2021-11-10T14:10:00.000Z'),
    endTimeDateUTC: dateTimeParser('2021-11-10T14:20:00.000Z'),
    duration: '00:10'
  },
  {
    ...structuredClone(baseDisruption),
    unitId: '64cf0d25-8f2b-450f-88fd-96c9653fa665',
    startTimeDateUTC: dateTimeParser('2021-11-10T14:23:00.000Z'),
    endTimeDateUTC: dateTimeParser('2021-11-10T14:28:00.000Z'),
    duration: '00:05'
  }
]

export const longDisruptionOnBoundaries: ZodDisruption[] = [
  {
    ...structuredClone(baseDisruption),
    unitId: 'c54c25b2-da87-4d3f-8b5e-513c09752783',
    startTimeDateUTC: dateTimeParser('2021-11-10T14:15:00.000Z'),
    endTimeDateUTC: dateTimeParser('2021-11-10T14:45:00.000Z'),
    duration: '00:30'
  },
  {
    ...structuredClone(baseDisruption),
    unitId: 'c54c25b2-da87-4d3f-8b5e-513c09752783',
    startTimeDateUTC: dateTimeParser('2021-11-10T06:15:00.000Z'),
    endTimeDateUTC: dateTimeParser('2021-11-10T06:45:00.000Z'),
    duration: '00:30'
  }
]

export const shortDisruptionOnBoundaries: ZodDisruption[] = [
  {
    ...structuredClone(baseDisruption),
    unitId: 'c54c25b2-da87-4d3f-8b5e-513c09752783',
    startTimeDateUTC: dateTimeParser('2021-11-10T14:25:00.000Z'),
    endTimeDateUTC: dateTimeParser('2021-11-10T14:35:00.000Z'),
    duration: '00:10'
  },
  {
    ...structuredClone(baseDisruption),
    unitId: 'c54c25b2-da87-4d3f-8b5e-513c09752783',
    startTimeDateUTC: dateTimeParser('2021-11-10T06:25:00.000Z'),
    endTimeDateUTC: dateTimeParser('2021-11-10T06:35:00.000Z'),
    duration: '00:10'
  }
]

export const getTimeRange = ({ start, end } = defaultTimeRangeInput) => TimeRange.fromString(start, end)
