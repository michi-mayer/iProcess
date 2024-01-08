import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Paper, Table, TableBody, TableCell, TableContainer, Typography } from '@mui/material'
import { ROUTER } from 'routes/routing'
import DeleteDialog from 'components/Dialogs/DeleteDialog'
import EnhancedTableHead, { EnhancedHeader } from 'components/Tables/EnhancedTableHead'
import { defined } from 'helper/utils'
import useMutateReportMeasure from 'hooks/services/useMutateReportMeasure'
import useQueryListReportMeasures, { ReportMeasure } from 'hooks/services/useQueryListReportMeasures'
import useAllInfiniteData from 'hooks/useAllInfiniteData'
import useDialogHandler from 'hooks/useDialogHandler'
import useReportFilterOptions from 'hooks/useFilterOptions'
import useSortTable from 'hooks/useSortTable'
import TableSkeleton from 'lib/animation/TableSkeleton'
import MeasureRow from './MeasureRow'
import ReportFilter from './ReportFilter'

const headCells: EnhancedHeader<ReportMeasure>[] = [
  {
    id: 'description',
    numeric: false,
    label: 'description',
    width: '45%'
  },
  {
    id: 'progress',
    numeric: false,
    label: 'progress'
  }
]

const ReportMeasuresOverview = () => {
  const { t } = useTranslation(['admin', 'measures'])

  const { order, orderBy, handleRequestSort, sortWrapper } = useSortTable<ReportMeasure>({
    orderByDefault: 'description'
  })

  const { mutate, isError, isSuccess, isPending } = useMutateReportMeasure()
  const { open, handleClickOpen, handleClose } = useDialogHandler('measures')

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isPending: isLoadingReports,
    isSuccess: isSuccessReports
  } = useQueryListReportMeasures()

  const listReportMeasures = useAllInfiniteData<ReportMeasure>({
    fetchNextPage,
    hasNextPage,
    data
  })

  const [selectedReport, setSelectedReport] = useState<ReportMeasure>()
  const navigate = useNavigate()

  const filteredReports = useReportFilterOptions(listReportMeasures ?? [])

  const handleClickEdit = (reportId: string) => {
    navigate(`${ROUTER.MEASURES_UPDATE}/${reportId}`)
  }

  const handleClickDelete = (report: ReportMeasure) => {
    setSelectedReport(report)
    handleClickOpen()
  }

  return (
    <Paper
      style={{
        maxWidth: '1469px',
        margin: '1rem auto',
        padding: '1.5rem',
        minHeight: '96.5%'
      }}
    >
      <Typography variant='h2'>{t('measures:overview.measureReportOverview')}</Typography>

      <ReportFilter />

      <TableContainer sx={{ marginTop: '1rem' }}>
        <Table aria-label='review-table' size='medium'>
          <EnhancedTableHead
            headCells={headCells}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            firstChildrenCell={<TableCell width={1} />}
            lastChildrenCell={
              <>
                <TableCell align='right' />
                <TableCell align='right'>
                  <Typography variant='h3'>{t('measures:overview.action')}</Typography>
                </TableCell>
              </>
            }
          />
          <TableBody>
            {isLoadingReports && <TableSkeleton columns={3} rows={6} />}
            {isSuccessReports &&
              !!filteredReports &&
              sortWrapper(filteredReports).map((report) => {
                return (
                  <MeasureRow
                    key={report.id}
                    report={report}
                    onClickEdit={() => handleClickEdit(report.id)}
                    onClickDelete={() => handleClickDelete(report)}
                  />
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteDialog
        openDialog={open}
        onCloseDialog={handleClose}
        onClickDelete={() => mutate({ id: defined('ReportMeasuresOverview', selectedReport?.id) })}
        title={t('admin:deleteDialog.deleteItemTitle')}
        confirmToDeleteText={t('admin:deleteDialog.confirmToDelete')}
        itemName={selectedReport?.description}
        deleteButtonText={t('admin:deleteDialog.deleteButton')}
        discardButtonText={t('admin:deleteDialog.discardDeleteButton')}
        isLoading={isPending}
        isSuccess={isSuccess}
        isError={isError}
        onClickDiscard={handleClose}
        deleteButtonId='delete-measure-report-dialog-submit-button'
      />
    </Paper>
  )
}

export default ReportMeasuresOverview
