// 3rd party libraries
import { match, P } from 'ts-pattern'

// Layer
import { CreateActualCountInput, CreateConfigurationInput, Shift } from 'iprocess-shared/graphql/API.js'
import { invalidDateTime, isAfterMidnight, isDefined } from 'iprocess-shared'
import { DayJS } from 'iprocess-shared/shared/datetime.js'

// * A Shift slot can be uniquely identified by its unit ID, shift type, and date
export interface ShiftSlotKey {
  unitId: string
  date: DayJS
  type: Shift
}

// * A Shift slot is active if it is linked to a configuration and to a list of timeslots
export interface ActiveShiftSlot {
  configuration: CreateConfigurationInput
  timeslots: CreateActualCountInput[]
}

// * On behalf of the Shift type, we might need to consider the current and next dates (i.e. for night shifts)
export interface ShiftSlotDates {
  type: Shift
  currentDate: DayJS
  nextDate: DayJS
}

export abstract class BaseShiftSlot implements ShiftSlotKey, Partial<ActiveShiftSlot> {
  configuration?: CreateConfigurationInput
  timeslots?: CreateActualCountInput[]

  constructor(
    public unitId: string,
    public date: DayJS,
    public type: Shift
  ) {
    this.date = date.startOf('day')
  }

  equals(value: unknown) {
    return (
      typeof value === 'object' &&
      isDefined(value) &&
      'unitId' in value &&
      'date' in value &&
      'type' in value &&
      value.date instanceof DayJS &&
      this.unitId === value.unitId &&
      this.type === value.type &&
      this.date.isSame(value.date)
    )
  }

  /**
   * Checks if the Shift slot exists. A Shift slot exists if there are 1 or more timeslots linked to it.
   */
  abstract exists(...parameters: unknown[]): Promise<boolean>

  /**
   * Starts the shift. It must set the 'configuration' and 'timeslots' attributes to defined values
   */
  abstract start(...parameters: unknown[]): Promise<void>
}

const add1Day = (_: DayJS) => _.add(1, 'day').startOf('day')

const subtract1Day = (_: DayJS) => _.subtract(1, 'day').startOf('day')

export const getDates = ({ type, date: currentDate }: Omit<ShiftSlotKey, 'unitId'>): ShiftSlotDates =>
  match([type, isAfterMidnight(currentDate)] as const)
    .with([Shift.morningShift, P._], () => ({ type, currentDate, nextDate: invalidDateTime() }))
    .with([Shift.afternoonShift, P._], () => ({ type, currentDate, nextDate: invalidDateTime() }))
    // * On night shift, if the item's datetime is after midnight, then we need to get the previous day's before midnight
    .with([Shift.nightShift, true], () => ({ type, nextDate: currentDate, currentDate: subtract1Day(currentDate) }))
    // * On night shift, if the item's datetime is before midnight, then we need to get the next day's after midnight
    .with([Shift.nightShift, false], () => ({ type, currentDate, nextDate: add1Day(currentDate) }))
    .exhaustive()
