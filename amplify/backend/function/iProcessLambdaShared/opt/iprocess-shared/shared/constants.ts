/* c8 ignore start */
import { NIL as NIL_UUID } from 'uuid'

import { CycleStationBase } from './types.js'

export const DURATION_FORMAT = `HH:mm`
export const DATE_FORMAT = `YYYY-MM-DD`
export const TIME_FORMAT = `HH:mm:ss.SSS`
export const DATETIME_FORMAT = `YYYY-MM-DD[T]HH:mm:ss.SSS[Z]`
export const DATETIME_FORMAT_FIX = `YYYY-MM-DD[T]HH:mm:ss.SSSS[Z]` // ! FIXME: Remove when VDD-560 is done
export const OTHER_DISRUPTIONS_TEMPLATE_ID = 'genericDisruption'

export const UNIT_SPECIFIC_CYCLE_STATION: Readonly<CycleStationBase> = {
  id: NIL_UUID,
  index: 0,
  isActive: true,
  name: 'Unit-specific',
  unitId: NIL_UUID
}

export const ALL_CYCLE_STATIONS: Readonly<CycleStationBase> = {
  id: '',
  index: -1,
  isActive: true,
  name: 'All disruptions',
  unitId: ''
}
/* c8 ignore end */
