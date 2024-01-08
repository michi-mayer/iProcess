import { Skeleton, TableCell, TableRow } from '@mui/material'

interface Props {
  columns: number
  rows: number
  withButtons?: boolean
}

const TableSkeleton = ({ columns = 1, rows = 5, withButtons = false }: Props) => {
  const totalColumns = Array.from({ length: columns }, (_, i) => 1 + i)
  const totalRows = Array.from({ length: rows }, (_, i) => 1 + i)
  return (
    <>
      {totalColumns.map((column) => {
        return (
          <TableRow key={column + 20}>
            {totalRows.map((row) => (
              <TableCell key={row} align='right'>
                <Skeleton animation='wave' />
              </TableCell>
            ))}
            {withButtons && (
              <>
                <TableCell align='right'>
                  <Skeleton variant='circular' animation='wave' />
                </TableCell>
                <TableCell align='right'>
                  <Skeleton variant='circular' animation='wave' />
                </TableCell>
              </>
            )}
          </TableRow>
        )
      })}
    </>
  )
}

export default TableSkeleton
