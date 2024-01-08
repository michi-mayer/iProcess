import type { CSSProperties } from 'react'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'

type TypographyProps = Parameters<typeof Typography>[0]

interface TextTableItem {
  id: string
  value: string | number | undefined
}

interface TextTableCellsProps extends Pick<TypographyProps, 'variant'> {
  items: TextTableItem[]
  style?: CSSProperties
}

const TextTableCells = ({ items, variant, style }: TextTableCellsProps) => (
  <>
    {items.map(({ id, value }) => (
      <TableCell key={id} align='left' id={id} style={style}>
        <Typography variant={variant}>{value}</Typography>
      </TableCell>
    ))}
  </>
)

export default TextTableCells
