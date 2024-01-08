import { ChangeEvent, useEffect, useState } from 'react'
import FreeBreakfastOutlined from '@mui/icons-material/FreeBreakfastOutlined'
import { AppBar, Tab, Tabs } from '@mui/material'
import { styled } from '@mui/material/styles'
import { getIconPosition } from './helper/getIconPosition'
import { Type } from 'API'
import { useIProcessDispatch, useIProcessState } from 'contexts/iProcessContext'
import { useSubscriptionScheduleSlots } from 'hooks/services/useSusbscriptionScheduleSlots'
import useCurrentConfiguration from 'hooks/useCurrentConfiguration'
import { colors } from 'theme'
import ShiftCard from './ShiftCard'

const TimeTabBar = styled(AppBar)({
  boxShadow: 'none',
  backgroundColor: colors.white,
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px'
})

const PauseIcon = styled(FreeBreakfastOutlined)({
  position: 'absolute',
  color: colors.gray1,
  fontSize: '32px',
  top: '2.75rem',
  left: '28px',
  borderRadius: '50%',
  padding: '5px'
})

const PauseLineTop = styled('div')({
  top: 0,
  position: 'absolute',
  height: '2.7rem',
  width: '0.5px',
  border: `1px solid ${colors.gray1}`,
  right: '45px'
})
const PauseLineBottom = styled('div')({
  top: '75.20px',
  position: 'absolute',
  height: '6rem',
  width: '0.5px',
  border: `1px solid ${colors.gray1}`,
  right: '45px'
})

const ShiftTab = styled(Tab)({
  padding: '0px',
  margin: '0px',
  fontSize: 'inherit',
  fontWeight: 'inherit'
})

const ShiftTabs = styled(Tabs)({
  height: '100%',
  position: 'relative'
})

const TimeTabs = () => {
  const [timeTabSelector, setTimeTabSelector] = useState(0)
  const { selectedShift, currentShiftTab, currentPauseTab, selectedShiftTab, currentShiftScheduleSlots } =
    useIProcessState()

  useSubscriptionScheduleSlots()
  useCurrentConfiguration()

  const dispatch = useIProcessDispatch()

  useEffect(() => {
    let mounted = true

    if (currentShiftScheduleSlots && mounted) {
      if (currentShiftTab > currentShiftScheduleSlots?.length - 1 || currentShiftTab === -1) {
        dispatch({ type: 'selectedShiftTab', selectedShiftTab: 0 })
        setTimeTabSelector(0)
      } else {
        dispatch({
          type: 'selectedShiftTab',
          selectedShiftTab: currentShiftTab
        })
        setTimeTabSelector(currentShiftTab)
      }
    }

    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentShiftTab, selectedShift, currentShiftScheduleSlots?.length])

  const handleChange = (_: ChangeEvent<unknown>, newValue: number) => {
    setTimeTabSelector(newValue)
    dispatch({ type: 'selectedShiftTab', selectedShiftTab: newValue })
  }

  return (
    <>
      <TimeTabBar position='static' id='TimeTabs'>
        <ShiftTabs
          value={timeTabSelector}
          onChange={handleChange}
          orientation='horizontal'
          indicatorColor='primary'
          variant='fullWidth'
          TabIndicatorProps={{
            style: {
              backgroundColor: selectedShiftTab === currentShiftScheduleSlots?.length ? colors.white : colors.blue,
              height: '4px'
            }
          }}
        >
          {currentShiftScheduleSlots?.map((scheduleSlot, index) => {
            const lastIndex = currentShiftScheduleSlots?.length ? currentShiftScheduleSlots?.length - 1 : 0
            const scheduleSlotIndex = currentShiftScheduleSlots?.length
              ? scheduleSlot.i % currentShiftScheduleSlots?.length
              : 0
            const isSelected = index === selectedShiftTab
            const isFutureScheduleSlot = scheduleSlotIndex > currentShiftTab
            if (scheduleSlot.type === Type.Production) {
              return scheduleSlotIndex === selectedShiftTab ? (
                <ShiftTab
                  disabled={isFutureScheduleSlot}
                  disableFocusRipple={isFutureScheduleSlot}
                  disableRipple={isFutureScheduleSlot}
                  disableTouchRipple={isFutureScheduleSlot}
                  style={{
                    borderTopLeftRadius: index === 0 ? '8px' : '',
                    borderTopRightRadius: index === lastIndex ? '8px' : ''
                  }}
                  key={scheduleSlot.id}
                  id={`shiftTab.${scheduleSlot.type}.${index}`}
                  icon={
                    <ShiftCard
                      isSelected={isSelected}
                      currentShiftScheduleSlots={currentShiftScheduleSlots}
                      curSchedule={scheduleSlot}
                    />
                  }
                />
              ) : (
                <ShiftTab
                  disabled={isFutureScheduleSlot}
                  disableFocusRipple={isFutureScheduleSlot}
                  disableRipple={isFutureScheduleSlot}
                  disableTouchRipple={isFutureScheduleSlot}
                  style={{
                    borderTopLeftRadius: index === 0 ? '8px' : '',
                    borderTopRightRadius: index === lastIndex ? '8px' : ''
                  }}
                  key={scheduleSlot.id}
                  id={`shiftTab.${scheduleSlot.type}.${index}`}
                  icon={
                    <ShiftCard
                      currentShiftScheduleSlots={currentShiftScheduleSlots}
                      curSchedule={scheduleSlot}
                      isSelected={isSelected}
                    />
                  }
                />
              )
            } else if (scheduleSlot.type === Type.Pause) {
              const iconPausePosition = getIconPosition({
                currentShiftScheduleSlots,
                scheduleIndex: index
              })
              const isPauseTime = scheduleSlotIndex === currentPauseTab
              return (
                <Tab
                  sx={{ padding: 0, position: 'absolute', height: '100%', left: `calc(${iconPausePosition}% - 44px)` }}
                  disabled={true}
                  disableFocusRipple={true}
                  disableRipple={true}
                  disableTouchRipple={true}
                  id={`shiftTab.${scheduleSlot.type}.active-${isPauseTime}.${index}`}
                  key={scheduleSlot.id}
                  icon={
                    <div style={{ zIndex: 2, height: '100%' }}>
                      <PauseIcon
                        style={{
                          backgroundColor: isPauseTime ? colors.blue : '',
                          color: isPauseTime ? colors.white : colors.gray1
                        }}
                      />
                      <PauseLineTop />
                      <PauseLineBottom />
                    </div>
                  }
                />
              )
            } else {
              // !Type ShiftChange
              return undefined
            }
          })}
        </ShiftTabs>
      </TimeTabBar>
    </>
  )
}

export default TimeTabs
