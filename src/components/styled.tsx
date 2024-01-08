import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import { colors } from 'theme'

export const OutletContainer = styled(Grid)({
  maxHeight: '100%',
  overflowY: 'auto'
})

export const FlexGrid = styled(Grid)({
  height: '100%',
  display: 'flex',
  alignItems: 'center'
})

export const DialogDivider = styled(Divider)({
  backgroundColor: colors.gray5,
  margin: '1.5rem 0rem'
})

export const AppGrid = styled(Grid)({
  justifyContent: 'center',
  alignItems: 'center',
  margin: 'auto'
})

export const Container = styled('div')({
  flex: 1,
  height: '100%',
  overflowY: 'auto'
})

export const ParetoFlexDiv = styled('div')({
  height: 'calc(100% - 70px)',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: '1000'
})

export const FullSizedForm = styled('form')({
  height: '100%',
  width: '100%',
  justifyContent: 'space-between'
})

export const useRadioStyles = makeStyles()(() => ({
  root: {
    borderRadius: '50%',
    width: 24,
    height: 24,
    marginLeft: 2,
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid ${colors.gray2}`,
    opacity: 1,
    backgroundColor: colors.white,
    '$root.Mui-focusVisible &': {
      outline: `2px auto ${colors.blue}`
    },
    'input:hover ~ &': {
      backgroundColor: colors.gray4
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: colors.gray2
    }
  },
  checkedIcon: {
    border: `1px solid ${colors.blue}`,
    '&:before': {
      borderRadius: '50%',
      width: 16,
      height: 16,
      backgroundColor: colors.blue,
      content: '""'
    },
    'input:hover ~ &': {
      backgroundColor: colors.gray4
    }
  }
}))
