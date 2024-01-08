import { forwardRef, RefObject } from 'react'
import { Switch, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import type { SwitchProps } from '@mui/material/Switch'
import { colors } from 'theme'

type SwitchRef = ((instance: HTMLButtonElement | null) => void) | RefObject<HTMLButtonElement> | null | undefined

const SwitchCustom = styled(
  // eslint-disable-next-line react/display-name
  forwardRef((props: SwitchProps, ref: SwitchRef) => (
    <Switch focusVisibleClassName='.Mui-focusVisible' ref={ref} disableRipple {...props} />
  ))
)(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: colors.blue,
        opacity: 1,
        border: 0
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
        backgroundColor: colors.gray3
      }
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: colors.blue,
      border: '6px solid #fff'
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: colors.gray5
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7
    }
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: colors.gray5,
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    })
  }
}))

interface SwitchToggleProps extends SwitchProps {
  text?: string
}

const SwitchToggle = ({ text, ...props }: SwitchToggleProps, ref: SwitchRef) => (
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    <SwitchCustom ref={ref} {...props} />
    {!!text && (
      <Typography variant='subtitle1' style={{ marginLeft: '12px' }}>
        {text}
      </Typography>
    )}
  </div>
)

export default forwardRef(SwitchToggle)
