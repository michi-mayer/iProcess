import { CSSProperties, memo, useEffect, useRef, useState } from 'react'
import { Card, Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import moment from 'moment-timezone'
import { Type } from 'API'
import BlinkingDotIcon from 'components/Icons/BlinkingDotIcon'
import { ExtendedScheduleSlot, useIProcessState } from 'contexts/iProcessContext'
import { Color, colors } from 'theme'
import Downtime from './Downtime'
import KPI from './KPI'

const ShiftCardStyled = styled(Card)({
  width: '100%',
  height: '100%',
  padding: '8px 0',
  boxShadow: 'none',
  borderTop: `1px solid ${colors.gray3}`,
  borderLeft: `1px solid ${colors.gray3}`,
  borderRight: `1px solid ${colors.gray3}`,
  borderBottom: `2px solid ${colors.gray3}`,
  borderRadius: '0',
  backgroundColor: colors.white,
  '&:hover': {
    backgroundColor: colors.bluegray
  }
})

interface ShiftCardProps {
  curSchedule: ExtendedScheduleSlot
  isSelected: boolean
  color?: Color
  opacity?: number
  currentShiftScheduleSlots?: ExtendedScheduleSlot[] | undefined
  style?: CSSProperties
}

const TimeRangeSlot = ({ curSchedule, color, isSelected, style, opacity }: ShiftCardProps) => {
  return (
    <div style={style}>
      <Typography
        variant='h3'
        style={{
          opacity: opacity || 1,
          color,
          display: 'flex',
          fontSize: '12px',
          fontWeight: isSelected ? 'bold' : 'normal'
        }}
      >
        <p id='shiftcard-hoursstart' style={{ margin: 0 }}>
          {moment(curSchedule.dateTimeStart).format('HH:mm')}
        </p>
        <p style={{ margin: 0 }}>{'-'}</p>
        <p id='shiftcard-hoursend' style={{ margin: 0 }}>
          {moment(curSchedule.dateTimeEnd).format('HH:mm')}
        </p>
      </Typography>
    </div>
  )
}

const ShiftCard = ({ curSchedule, currentShiftScheduleSlots, isSelected }: ShiftCardProps) => {
  const { currentShiftTab, currentPauseTab } = useIProcessState()
  const elementRef = useRef<HTMLDivElement | null>(null)
  const width = elementRef.current?.getBoundingClientRect().width
  const [elementWidth, setElementWidth] = useState<number | undefined>()
  // map schedule.i [0-23] to tab indices [0-7]
  const currentScheduleTabIndex = currentShiftScheduleSlots?.length
    ? curSchedule.i % currentShiftScheduleSlots?.length
    : 0
  const scheduleSlotsWithoutShiftChange = currentShiftScheduleSlots?.filter(
    (scheduleSlot) => scheduleSlot.type !== Type.ShiftChange
  )

  const borderRadiusStyle: CSSProperties = {
    borderTopLeftRadius: currentScheduleTabIndex === 0 ? '8px' : undefined,
    borderTopRightRadius:
      scheduleSlotsWithoutShiftChange?.length && scheduleSlotsWithoutShiftChange?.length - 1 === currentScheduleTabIndex
        ? '8px'
        : undefined
  }

  useEffect(() => {
    let mounted = true
    if (!elementWidth && mounted) {
      setElementWidth(width)
    }

    const listener = () => {
      const newElementWidth = elementRef.current?.getBoundingClientRect().width
      if (elementWidth !== newElementWidth) {
        setElementWidth(newElementWidth)
      }
    }
    window?.addEventListener('resize', listener)

    return () => {
      mounted = false
      window.removeEventListener('resize', listener)
    }
  }, [elementWidth, width])

  switch (true) {
    // * Current
    case currentScheduleTabIndex === currentShiftTab:
      return (
        <ShiftCardStyled id='shiftcard-running-hour' ref={elementRef} style={{ ...borderRadiusStyle }}>
          <Grid container item justifyContent='center' alignItems='center'>
            {currentShiftTab === currentPauseTab && (
              <BlinkingDotIcon
                style={{
                  background: `${colors.greenSuccess} 0% 0% no-repeat padding-box`,
                  border: `1px solid ${colors.greenTag}`
                }}
              />
            )}
            <TimeRangeSlot
              curSchedule={curSchedule}
              color={colors.blue}
              isSelected={isSelected}
              style={{ marginRight: '13px' }}
            />
            <Downtime downtime={curSchedule.downtime} width={elementWidth} />
            <KPI curSchedule={curSchedule} elementWidth={elementWidth} isSelected={isSelected} isCurrentSlot />
          </Grid>
        </ShiftCardStyled>
      )

    // * Past
    case currentScheduleTabIndex < currentShiftTab:
      return (
        <ShiftCardStyled ref={elementRef} style={{ ...borderRadiusStyle }}>
          <Grid container item justifyContent='center'>
            <TimeRangeSlot curSchedule={curSchedule} color={colors.darkBlue} isSelected={isSelected} />
            <Downtime downtime={curSchedule.downtime} width={elementWidth} />
            <KPI curSchedule={curSchedule} elementWidth={elementWidth} isSelected={isSelected} />
          </Grid>
        </ShiftCardStyled>
      )

    // * Future
    case currentScheduleTabIndex > currentShiftTab:
      return (
        <ShiftCardStyled style={{ ...borderRadiusStyle, backgroundColor: colors.gray5 }} ref={elementRef}>
          <Grid container item justifyContent='center'>
            <TimeRangeSlot curSchedule={curSchedule} isSelected={isSelected} color={colors.blue} opacity={0.5} />
            <Downtime downtime={curSchedule.downtime} width={elementWidth} />
            <KPI curSchedule={curSchedule} elementWidth={elementWidth} isSelected={isSelected} />
          </Grid>
        </ShiftCardStyled>
      )

    default:
      return <></>
  }
}

export default memo(ShiftCard)
