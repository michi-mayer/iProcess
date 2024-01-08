// MUI
import { ChangeEvent, FormEventHandler, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { isNumber } from 'remeda'
import CheckIcon from 'components/Icons/CheckIcon'
import ErrorIcon from 'components/Icons/ErrorIcon'
import SuccessFilledIcon from 'components/Icons/SuccessFilledIcon'
import { useIProcessState } from 'contexts/iProcessContext'
import { defaultMaxRange, defaultMinRange } from 'helper/actualCount'
import { EMPTY_VALUE } from 'helper/constants'
import { isNumberString } from 'helper/isNum'
import { getTimeTabRange } from 'helper/utils'
import useMutateActualCount from 'hooks/services/useMutateActualCount'
import useQueryDisruptionsByTime from 'hooks/services/useQueryDisruptionsByTime'
import Toast from 'lib/animation/Toast'
import InputForm from 'lib/form/InputForm'
import { colors } from 'theme'
import { useQuantitiesStore } from '../DisruptionTabs'
import { TableCellCustom } from './ProductionUnitQuantitiesTab'
import { getQuantitiesValues, validateM100 } from './utils'

const HeadTableCell = styled(TableCell)({
  padding: '0 8px 16px 8px'
})

const AssemblyLineQuantitiesTab = () => {
  const { t } = useTranslation(['iProcess', 'tables'])
  const { currentShiftScheduleSlots, selectedShiftTab, unitSelected, previousShiftScheduleSlots, currentShiftTab } =
    useIProcessState()

  const timeTabRange = getTimeTabRange(currentShiftScheduleSlots, selectedShiftTab)
  const { data: disruptionsSortedByMostRecent } = useQueryDisruptionsByTime(timeTabRange)

  const [isSavedWithCorrectRange, setIsSavedWithCorrectRange] = useState(false)
  const [{ isOutOfRange, fromIsOutOfRange, untilIsOutOfRange }, setIsOutOfRange] = useState({
    isOutOfRange: false,
    fromIsOutOfRange: false,
    untilIsOutOfRange: false
  })
  const [{ vehicleNumber: vehicleNumberState }, setActualCount] = useQuantitiesStore((store) => store)

  const {
    isVehicleNumberFromUpdated,
    isVehicleNumberUntilUpdated,
    currentScheduleSlotId,
    previousScheduleSlotId,
    quantities,
    vehicleNumber,
    actualCountPreviousScheduleSlot,
    actualCountNextScheduleSlot,
    nextVehicleNumber,
    nextScheduleSlotId
  } = useMemo(
    () =>
      getQuantitiesValues({
        currentShiftScheduleSlots,
        previousShiftScheduleSlots,
        selectedShiftTab,
        vehicleNumberState,
        maxRange: unitSelected?.m100Range?.max ?? defaultMaxRange,
        minRange: unitSelected?.m100Range?.min ?? defaultMinRange
      }),
    [
      currentShiftScheduleSlots,
      previousShiftScheduleSlots,
      selectedShiftTab,
      unitSelected?.m100Range?.max,
      unitSelected?.m100Range?.min,
      vehicleNumberState
    ]
  )

  const { mutate, isPending } = useMutateActualCount()

  const handleSubmitActualCount: FormEventHandler<HTMLFormElement> = (event) => {
    event?.preventDefault()
    const m100Range = unitSelected?.m100Range
    const betweenRange: [boolean, boolean] = [true, true] // First position is "from" and second position is "until"
    let isSafeToChange = false

    // Tab previous to selected schedule Slot (Time Tab)
    validateM100(vehicleNumberState, m100Range, ({ isFromBetweenRange, vehicleNumber }) => {
      betweenRange[0] = isFromBetweenRange
      if (isFromBetweenRange && selectedShiftTab !== 0 && currentShiftScheduleSlots) {
        const firstTabId = currentShiftScheduleSlots[0]?.id
        const firstTabFrom = currentShiftScheduleSlots[0]?.vehicleNumber?.from || undefined
        mutate({
          scheduleSlotId: previousScheduleSlotId,
          vehicleNumber: {
            from: previousScheduleSlotId === firstTabId ? firstTabFrom : undefined,
            until: selectedShiftTab !== 0 ? vehicleNumber.from : undefined
          },
          actualCount: actualCountPreviousScheduleSlot
        })
      }
    })

    // Selected Tab
    validateM100(vehicleNumberState, m100Range, ({ isUntilBetweenRange, isFromBetweenRange, vehicleNumber }) => {
      betweenRange[0] = isFromBetweenRange
      betweenRange[1] = isUntilBetweenRange
      isSafeToChange = betweenRange.every(Boolean)
      if (isSafeToChange) {
        mutate({
          scheduleSlotId: currentScheduleSlotId,
          quota: quantities.quota,
          vehicleNumber: {
            until: vehicleNumber.until,
            from: selectedShiftTab === 0 ? vehicleNumber.from : undefined
          },
          actualCount: quantities.actualCount
        })
        if (selectedShiftTab !== currentShiftTab) {
          mutate({
            scheduleSlotId: nextScheduleSlotId,
            vehicleNumber: { until: nextVehicleNumber },
            actualCount: actualCountNextScheduleSlot
          })
        }
      }
    })

    isSafeToChange = betweenRange.every(Boolean)

    if (isSafeToChange && isOutOfRange) {
      /**
       * At this point, "isOutOfRange" is still not updated with the latest information which means the error is
       * still showing in the UI, therefore, we only want to show the isSaveWithCorrectRange popup
       * whenever the error message is shown, and not every time we update the DB
       * */
      setIsSavedWithCorrectRange(true)
    }

    setIsOutOfRange({
      isOutOfRange: !isSafeToChange,
      fromIsOutOfRange: !betweenRange[0],
      untilIsOutOfRange: !betweenRange[1]
    })
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target
    if (isNumberString(value) && value !== '') {
      setActualCount({ vehicleNumber: { ...vehicleNumberState, [name]: Number.parseInt(value) } })
      setIsOutOfRange((previousState) => ({ ...previousState, [`${name}IsOutOfRange`]: false }))
      setIsSavedWithCorrectRange(false)
    } else {
      setActualCount({ vehicleNumber: { ...vehicleNumberState, [name]: 0 } })
    }
  }

  const totalQuantityLoss = useMemo(() => {
    return (
      disruptionsSortedByMostRecent?.reduce((sum, disruption) => {
        return sum + (disruption.lostVehicles || 0)
      }, 0) || 0
    )
  }, [disruptionsSortedByMostRecent])

  useEffect(() => {
    setActualCount({
      vehicleNumber: {
        from: vehicleNumber.from,
        until: vehicleNumber.until
      }
    })
  }, [setActualCount, vehicleNumber.from, vehicleNumber.until])

  const renderIcon = useCallback((isOutOfRange: boolean) => {
    return isOutOfRange ? <ErrorIcon /> : <CheckIcon />
  }, [])

  return (
    <form onSubmit={handleSubmitActualCount}>
      {isOutOfRange && (
        <Toast
          Icon={<ErrorIcon style={{ marginLeft: '8px' }} />}
          borderColor={colors.redError}
          description={t('iProcess:quantitiesCard.rangeError', {
            min: unitSelected?.m100Range?.min || defaultMinRange,
            max: unitSelected?.m100Range?.max || defaultMaxRange
          })}
        />
      )}
      {isSavedWithCorrectRange && (
        <Toast
          Icon={<SuccessFilledIcon style={{ marginLeft: '8px' }} fill={colors.greenSuccess} />}
          borderColor={colors.greenSuccess}
          description={t('iProcess:quantitiesCard.changesSaved')}
          onClose={() => setIsSavedWithCorrectRange(false)}
        />
      )}
      <TableContainer sx={{ padding: '0 1rem' }}>
        <Table id='quantities-table' size='medium'>
          <TableHead>
            <TableRow>
              <HeadTableCell align='left'>
                <Typography variant='h3'>{t('tables:product')}</Typography>
              </HeadTableCell>
              <HeadTableCell align='left'>
                <Typography variant='h3'>{t('tables:actualFrom')}</Typography>
              </HeadTableCell>
              <HeadTableCell align='left'>
                <Typography variant='h3'>{t('tables:actualUntil')}</Typography>
              </HeadTableCell>
              <HeadTableCell align='left'>
                <Typography variant='h3'>{t('tables:actualCount')}</Typography>
              </HeadTableCell>
              <HeadTableCell align='left'>
                <Typography variant='h3'>{t('tables:delta')}</Typography>
              </HeadTableCell>
              <HeadTableCell align='left'>
                <Typography variant='h3'>{t('iProcess:disruptionReview.quantityLoss')}</Typography>
              </HeadTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCellCustom id='quantities-product'>
                <Typography variant='body1'>{quantities.product}</Typography>
              </TableCellCustom>
              <TableCellCustom id='quantities-quota'>
                <InputForm
                  maxLength={5}
                  name='from'
                  style={{ position: 'relative', width: '81px' }}
                  error={fromIsOutOfRange}
                  endAdornment={
                    !isVehicleNumberFromUpdated && (
                      <IconButton
                        type='submit'
                        style={{ position: 'absolute', right: 0, top: 0, marginTop: 3 }}
                        id='actual-count-submit'
                      >
                        {isPending ? <CircularProgress size={20} /> : renderIcon(fromIsOutOfRange)}
                      </IconButton>
                    )
                  }
                  marginTop='0px'
                  value={vehicleNumberState.from || ''}
                  onChange={handleChange}
                  id='actualCount-from'
                />
              </TableCellCustom>
              <TableCellCustom>
                <InputForm
                  maxLength={5}
                  name='until'
                  style={{ position: 'relative', width: '81px' }}
                  error={untilIsOutOfRange}
                  endAdornment={
                    !isVehicleNumberUntilUpdated && (
                      <IconButton
                        type='submit'
                        style={{ position: 'absolute', right: 0, top: 0, marginTop: 3 }}
                        id='actual-count-submit'
                      >
                        {isPending ? <CircularProgress size={20} /> : renderIcon(untilIsOutOfRange)}
                      </IconButton>
                    )
                  }
                  marginTop='0px'
                  value={vehicleNumberState.until || ''}
                  onChange={handleChange}
                  id='actualCount-until'
                />
              </TableCellCustom>
              <TableCellCustom id='quantities-io'>
                <Typography variant='body1'>
                  {vehicleNumberState.until && vehicleNumberState.from && isNumber(quantities.actualCount)
                    ? quantities.actualCount
                    : EMPTY_VALUE}
                </Typography>
              </TableCellCustom>
              <TableCellCustom id='quantities-delta'>
                <Typography variant='body1'>
                  {vehicleNumberState.until && vehicleNumberState.from ? quantities.delta : EMPTY_VALUE}
                </Typography>
              </TableCellCustom>
              <TableCellCustom id='quantity-loss'>
                <Typography variant='body1'>{totalQuantityLoss || EMPTY_VALUE}</Typography>
              </TableCellCustom>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </form>
  )
}

export default AssemblyLineQuantitiesTab
