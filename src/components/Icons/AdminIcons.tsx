import CategoryIcon from '@mui/icons-material/Category'
import DateRangeIcon from '@mui/icons-material/DateRange'
import { styled } from '@mui/material/styles'
import { colors } from 'theme'

const styles = {
  fontSize: 32,
  marginRight: '1.5rem',
  color: colors.gray1
}

export const DisruptionIcon = styled(CategoryIcon)({
  ...styles
})

export const ShiftModelIcon = styled(DateRangeIcon)({
  ...styles
})
