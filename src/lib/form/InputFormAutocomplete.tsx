import { CSSProperties, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Autocomplete, Box, Chip, Grid, Stack, TextField } from '@mui/material'
import { equals } from 'remeda'
import ErrorMessage from 'components/ErrorMessage'
import TeamIcon from 'components/Icons/user-group.svg'
import { StyledKeyboardArrowDownIcon } from 'components/Measures/ReportMeasures'
import { colors } from 'theme'
import { genericInputStyle } from './InputForm'

interface OptionChipProps {
  label: string | undefined
  onClick?: () => void
}

export const OptionChip = ({ label, onClick }: OptionChipProps) => (
  <Chip
    clickable
    onClick={onClick}
    label={label}
    icon={<img src={TeamIcon} alt='Team Icon' style={{ height: '16px', width: '16px' }} />}
    style={{
      padding: '4px 4px 4px 8px',
      backgroundColor: colors.blue,
      color: colors.white,
      fontSize: '12px',
      lineHeight: '24px',
      letterSpacing: '0.3px'
    }}
  />
)

type OptionChipComponent = (label: string) => ReactNode

type AutocompleteProps<T> = Parameters<typeof Autocomplete<T, boolean, boolean, boolean>>[0]

interface InputFormAutocompleteProps<T extends object | string> extends Omit<AutocompleteProps<T>, 'renderInput'> {
  isError?: boolean
  isDisabled?: boolean
  errorMessage?: string
  placeholder?: string
  OptionChipComponent?: OptionChipComponent
  name?: string
  selectedOptionText?: string
  EndAdornmentComponent?: (
    selectedOptionText: string | undefined,
    OptionChipComponent?: OptionChipComponent,
    value?: object | string
  ) => ReactNode
  onClickRemove?: () => void
  openOnFocus?: boolean
  style?: CSSProperties
  maxLength?: number
}

const InputFormAutocomplete = <T extends object | string>({
  placeholder,
  value,
  name,
  selectedOptionText,
  getOptionLabel,
  OptionChipComponent,
  EndAdornmentComponent,
  isError,
  errorMessage,
  isDisabled,
  style,
  openOnFocus = false,
  isOptionEqualToValue = (option, value) => equals(option, value),
  maxLength,
  ...props
}: InputFormAutocompleteProps<T>) => {
  const { t } = useTranslation('measures')

  const castOptionLabel = (option: string | T): string => {
    return !!getOptionLabel && typeof option !== 'string' ? getOptionLabel(option) : (option as string)
  }

  return (
    <Stack>
      <Autocomplete
        {...props}
        value={value}
        clearOnEscape
        noOptionsText={t('measures.noOptionsPlaceholder')}
        disabled={isDisabled}
        getOptionLabel={castOptionLabel}
        popupIcon={<StyledKeyboardArrowDownIcon style={{ margin: '0px 2px' }} />}
        style={{ width: '100%', marginRight: '1rem', ...style }}
        openOnFocus={openOnFocus}
        isOptionEqualToValue={isOptionEqualToValue}
        sx={{
          '&.MuiAutocomplete-noOptions': {
            display: 'none'
          }
        }}
        componentsProps={{
          paper: {
            sx: {
              '& .MuiAutocomplete-option.Mui-focused': {
                backgroundColor: colors.blueLightOpacity
              }
            }
          }
        }}
        renderInput={({ id, fullWidth, size, inputProps, InputProps }) => (
          <Grid container>
            <TextField
              type='text'
              variant='standard'
              name={name}
              error={isError}
              inputProps={{ ...inputProps, maxLength }}
              disabled={isDisabled}
              id={id}
              fullWidth={fullWidth}
              size={size}
              placeholder={placeholder}
              sx={{
                '&.MuiError': {
                  borderColor: colors.redError
                },
                '&.MuiDisabled': {
                  backgroundColor: colors.gray4
                }
              }}
              InputProps={{
                ref: InputProps.ref,
                value: inputProps.value,
                disableUnderline: true,
                style: {
                  ...genericInputStyle
                },
                endAdornment:
                  EndAdornmentComponent && value ? (
                    EndAdornmentComponent(selectedOptionText, OptionChipComponent, value)
                  ) : (
                    <Box>{InputProps.endAdornment}</Box>
                  )
              }}
            />
          </Grid>
        )}
      />
      <ErrorMessage id={`input-${name}-errorMessage`} error={isError} errorMessage={errorMessage} />
    </Stack>
  )
}

export default InputFormAutocomplete
