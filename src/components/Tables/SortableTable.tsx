import type { CSSProperties, ReactNode } from 'react'
import { Stack, Table, TableBody, TableCell, TableContainer } from '@mui/material'
import EnhancedTableHead, { EnhancedHeader } from 'components/Tables/EnhancedTableHead'
import useSortTable, { UseSortTableProps } from 'hooks/useSortTable'
import { colors } from 'theme'

const DEFAULT_STYLE: CSSProperties = {
  padding: '6rem 4rem 4rem 4rem',
  backgroundColor: colors.white
}

interface SortableTableProps<T extends object> extends UseSortTableProps<T> {
  headers: EnhancedHeader<T>[]
  data: T[]
  renderTableRow: (data: T, index: number) => ReactNode // TableRow | undefined
  style?: CSSProperties
}

const SortableTable = <T extends object>({
  headers,
  orderByDefault,
  orderDirection,
  data,
  renderTableRow,
  style
}: SortableTableProps<T>) => {
  const { order, orderBy, handleRequestSort, sortWrapper } = useSortTable<T>({ orderByDefault, orderDirection })

  return (
    <Stack style={style ?? DEFAULT_STYLE}>
      <TableContainer sx={{ width: '100%' }}>
        <Table aria-label='sortable-table' size='medium' stickyHeader>
          <EnhancedTableHead
            headCells={headers}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            lastChildrenCell={<TableCell />}
          />
          <TableBody>{sortWrapper(data).map((_, index) => renderTableRow(_, index))}</TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}

export default SortableTable
