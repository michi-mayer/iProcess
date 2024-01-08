import { useEffect, useMemo } from 'react'
import { ConfiguratorRecord, useIProcessDispatch, useIProcessState } from '../contexts/iProcessContext'
import { currentShiftPosition, getShiftStartsFromScheduleHours } from '../helper/shifts'
import {
  addOneMinute,
  getLocalDateTimeFromUtcDateTime,
  getLocalTimeFromUtcDateTime,
  getShiftStartEndDateTimeUTC
} from '../helper/time'

const useCurrentShiftInfo = () => {
  const { unitSelected, configurationByUnitId, selectedShift, timeZone, currentShift } = useIProcessState()
  const dispatch = useIProcessDispatch()
  const defaultScheduleHours = unitSelected?.shiftModels?.[0]?.scheduleHours
  const { morningShiftStart, afternoonShiftStart, nightShiftStart } = useMemo(
    () => getShiftStartsFromScheduleHours(defaultScheduleHours),
    [defaultScheduleHours]
  )

  const configurations = configurationByUnitId?.[unitSelected?.id as keyof ConfiguratorRecord]

  useEffect(() => {
    const currentShift = currentShiftPosition({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart
    })
    dispatch({ type: 'currentShift', currentShift })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afternoonShiftStart, morningShiftStart, nightShiftStart])

  useEffect(() => {
    let mounted = true
    const { dateTimeStartUTC, dateTimeEndUTC, workStartDateTimeUTC, workEndDateTimeUTC } = getShiftStartEndDateTimeUTC({
      morningShiftStart,
      afternoonShiftStart,
      nightShiftStart,
      selectedShift,
      currentShift,
      timeZone
    })

    if (dateTimeStartUTC && dateTimeEndUTC && mounted && workStartDateTimeUTC && workEndDateTimeUTC) {
      const shouldReadOffSet = true
      const startTime = getLocalTimeFromUtcDateTime(dateTimeStartUTC, timeZone)
      const endTime = getLocalTimeFromUtcDateTime(addOneMinute(dateTimeEndUTC), timeZone)
      const dateTimeStart = getLocalDateTimeFromUtcDateTime(dateTimeStartUTC, timeZone, shouldReadOffSet)
      const dateTimeEnd = getLocalDateTimeFromUtcDateTime(addOneMinute(dateTimeEndUTC), timeZone, shouldReadOffSet)
      const workStartDateTime = getLocalDateTimeFromUtcDateTime(workStartDateTimeUTC, timeZone, shouldReadOffSet)
      const workEndDateTime = getLocalDateTimeFromUtcDateTime(workEndDateTimeUTC, timeZone, shouldReadOffSet)
      if (startTime && endTime)
        dispatch({
          type: 'shiftTimeRange',
          shiftTimeRange: {
            startTime,
            endTime,
            dateTimeStart,
            dateTimeEnd,
            dateTimeStartUTC,
            dateTimeEndUTC,
            workStartDateTimeUTC,
            workEndDateTimeUTC,
            workStartDateTime,
            workEndDateTime,
            morningShiftStart,
            afternoonShiftStart,
            nightShiftStart
          }
        })
    }
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afternoonShiftStart, configurations, currentShift, morningShiftStart, nightShiftStart, selectedShift, timeZone])
}

export default useCurrentShiftInfo
