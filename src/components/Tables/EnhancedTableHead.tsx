import { CSSProperties, MouseEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { TableCell, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material'
import type { Variant } from '@mui/material/styles/createTypography'
import TriangleIcon from 'components/Icons/TriangleIcon'
import { Order } from 'helper/sortData'
import { RecordKey } from 'shared/types'
import { Color } from 'theme'
import { Header } from './SimpleTable'

export interface EnhancedHeader<T extends object> extends Header<T> {
  numeric: boolean
}

interface EnhancedTableProps<T extends object> {
  onRequestSort: (event: MouseEvent<unknown>, property: keyof T) => void
  order: Order
  orderBy: RecordKey
  headCells: EnhancedHeader<T>[]
  firstChildrenCell?: ReactNode
  lastChildrenCell?: ReactNode
  typographyVariant?: Variant
  typographyColor?: Color
  typographyFontWeight?: CSSProperties['fontWeight']
  borderBottom?: CSSProperties['borderBottom']
  headerPadding?: CSSProperties['padding']
}

const EnhancedTableHead = <T extends object>({
  order,
  orderBy,
  onRequestSort,
  headCells,
  firstChildrenCell,
  lastChildrenCell,
  typographyVariant = 'h3',
  typographyColor,
  typographyFontWeight,
  borderBottom,
  headerPadding
}: EnhancedTableProps<T>) => {
  const { t } = useTranslation('tables')

  const createSortHandler = (property: keyof T) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {firstChildrenCell}
        {headCells.map(({ id, label, width }) => (
          <TableCell
            key={id as string | number}
            align='left'
            style={{ width, borderBottom, padding: headerPadding }}
            sortDirection={orderBy === id ? order : false}
          >
            <TableSortLabel
              IconComponent={TriangleIcon}
              active={orderBy === id}
              direction={orderBy === id ? order : 'asc'}
              onClick={createSortHandler(id)}
            >
              <Typography
                variant={typographyVariant}
                color={typographyColor}
                style={{ fontWeight: typographyFontWeight }}
              >
                {t(label)}
              </Typography>
            </TableSortLabel>
          </TableCell>
        ))}
        {lastChildrenCell}
      </TableRow>
    </TableHead>
  )
}

export default EnhancedTableHead
