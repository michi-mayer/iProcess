import { Chip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { colors } from 'theme'

const CustomChip = styled(Chip)({
  marginRight: 2,
  marginBottom: 2,
  backgroundColor: colors.blue,
  color: colors.white,
  fontSize: '16px',
  height: '24px',
  justifyContent: 'space-around'
})

export default CustomChip
