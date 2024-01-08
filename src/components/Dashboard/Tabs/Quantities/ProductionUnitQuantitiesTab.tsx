import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
// MUI
import {
  Button,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import RejectedDialog from 'components/Dialogs/RejectedDialog/RejectedDialog'
import CheckIcon from 'components/Icons/CheckIcon'
import PlusIcon from 'components/Icons/PlusIcon'
import EnhancedTableHead, { EnhancedHeader } from 'components/Tables/EnhancedTableHead'
// Hooks
import { useIProcessState } from 'contexts/iProcessContext'
// Helper
import { isNumberString } from 'helper/isNum'
import { isUnitConnectedToMachine } from 'helper/units'
import useMutateActualCount from 'hooks/services/useMutateActualCount'
import useQueryRejectedCount from 'hooks/services/useQueryRejectedCount'
import useDialogHandler from 'hooks/useDialogHandler'
import useSortTable from 'hooks/useSortTable'
// Custom Components
import InputForm from 'lib/form/InputForm'
import { useQuantitiesStore } from '../DisruptionTabs'
import RejectedTableContainer from './RejectedTableContainer'

export const TableCellCustom = styled(TableCell)({
  padding: '8px'
})

export interface QuantitiesTable {
  partId: string | null | undefined
  product: string
  quota: number
  actualCount: number | undefined
  reject: number
  io: number
  delta: number
}

const headCells: EnhancedHeader<QuantitiesTable>[] = [
  {
    id: 'product',
    numeric: false,
    label: 'product'
  },
  {
    id: 'quota',
    numeric: true,
    label: 'quota'
  },
  {
    id: 'actualCount',
    numeric: true,
    label: 'actualCount'
  },
  {
    id: 'io',
    numeric: true,
    label: 'io'
  },
  {
    id: 'delta',
    numeric: true,
    label: 'delta'
  },
  {
    id: 'reject',
    numeric: true,
    label: 'reject'
  }
]

const ProductionUnitQuantitiesTab = () => {
  const { t } = useTranslation('iProcess')
  const [openTable, setOpenTable] = useState<boolean>(false)
  const [shouldOpenTable, setShouldOpenTable] = useState<boolean>(true)
  const { currentShiftScheduleSlots, selectedShiftTab, currentShiftTab, unitSelected } = useIProcessState()
  const currentScheduleSlot = currentShiftScheduleSlots?.[selectedShiftTab]
  const scheduleSlotId = currentShiftScheduleSlots?.[selectedShiftTab]?.id

  const disableUserEditActualCount =
    selectedShiftTab === currentShiftTab && unitSelected && isUnitConnectedToMachine(unitSelected)

  const { order, orderBy, handleRequestSort, sortWrapper } = useSortTable<QuantitiesTable>({
    orderByDefault: 'product'
  })
  const [actualCountState, setActualCount] = useQuantitiesStore((store) => store.actualCount)
  const { data, isFetching } = useQueryRejectedCount({
    startDateTime: currentScheduleSlot?.dateTimeStart ?? '',
    endDateTime: currentScheduleSlot?.dateTimeEnd ?? '',
    partId: currentScheduleSlot?.part?.id
  })
  const { mutate, isPending } = useMutateActualCount()
  const { open, handleClickOpen, handleClose } = useDialogHandler()
  const hasRejected = (data?.items?.length ?? 0) > 0
  const quota = currentScheduleSlot?.quota ?? 0
  const actualCount = currentScheduleSlot?.actualCount ?? 0
  const ioCount = data?.rejectedCount ? actualCount - data.rejectedCount : actualCount
  const quantities: QuantitiesTable = {
    partId: currentScheduleSlot?.part?.id,
    product: `${currentScheduleSlot?.part?.name} (${currentScheduleSlot?.part?.partNumber})`,
    quota,
    actualCount,
    io: ioCount,
    delta: ioCount - quota,
    reject: data?.rejectedCount ?? 0
  }

  const isActualCountUpdated = actualCount === actualCountState

  useEffect(() => {
    setActualCount({ actualCount })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualCount, selectedShiftTab])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (isNumberString(value) && value !== '') {
      setActualCount({ actualCount: Number.parseInt(value) })
    } else {
      setActualCount({ actualCount: 0 })
    }
  }

  const handleSubmitActualCount = (event?: FormEvent) => {
    event?.preventDefault()
    mutate({ scheduleSlotId, quota, actualCount: actualCountState })
  }

  const handleRowClick = () => {
    if (hasRejected && shouldOpenTable) {
      setOpenTable((previousState) => !previousState)
    }
  }

  return (
    <TableContainer sx={{ padding: '0 1rem' }}>
      <Table id='quantities-table' size='medium'>
        <EnhancedTableHead
          headCells={headCells}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          lastChildrenCell={<TableCell />}
          firstChildrenCell={<TableCell />}
          headerPadding='0 8px 16px 8px'
        />
        <TableBody>
          {!!currentScheduleSlot &&
            sortWrapper([quantities]).map((item, index) => {
              return (
                <Fragment key={index}>
                  <TableRow hover={hasRejected} onClick={handleRowClick}>
                    <TableCell style={{ width: '2%', padding: 0 }}>
                      {hasRejected && (
                        <IconButton aria-label='expand row' size='small'>
                          {openTable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCellCustom id='quantities-product' style={{ width: '30%' }}>
                      <Typography variant='body1'>{item.product}</Typography>
                    </TableCellCustom>
                    <TableCellCustom id='quantities-quota' style={{ width: '5%' }}>
                      <Typography variant='body1'>{item.quota}</Typography>
                    </TableCellCustom>
                    <TableCellCustom style={{ width: '15%' }}>
                      <form onSubmit={handleSubmitActualCount}>
                        <InputForm
                          maxLength={5}
                          onMouseEnter={() => setShouldOpenTable(false)}
                          onMouseLeave={() => setShouldOpenTable(true)}
                          style={{ position: 'relative', maxWidth: '150px' }}
                          endAdornment={
                            !isActualCountUpdated && (
                              <IconButton
                                type='submit'
                                style={{ position: 'absolute', right: 0, top: 0 }}
                                id='actual-count-submit'
                              >
                                {isPending || isFetching ? <CircularProgress size={20} /> : <CheckIcon />}
                              </IconButton>
                            )
                          }
                          marginTop='0px'
                          value={actualCountState || ''}
                          onChange={handleChange}
                          id='actual-count-input'
                          disabled={disableUserEditActualCount}
                        />
                      </form>
                    </TableCellCustom>
                    <TableCellCustom id='quantities-io' style={{ width: '12%' }}>
                      <Typography variant='body1'>{item.io}</Typography>
                    </TableCellCustom>
                    <TableCellCustom id='quantities-delta' style={{ width: '8%' }}>
                      <Typography variant='body1'>{item.delta}</Typography>
                    </TableCellCustom>
                    <TableCellCustom id='rejected' style={{ width: '8%' }}>
                      <Typography variant='body1'>{item.reject}</Typography>
                    </TableCellCustom>
                    <TableCellCustom align='right'>
                      <Button
                        variant='outlined'
                        color='primary'
                        startIcon={<PlusIcon />}
                        onClick={handleClickOpen}
                        onMouseEnter={() => setShouldOpenTable(false)}
                        onMouseLeave={() => setShouldOpenTable(true)}
                        id='quantities-add-rejected'
                        style={{ height: '40px' }}
                      >
                        <Typography variant='h3'>{t('disruptionList.addRejected')}</Typography>
                      </Button>
                    </TableCellCustom>
                  </TableRow>
                  <RejectedTableContainer isOpen={openTable} setOpenTable={setOpenTable} />
                </Fragment>
              )
            })}
        </TableBody>
      </Table>
      <RejectedDialog onClose={handleClose} openDialog={open} />
    </TableContainer>
  )
}

export default ProductionUnitQuantitiesTab
