import { ChangeEvent, CSSProperties, forwardRef, HTMLInputTypeAttribute } from 'react'
import type { InputProps } from '@mui/material'
import { CircularProgress, Grid, Input, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import type { Variant } from '@mui/material/styles/createTypography'
import { CSSUnitSize } from 'types'
import ErrorMessage from 'components/ErrorMessage'
import { colors } from 'theme'

export const genericInputStyle: CSSProperties & { '&:hover': unknown } = {
  '&:hover': {
    backgroundColor: colors.gray4
  },
  padding: '3px 10px',
  borderRadius: 3,
  backgroundColor: colors.white,
  border: `1.5px solid ${colors.gray2}`,
  fontSize: '1rem'
}

export const CustomInput = styled(Input)({
  ...genericInputStyle,
  flex: 1,
  border: `1.5px solid ${colors.gray2}`,
  '&.Mui-focused': {
    border: `1.5px solid ${colors.blue}`
  },
  '&.Mui-error': {
    borderColor: colors.redError
  },
  '&.Mui-disabled': {
    backgroundColor: colors.gray4
  },
  /* The lines below remove the arrows on a <input type=number /> */
  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
    display: 'none'
  },
  '& input[type=number]': {
    MozAppearance: 'textfield'
  }
})

export interface InputFormProps extends InputProps {
  titleVariant?: Variant
  type?: HTMLInputTypeAttribute
  title?: string
  errorMessage?: string
  marginTop?: CSSUnitSize
  marginBottom?: CSSUnitSize
  isLoadingAdornmentSpinner?: boolean
  maxLength?: number
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

const InputForm = forwardRef(
  (
    {
      titleVariant = 'overline',
      title,
      error,
      errorMessage,
      value,
      name,
      marginTop = '1rem',
      marginBottom,
      isLoadingAdornmentSpinner,
      maxLength,
      ...props
    }: InputFormProps,
    ref
  ) => (
    <Grid container direction='column' style={{ marginTop, marginBottom }}>
      {title && <Typography variant={titleVariant}>{title}</Typography>}
      <CustomInput
        disableUnderline
        value={isLoadingAdornmentSpinner ? '' : value}
        error={error}
        name={name}
        ref={ref}
        componentsProps={{
          input: {
            min: 0,
            maxLength,
            // The step allows the input to have decimals
            step: '0.01'
          }
        }}
        startAdornment={
          isLoadingAdornmentSpinner ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : undefined
        }
        {...props}
      />
      <ErrorMessage id={`input-${name}-errorMessage`} error={error} errorMessage={errorMessage} />
    </Grid>
  )
)

InputForm.displayName = 'InputForm'

export default InputForm
