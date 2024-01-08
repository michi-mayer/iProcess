import { forwardRef, HTMLInputTypeAttribute } from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { InputAdornment, InputProps } from '@mui/material'
import { colors } from 'theme'
import { CustomInput } from './InputForm'

export interface NavigationInputFormProps extends Omit<InputProps, 'type'> {
  error: boolean | undefined
  hasAdornment?: boolean
  isSelected?: boolean
  type?: HTMLInputTypeAttribute
  onClickAdornment?: () => void
}

const getInputBorderColor = (value?: unknown, hasAdornment?: boolean, error?: boolean) =>
  error && (value === '' || value === undefined) ? colors.redError : hasAdornment ? colors.blue : colors.gray2

const NavigationInputForm = forwardRef<unknown, NavigationInputFormProps>(
  ({ onClickAdornment, error, isSelected = false, hasAdornment = false, style, ...props }, ref) => {
    return (
      <CustomInput
        disableUnderline
        style={{
          backgroundColor: hasAdornment && isSelected ? colors.bluegray : '',
          borderColor: getInputBorderColor(props.value, hasAdornment, error),
          display: 'flex',
          marginRight: '0.5rem',
          cursor: 'pointer',
          ...style
        }}
        id={`input-${props.name}`}
        error={error}
        endAdornment={
          hasAdornment && (
            <InputAdornment position='start' onClick={onClickAdornment} id={`path-adornment-${props.name}`}>
              <ChevronRightIcon color='primary' />
            </InputAdornment>
          )
        }
        {...props}
        ref={ref}
        {...props}
      />
    )
  }
)

NavigationInputForm.displayName = 'NavigationInputForm'

export default NavigationInputForm
