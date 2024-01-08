import { forwardRef } from 'react'
import { InputProps, Typography } from '@mui/material'
import { colors } from 'theme'
import { CustomInput } from './InputForm'

interface Props extends InputProps {
  errorMessage?: string
  isError?: boolean
}

const DatePicker = forwardRef(({ isError = false, errorMessage, ...restOfProps }: Props, ref) => {
  return (
    <>
      <CustomInput ref={ref} type='date' error={isError} disableUnderline {...restOfProps} />
      {isError && errorMessage && (
        <Typography variant='caption' style={{ color: colors.redError, fontSize: 12 }}>
          {errorMessage}
        </Typography>
      )}
    </>
  )
})

DatePicker.displayName = 'DatePicker'

export default DatePicker
