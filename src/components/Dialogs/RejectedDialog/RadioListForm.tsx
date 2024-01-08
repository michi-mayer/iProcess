import { ChangeEvent, forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FormControl,
  FormControlLabel,
  ListItem,
  ListItemButton,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { Classification } from 'contexts/iProcessContext'
import { colors } from 'theme'

const RejectedTextInputStyled = styled(TextField)({
  width: '10rem',
  fontSize: '1rem',
  '& .MuiFormLabel-root': {
    color: colors.gray2
  },
  '&.Mui-error': {
    borderColor: colors.redError
  }
})

const RadioButtonStyled = styled(Radio)({
  marginRight: '1rem',
  padding: '4px'
})

interface RadioListProps {
  items: Classification[] | undefined
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  selectedValue: string
  isError: boolean
  isTextFieldError: boolean
  errorMessage: string
  name: string
}

const RadioListForm = forwardRef(
  ({ items, isError, errorMessage, onChange, selectedValue, name, isTextFieldError }: RadioListProps, ref) => {
    const { t } = useTranslation('iProcess')
    const radioTextRef = useRef<HTMLDivElement | null>(null)

    const [isOtherOption, setIsOtherOption] = useState<boolean>(false)
    const isDefinedTypeOfDamage = useMemo(() => {
      if (items) {
        return items?.some((item) => item.value === selectedValue)
      } else {
        return true
      }
    }, [items, selectedValue])

    const handleRadioSelection = useCallback(() => {
      if (selectedValue) {
        if (isDefinedTypeOfDamage) {
          setIsOtherOption(false)
        } else {
          setIsOtherOption(true)
          radioTextRef.current?.focus()
        }
      }
    }, [isDefinedTypeOfDamage, selectedValue])

    useEffect(() => {
      handleRadioSelection()
    }, [selectedValue, items, handleRadioSelection])

    return (
      <FormControl>
        <RadioGroup id='radio-list' onChange={onChange} ref={ref} name={name} value={selectedValue}>
          {items?.map((item) => {
            return (
              <ListItemButton key={item.id} style={{ padding: '4px' }}>
                <FormControlLabel
                  ref={ref}
                  value={item.value}
                  checked={item.value === selectedValue}
                  onChange={(event) => {
                    setIsOtherOption(false)
                    onChange(event as ChangeEvent<HTMLInputElement>)
                  }}
                  control={<RadioButtonStyled size='small' />}
                  label={item.value}
                />
              </ListItemButton>
            )
          })}
          <ListItem style={{ padding: '4px' }}>
            <FormControlLabel
              checked={isOtherOption}
              onClick={() => setIsOtherOption(true)}
              control={<RadioButtonStyled size='small' style={{ marginRight: 0 }} />}
              label=''
            />
            <RejectedTextInputStyled
              id='radioTextField'
              ref={radioTextRef}
              name={name}
              value={!isDefinedTypeOfDamage ? selectedValue : ''}
              onChange={onChange}
              variant='outlined'
              label={t('nioDialog.leftDamageTextField')}
              InputLabelProps={{ style: { marginBottom: '4px' } }}
              InputProps={{ style: { height: '3rem', padding: '4px' } }}
              inputRef={ref}
              error={isTextFieldError}
              onFocus={(event) => {
                setIsOtherOption(true)
                onChange(event as ChangeEvent<HTMLInputElement>)
              }}
            />
          </ListItem>
        </RadioGroup>
        {isError ? (
          <Typography variant='subtitle2' style={{ padding: '12px' }}>
            {errorMessage}
          </Typography>
        ) : undefined}
      </FormControl>
    )
  }
)

RadioListForm.displayName = 'RadioListForm'

export default memo(RadioListForm)
