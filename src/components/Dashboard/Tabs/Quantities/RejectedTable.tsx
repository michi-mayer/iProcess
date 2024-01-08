import { CSSProperties, ReactNode, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material'
import deProduction from 'i18n/de/iProcess.json'
import DeleteDialog from 'components/Dialogs/DeleteDialog'
import RejectedDialog from 'components/Dialogs/RejectedDialog/RejectedDialog'
import EnhancedTableHead, { EnhancedHeader } from 'components/Tables/EnhancedTableHead'
import { useIProcessState } from 'contexts/iProcessContext'
import { formatTimeStamp } from 'helper/time'
import { truncateText } from 'helper/truncateText'
import useMutateRejected from 'hooks/services/useMutateRejected'
import useQueryRejectedCount, { Rejected } from 'hooks/services/useQueryRejectedCount'
// Custom Components
import useDialogHandler from 'hooks/useDialogHandler'
import useSortTable from 'hooks/useSortTable'
import { ActionButtons } from 'lib/ui/Buttons'
import { Color, colors } from 'theme'

type TimeTabsKey = keyof typeof deProduction.timeTabs

interface Props {
  backgroundColor?: Color
  firstChildrenCell?: ReactNode
  firstColumnInfo: 'type' | 'productName'
  headerPadding?: CSSProperties['padding']
  containerStyle?: CSSProperties
  onOpenTable?: (value: boolean) => void
}

const RejectedTable = ({
  backgroundColor,
  firstChildrenCell,
  firstColumnInfo,
  headerPadding,
  containerStyle,
  onOpenTable
}: Props) => {
  const headCells: EnhancedHeader<Rejected>[] = useMemo(
    () => [
      {
        id: firstColumnInfo,
        numeric: false,
        label: firstColumnInfo
      },
      {
        id: 'typeOfDamage',
        numeric: false,
        label: 'typeOfDamage'
      },
      {
        id: 'timeStamp',
        numeric: false,
        label: 'timeStamp'
      },
      {
        id: 'classification',
        numeric: false,
        label: 'classification'
      },

      {
        id: 'count',
        numeric: true,
        label: 'count'
      }
    ],
    [firstColumnInfo]
  )

  const cellStyle =
    firstColumnInfo === 'type'
      ? {
          borderTop: `1px solid ${colors.gray3}`,
          paddingLeft: '8px'
        }
      : {}
  const { t } = useTranslation(['iProcess', 'admin'])
  const [rejectSelected, setRejectSelected] = useState<Rejected>()
  const { currentShiftScheduleSlots, selectedShiftTab, productSelected: partSelected } = useIProcessState()
  const currentScheduleSlot = currentShiftScheduleSlots?.[selectedShiftTab]
  const { order, orderBy, handleRequestSort, sortWrapper } = useSortTable<Rejected>({ orderByDefault: 'type' })
  const itemName = t('admin:deleteDialog.rejectedMessage', {
    count: rejectSelected?.count,
    type: rejectSelected?.typeOfDamage,
    productName: rejectSelected?.productName
  })
  const { data } = useQueryRejectedCount({
    startDateTime: currentScheduleSlot?.dateTimeStart ?? '',
    endDateTime: currentScheduleSlot?.dateTimeEnd ?? '',
    partId: partSelected.id
  })
  const { mutate: deleteRejected, isSuccess } = useMutateRejected('delete')
  const { open, handleClickOpen, handleClose } = useDialogHandler()
  const {
    open: openDelete,
    handleClickOpen: handleClickOpenDelete,
    handleClose: handleCloseDelete
  } = useDialogHandler()

  useEffect(() => {
    if (onOpenTable && data?.items?.length === 0) {
      onOpenTable(false)
    }
  }, [data?.items?.length, onOpenTable])

  /* Handlers */
  const handleClickEdit = (rejected: Rejected) => {
    setRejectSelected(rejected)
    handleClickOpen()
  }

  const handleClickDelete = (rejected: Rejected) => {
    setRejectSelected(rejected)
    handleClickOpenDelete()
  }
  const deleteItem = () => {
    if (rejectSelected) {
      const rejectedData = {
        id: rejectSelected.id,
        count: rejectSelected.count,
        timeStamp: rejectSelected?.timeStamp,
        productName: rejectSelected.productName,
        productId: rejectSelected.productId
      }
      deleteRejected(rejectedData)
    }
  }

  return (
    <>
      <TableContainer sx={{ backgroundColor, ...containerStyle }}>
        <Table aria-label='review-table' size='medium'>
          <EnhancedTableHead
            headCells={headCells}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            firstChildrenCell={firstChildrenCell}
            lastChildrenCell={<TableCell />}
            headerPadding={headerPadding}
          />
          <TableBody>
            {sortWrapper(data?.items ?? []).map((rejected, index) => {
              return (
                <TableRow key={rejected?.id}>
                  {!!firstChildrenCell && <TableCell style={{ ...cellStyle, width: '2%', padding: 0 }}></TableCell>}
                  <TableCell
                    style={{ ...cellStyle, width: firstColumnInfo === 'type' ? '30%' : '23%' }}
                    id={`rejected-product-${index}`}
                  >
                    {firstColumnInfo === 'type' ? (
                      <Typography variant='body1'>{t(`iProcess:timeTabs.${rejected.type as TimeTabsKey}`)}</Typography>
                    ) : (
                      <Typography variant='body1'>{rejected.productName}</Typography>
                    )}
                  </TableCell>
                  <TableCell style={{ ...cellStyle }} id={`rejected-damage-${index}`}>
                    <Typography variant='body1'>
                      {truncateText({ maxTextLength: 14, text: rejected.typeOfDamage })}
                    </Typography>
                  </TableCell>
                  <TableCell style={{ ...cellStyle }} id={`rejected-timestamp-${index}`}>
                    <Typography variant='body1'>{formatTimeStamp(rejected.timeStamp)}</Typography>
                  </TableCell>
                  <TableCell style={{ ...cellStyle }} id={`rejected-classification-${index}`}>
                    <Typography variant='body1'>{rejected.classification}</Typography>
                  </TableCell>

                  <TableCell style={{ ...cellStyle }} id={`rejected-amount-${index}`}>
                    <Typography variant='body1'>{rejected.count}</Typography>
                  </TableCell>
                  <TableCell id={`edit-rejected-${rejected.id}`} align='right' padding='none' style={{ ...cellStyle }}>
                    <ActionButtons
                      onClickDelete={() => handleClickDelete(rejected)}
                      onClickEdit={() => handleClickEdit(rejected)}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <RejectedDialog openDialog={open} onClose={handleClose} rejected={rejectSelected} />
      <DeleteDialog
        title={t('admin:deleteDialog.deleteItemTitle')}
        openDialog={openDelete}
        itemName={itemName}
        deleteButtonText={t('admin:deleteDialog.deleteButton')}
        discardButtonText={t('admin:deleteDialog.discardDeleteButton')}
        onCloseDialog={handleCloseDelete}
        onClickDiscard={handleCloseDelete}
        onClickDelete={deleteItem}
        isSuccess={isSuccess}
        confirmToDeleteText={t('admin:deleteDialog.confirmToDelete')}
      />
    </>
  )
}

export default RejectedTable
