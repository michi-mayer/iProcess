import { DependencyList, useMemo } from 'react'
import moment from 'moment-timezone'
import { localDateTimeFormatTimePicker } from 'helper/time'

/**
 *
 * @param {DependencyList} deps Default is []. Using ReadonlyArray internally
 * @param timeFormat Default is "YYYY-MM-DD[T]HH:mm"
 * @returns string
 */
const useNow = (deps: DependencyList = [], timeFormat: string = localDateTimeFormatTimePicker) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => moment(new Date()).format(timeFormat), deps)
}

export default useNow
