import { CSSProperties } from 'react'
import DoneIcon from '@mui/icons-material/Done'
import { Chip as MuiChip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { colors } from 'theme'

export const ClassificationChipStyled = styled(MuiChip)({
  margin: '4px',
  userSelect: 'none',
  padding: '4px 12px',
  '&.MuiButtonBase-root': {
    '&:hover': {
      backgroundColor: colors.blueLightOpacity
    }
  },
  '& .MuiChip-label': {
    fontSize: '12px',
    fontWeight: 'bold',
    paddingLeft: 0,
    paddingRight: 0
  }
})

interface DoneIconSelectedProps {
  selected: boolean
  style?: CSSProperties
}

const DoneIconSelected = ({ selected, style }: DoneIconSelectedProps) => {
  if (selected) return <DoneIcon id='duration-chip-selected' fontSize='small' style={style} />
  return <div />
}

interface Props {
  selected: boolean
  doneIcon?: boolean
  onClick?: () => void
  label?: string | null
  iconPosition: 'left' | 'right'
  style?: CSSProperties
}

const Chip = ({ selected, doneIcon = false, onClick, label, iconPosition, style }: Props) => {
  return (
    <ClassificationChipStyled
      id={selected ? 'selected-classification-chip' : `classification-chip-${label}`}
      variant='outlined'
      label={label}
      onClick={onClick}
      style={{
        backgroundColor: selected ? (doneIcon ? `${colors.blueOpacity}` : colors.blue200Tertiary) : undefined,
        color: colors.blue,
        border: `1px solid ${colors.blue}`,
        ...style
      }}
      deleteIcon={<DoneIconSelected selected={selected && doneIcon} style={{ marginLeft: '4px' }} />}
      // eslint-disable-next-line unicorn/empty-brace-spaces
      onDelete={iconPosition === 'right' ? () => {} : undefined}
      icon={
        iconPosition === 'left' ? <DoneIconSelected selected={selected} style={{ marginRight: '4px' }} /> : undefined
      }
    />
  )
}

export default Chip
