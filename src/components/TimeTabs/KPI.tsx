import { CSSProperties, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CircularProgress, Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { isNumber } from 'remeda'
import { isAssemblyLine, isProductionUnit } from 'types'
import { ExtendedScheduleSlot, ExtendedUnit, GetStartEndDateForShift, useIProcessState } from 'contexts/iProcessContext'
import { EMPTY_VALUE } from 'helper/constants'
import { getStartEndDateForTime } from 'helper/time'
import { isUnitConnectedToMachine } from 'helper/units'
import useQueryRejectedCount from 'hooks/services/useQueryRejectedCount'
import useCalculateIoCount from 'hooks/useCalculateIoCount'
import Counter from 'lib/animation/Counter'
import { Color, colors } from 'theme'

const cardStyle: CSSProperties = {
  boxShadow: 'none',
  borderRadius: '0',
  height: '100%',
  width: '100%',
  backgroundColor: 'transparent',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const QuotaCard = styled(Card)({
  ...cardStyle,
  paddingTop: '4px',
  borderBottom: `0.5px solid ${colors.gray3}`
})

const ActualCard = styled(Card)({
  ...cardStyle,
  paddingTop: '4px',
  paddingLeft: '10px',
  borderBottom: `0.5px solid ${colors.gray3}`
})

const NioCard = styled(Card)({
  ...cardStyle,
  paddingTop: '8px'
})

const IoCard = styled(Card)({
  ...cardStyle,
  paddingTop: '8px'
})

interface KPIProps {
  curSchedule: ExtendedScheduleSlot
  isSelected: boolean
  elementWidth?: number
  isCurrentSlot?: boolean
}

const calculateDelta = (quota: number, actualCount?: number | null) => {
  if (actualCount || actualCount === 0) {
    return actualCount - quota
  }
}

const getCounterValue = (actualCount: number | null | undefined) => {
  if (actualCount || actualCount === 0) return actualCount
  return EMPTY_VALUE
}

const KPI = ({ curSchedule, isSelected, elementWidth, isCurrentSlot }: KPIProps) => {
  const { t } = useTranslation('iProcess')
  const { selectedShiftTab, currentTime, currentDate, productSelected: partSelected, unitSelected } = useIProcessState()
  const [dateTimeRange, setDateTimeRange] = useState<GetStartEndDateForShift>({
    startDateTime: '',
    endDateTime: ''
  })

  const counterValue = getCounterValue(curSchedule.actualCount)

  const allowMachineAnimation = unitSelected && isUnitConnectedToMachine(unitSelected) && isCurrentSlot
  const [ioFontColor, setIoFontColor] = useState<Color>(colors.black)

  const delta = calculateDelta(curSchedule?.quota, curSchedule?.actualCount)

  const { startDateTime, endDateTime } = getStartEndDateForTime({
    currentSchedule: curSchedule
  })
  const { data, isPending } = useQueryRejectedCount({
    startDateTime,
    endDateTime,
    partId: curSchedule.part?.id
  })

  useEffect(() => {
    let mounted = true
    const getDateTimeRange = () => {
      if (curSchedule) {
        const dateTimeRange = getStartEndDateForTime({
          currentSchedule: curSchedule
        })
        if (dateTimeRange.startDateTime === dateTimeRange.endDateTime) return
        setDateTimeRange(dateTimeRange)
      }
    }
    if (mounted && curSchedule) getDateTimeRange()
    return () => {
      mounted = false
    }
  }, [currentDate, currentTime, curSchedule, selectedShiftTab, unitSelected])

  const ioCalculation = useCalculateIoCount({
    rejectedCount: data?.rejectedCount,
    actualCount: curSchedule.actualCount ?? undefined,
    partSelected,
    unitSelected: unitSelected ?? ({} as ExtendedUnit),
    selectedShiftTab,
    startDateTime
  })

  useEffect(() => {
    let mounted = true
    if (isNumber(ioCalculation.ioCount) && isNumber(curSchedule?.actualCount) && mounted) {
      if (ioCalculation.ioCount < curSchedule.actualCount || (isAssemblyLine(unitSelected) && delta && delta < 0)) {
        setIoFontColor(colors.red)
      } else {
        setIoFontColor(colors.green)
      }
    }
    return () => {
      mounted = false
    }
  }, [ioCalculation, curSchedule.actualCount, delta, unitSelected])

  return (
    <Grid container item style={{ textAlign: 'left', margin: '0 10px' }}>
      <Grid item xs={6}>
        <QuotaCard>
          <Grid item>
            <Typography variant='h5'>{t('timeTabs.quota')}</Typography>
          </Grid>
          <Grid item>
            <Typography id='shiftcard-past-quota' variant='body1' fontWeight={isSelected ? 'bold' : undefined}>
              {curSchedule.quota || EMPTY_VALUE}
            </Typography>
          </Grid>
        </QuotaCard>
      </Grid>
      <Grid item xs={6}>
        <ActualCard>
          <Grid item>
            <Typography variant='h5'>{t('timeTabs.actualCount')}</Typography>
          </Grid>
          <Grid item>
            {allowMachineAnimation ? (
              <Counter value={counterValue} />
            ) : (
              <Typography
                variant='body1'
                id={`actualCount-TimeTabs-${curSchedule.i}`}
                fontWeight={isSelected ? 'bold' : undefined}
              >
                {curSchedule.actualCount === 0 || !!curSchedule.actualCount
                  ? curSchedule.actualCount.toString()
                  : EMPTY_VALUE}
              </Typography>
            )}
          </Grid>
        </ActualCard>
      </Grid>
      {isProductionUnit(unitSelected) && (
        <Grid item xs={6}>
          <NioCard>
            <Grid item>
              {elementWidth && elementWidth <= 145 ? (
                <Typography variant='h5'>{t('timeTabs.shortRejected')}</Typography>
              ) : (
                <Typography variant='h5'>{t('timeTabs.rejected')}</Typography>
              )}
            </Grid>
            <Grid item>
              {isPending ? (
                <CircularProgress size={25} />
              ) : (
                <Typography
                  variant='body1'
                  id={`nioCount-TimeTabs-${curSchedule.i}`}
                  fontWeight={isSelected ? 'bold' : undefined}
                >
                  {data?.startDateTime === dateTimeRange.startDateTime && data.rejectedCount
                    ? data.rejectedCount
                    : EMPTY_VALUE}
                </Typography>
              )}
            </Grid>
          </NioCard>
        </Grid>
      )}
      <Grid item xs={6}>
        <IoCard>
          <Grid item>
            <Typography variant='h5'>
              {isAssemblyLine(unitSelected) ? t('quantitiesCard.quantitiesDifference') : t('timeTabs.io')}
            </Typography>
          </Grid>
          {isAssemblyLine(unitSelected) ? (
            <Grid item>
              <Typography
                style={{ color: ioFontColor }}
                variant='body1'
                id={`ioCount-TimeTabs-${curSchedule.i}`}
                fontWeight={isSelected ? 'bold' : undefined}
              >
                {delta || EMPTY_VALUE}
              </Typography>
            </Grid>
          ) : (
            <Grid item>
              {ioCalculation.ioCount === undefined ? (
                <CircularProgress size={25} />
              ) : (
                <Typography
                  style={{ color: ioFontColor }}
                  variant='body1'
                  id={`ioCount-TimeTabs-${curSchedule.i}`}
                  fontWeight={isSelected ? 'bold' : undefined}
                >
                  {ioCalculation?.startDateTime === dateTimeRange.startDateTime && ioCalculation.ioCount !== 0
                    ? ioCalculation.ioCount
                    : EMPTY_VALUE}
                </Typography>
              )}
            </Grid>
          )}
        </IoCard>
      </Grid>
    </Grid>
  )
}

export default KPI
