// 3rd party libraries
import log from 'loglevel'

// Layer
import { NonEmptyArray, isNonEmptyArray, ShiftSlotKey } from 'iprocess-shared'
import { Shift } from 'iprocess-shared/graphql/API.js'
import { DayJS } from 'iprocess-shared/shared/datetime.js'

// Local modules
import { isShiftOngoing, TimeRange } from './time.js'
import type { ZodTimeSlot } from './types.js'
import { fetchTimeSlots } from './mapper.js'

export class ShiftPeriod implements ShiftSlotKey {
  unitId: string
  date: DayJS
  type: Shift

  constructor(
    { unitId, date, type }: ShiftSlotKey,
    public slots: NonEmptyArray<ZodTimeSlot>,
    public timeRange: TimeRange
  ) {
    this.unitId = unitId
    this.date = date.startOf('day')
    this.type = type
  }

  equalsKey({ unitId, date, type }: ShiftSlotKey) {
    const keyDate = date.startOf('day')
    return this.unitId === unitId && this.date.isSame(keyDate) && this.type === type
  }

  toKey(): ShiftSlotKey {
    return { unitId: this.unitId, date: this.date, type: this.type }
  }

  static async new(shift: ShiftSlotKey, now: DayJS) {
    const { timeRange, slots } = await fetchTimeSlots(shift)

    if (timeRange.isValid && !isShiftOngoing(timeRange, now) && isNonEmptyArray(slots)) {
      // ! It's key that 'date' is 'startOfDay' because DayJS only supports full datetimes (and we compare them)
      return new ShiftPeriod(shift, slots, timeRange)
    }

    return undefined
  }
}

export class ShiftCollection {
  shifts: ShiftPeriod[] = []

  #isNew(key: ShiftSlotKey) {
    return this.shifts.every((_) => !_.equalsKey(key))
  }

  async put(key: ShiftSlotKey, now: DayJS) {
    if (this.#isNew(key)) {
      const shift = await ShiftPeriod.new(key, now)

      if (shift) {
        this.shifts.push(shift)
      } else {
        log.debug(`Shift is invalid or ongoing. Won't compute OEE`, JSON.stringify({ shift: key, now }))
      }
    }
  }
}
