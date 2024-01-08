import { useEffect, useState } from 'react'
// Time Formatting
import moment from 'moment-timezone'
import { Type } from '../API'
// State Machine
import { ExtendedScheduleSlot, useIProcessDispatch, useIProcessState } from '../contexts/iProcessContext'

function useCurrentDate() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const msPassed = now.getMilliseconds()
    const timeout = setTimeout(() => setNow(new Date()), 1000 - msPassed)
    return () => clearTimeout(timeout)
  }, [now])
  return now
}

const getPauseIndexes = (scheduleSlots: ExtendedScheduleSlot[]) => {
  // eslint-disable-next-line array-callback-return
  return scheduleSlots.map((scheduleSlot) => {
    if (scheduleSlot.type === Type.Pause) return scheduleSlot.i
  })
}

const useCurrentTime = () => {
  const now = useCurrentDate()
  const minutes = now.getMinutes()
  const momentNow = moment(now)
  let minutesString = minutes.toString()

  if (minutes < 10) minutesString = `0${minutes}`

  const currentTimeString = `${now.getHours()}:${minutesString}`
  const currentDateString = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`
  // handle shift selection
  // check every minute and change shift accordingly
  // const [currentTimeInCurrentShift, setCurrentTimeInCurrentShift] = useState<Array<boolean>>([])
  const { selectedShift, currentShiftScheduleSlots } = useIProcessState()
  const dispatch = useIProcessDispatch()

  useEffect(() => {
    const getCurrentTab = (scheduleSlots: ExtendedScheduleSlot[]) => {
      let currentTimeInCurrentShift: Array<boolean> = []

      // check for every shift if current time is  between start end end time of shift
      if (scheduleSlots)
        for (const scheduleSlot of scheduleSlots) {
          const hoursStartMoment = moment(scheduleSlot.dateTimeStart)
          const hoursEndMoment = moment(scheduleSlot.dateTimeEnd)
          // regular case: start time is before end time
          if (hoursStartMoment.isBefore(hoursEndMoment)) {
            const isInCurrentShift = momentNow.isBetween(hoursStartMoment, hoursEndMoment)
            currentTimeInCurrentShift = [...currentTimeInCurrentShift, isInCurrentShift]
          } else {
            // special case: end time is before start time --> shift overlaps days, e.g. from 23:30 - 00:30
            const isInCurrentShift = momentNow.isAfter(hoursStartMoment) || momentNow.isBefore(hoursEndMoment)
            currentTimeInCurrentShift = [...currentTimeInCurrentShift, isInCurrentShift]
          }
        }

      let currentTab = currentTimeInCurrentShift.indexOf(true)
      // TODO: this would not work if last schedule in one of the shifts overlaps days
      if (currentTab === -1) {
        const lastTimeOfShift = moment(scheduleSlots?.[scheduleSlots?.length - 1]?.dateTimeEnd)

        currentTab = momentNow.isAfter(lastTimeOfShift) ? scheduleSlots?.length : -1
      }
      return currentTab
    }

    if (currentShiftScheduleSlots) {
      const currentShiftTab = getCurrentTab(currentShiftScheduleSlots)
      const pauseIndexes = getPauseIndexes(currentShiftScheduleSlots)
      dispatch({ type: 'currentPauseTab', currentPauseTab: currentShiftTab })

      if (pauseIndexes.includes(currentShiftTab)) {
        dispatch({
          type: 'currentShiftTab',
          currentShiftTab: currentShiftTab - 1
        })
      } else {
        dispatch({ type: 'currentShiftTab', currentShiftTab })
      }
    }

    dispatch({ type: 'currentTime', currentTime: currentTimeString })
    dispatch({ type: 'currentDate', currentDate: currentDateString })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minutes, currentShiftScheduleSlots, selectedShift])

  return currentTimeString
}

export default useCurrentTime
