import { useTranslation } from 'react-i18next'
import { Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Measure } from 'APIcustom'
import measures from 'i18n/en/measures.json'
import StatusIcon from 'components/Icons/StatusIcon'
import EnhancedTableHead, { EnhancedHeader } from 'components/Tables/EnhancedTableHead'
import useSortTable from 'hooks/useSortTable'
import { colors } from 'theme'

type keyStatus = keyof typeof measures.status

const CustomTableCell = styled(TableCell)({
  padding: '8px',
  borderBottom: 'none'
})

const headCells: EnhancedHeader<Measure>[] = [
  {
    id: 'description',
    numeric: false,
    label: 'measures',
    width: '20%'
  },
  {
    id: 'subDepartment',
    numeric: false,
    label: 'subDepartment',
    width: '20%'
  },
  {
    id: 'dueDate',
    numeric: false,
    label: 'dueDate',
    width: '20%'
  },
  {
    id: 'status',
    numeric: false,
    label: 'status',
    width: '40%'
  }
]

const MeasureTable = ({ measures }: { measures: Measure[] }) => {
  const { t } = useTranslation('measures')
  const { order, orderBy, handleRequestSort, sortWrapper } = useSortTable<Measure>({ orderByDefault: 'description' })
  return (
    <TableContainer sx={{ backgroundColor: colors.gray5, margin: '1rem 0' }}>
      <Table aria-label='review-table' size='medium'>
        <EnhancedTableHead
          headCells={headCells}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          typographyVariant='body1'
          typographyColor={colors.black}
          typographyFontWeight='bold'
          borderBottom='none'
          headerPadding='8px'
        />
        <TableBody>
          {sortWrapper(measures).map((report) => {
            return (
              <TableRow key={report?.id}>
                <CustomTableCell>
                  <Typography variant='body1'>{report.description}</Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant='body1'>{report.subDepartment}</Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant='body1'>{report.dueDate}</Typography>
                </CustomTableCell>
                <CustomTableCell align='left' style={{ display: 'flex', alignItems: 'center' }}>
                  <StatusIcon status={report.status} />
                  <Typography variant='body1' style={{ marginLeft: '1rem' }}>
                    {t(`status.${report?.status.toLowerCase() as keyStatus}`)}
                  </Typography>
                </CustomTableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default MeasureTable
