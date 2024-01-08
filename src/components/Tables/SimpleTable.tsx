import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableContainerTypeMap,
  TableHead,
  TableRow
} from '@mui/material'
import Typography from '@mui/material/Typography'
import deTables from 'i18n/de/tables.json'
import type { CSSUnitSize } from 'types'

type TableKey = keyof typeof deTables

export interface Header<T extends object> {
  id: keyof T
  label: TableKey
  width?: CSSUnitSize
}

export interface SimpleTableProps<T extends object> {
  headers: Header<T>[]
  data: T[]
  ariaLabel?: string
  tableStyle?: TableContainerTypeMap['props']['sx']
  hasActionButtons?: boolean
  renderTableRow: (data: T, index: number) => ReturnType<typeof TableRow>
}

const SimpleTable = <T extends object>({
  headers,
  data,
  renderTableRow,
  ariaLabel,
  tableStyle,
  hasActionButtons = false,
  children
}: PropsWithChildren<SimpleTableProps<T>>) => {
  const { t } = useTranslation('tables')

  return (
    <Stack>
      <TableContainer>
        <Table aria-label={ariaLabel} size='medium' stickyHeader sx={tableStyle}>
          <TableHead>
            <TableRow>
              {headers.map(({ id, label, width }) => (
                <TableCell key={id as string | number} align='left' style={{ width }}>
                  <Typography variant={'h3'}>{t(label)}</Typography>
                </TableCell>
              ))}
              {hasActionButtons && <TableCell />}
            </TableRow>
          </TableHead>
          <TableBody>{data.map((row, index) => renderTableRow(row, index))}</TableBody>
        </Table>
        {children}
      </TableContainer>
    </Stack>
  )
}

export default SimpleTable
