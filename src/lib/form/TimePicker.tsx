import { ChangeEventHandler, FocusEventHandler, forwardRef } from 'react'
import { TextField } from '@mui/material'

interface TimePickerProps {
  onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> | undefined
  onBlur: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement> | undefined
  errorMessage: string
  name: string
  isError: boolean
  value?: string
  type?: 'datetime-local' | 'date'
}

const TimePicker = forwardRef(
  ({ onChange, onBlur, errorMessage, name, value, isError, type = 'datetime-local' }: TimePickerProps, ref) => {
    return (
      <TextField
        id='datetime-local'
        type={type}
        name={name}
        value={value}
        inputRef={ref}
        onChange={onChange}
        onBlur={onBlur}
        helperText={isError ? errorMessage : undefined}
        error={isError}
        InputLabelProps={{
          shrink: true
        }}
        variant='standard'
      />
    )
  }
)

TimePicker.displayName = 'TimePicker'

export default TimePicker
