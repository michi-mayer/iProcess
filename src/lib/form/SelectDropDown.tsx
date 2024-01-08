import { CSSProperties, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Grid, MenuItem, Select, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { RenderValue } from 'types'
import ErrorMessage, { ErrorMessageProps } from 'components/ErrorMessage'
import { truncateText as truncateTexts } from 'helper/truncateText'
import { colors } from 'theme'
import { CustomSelect } from './SelectForm'

export interface DefaultItem extends RenderValue<number> {
  partNumber?: string
}

interface RenderValueOptions {
  truncateText: boolean
  maxTextLength: number
  selectPlaceHolder?: string
}

export type RenderValueFunction = (item: unknown, options: RenderValueOptions) => ReactNode

const renderValue = (selected: unknown, selectPlaceHolder: string) => {
  const value = typeof selected === 'string' && selected.length > 0 ? selected : selectPlaceHolder
  return value
}

type CustomSelectProps = Parameters<typeof Select>[0]

interface SelectDropDownProps<T>
  extends ErrorMessageProps,
    Partial<Omit<RenderValueOptions, 'selectPlaceholder'>>,
    Omit<CustomSelectProps, 'renderValue' | 'onClick' | 'error'> {
  itemCollection: T[] | undefined
  defaultItem?: DefaultItem
  style?: CSSProperties
  truncateSetValue?: boolean
  displayPropsWidth?: string
  onClick?: (item: T) => void
  renderName: (item: T) => string | undefined
  defaultComponent?: (item: DefaultItem) => ReactNode
}

const SelectDropDown = <T,>({
  value,
  style,
  title,
  itemCollection,
  renderName,
  onClick,
  error,
  errorMessage,
  defaultComponent,
  defaultItem,
  disabled,
  truncateSetValue = false,
  displayPropsWidth = '95%',
  maxTextLength = 19,
  ...props
}: SelectDropDownProps<T>) => {
  const { t } = useTranslation('iProcess')
  const StyledKeyboardArrowDownIcon = styled(KeyboardArrowDownIcon)({
    fill: !disabled ? colors.blue : colors.gray3
  })

  return (
    <Grid container item direction='column'>
      {title && (
        <Typography variant='h3' color={error ? colors.redError : colors.blue}>
          {title}
        </Typography>
      )}
      <CustomSelect
        error={error}
        disabled={disabled}
        displayEmpty
        value={value ?? ''}
        IconComponent={StyledKeyboardArrowDownIcon}
        style={{ border: 0, ...style }}
        sx={{ width: '100%' }}
        renderValue={(_) => renderValue(_, t('configuration.selectPlaceholder'))}
        SelectDisplayProps={{
          style: {
            width: displayPropsWidth,
            padding: '9px'
          }
        }}
        inputProps={{ 'aria-label': 'Without label' }}
        {...props}
      >
        {defaultComponent && defaultItem ? defaultComponent(defaultItem) : undefined}
        {itemCollection?.map((item, index) => {
          return (
            <MenuItem
              id={`${props.id}-item`}
              key={`${props.id}-${index}`}
              value={renderName(item)}
              onClick={() => onClick?.(item)}
            >
              <Typography variant='body1'>
                {truncateSetValue ? truncateTexts({ maxTextLength, text: renderName(item) }) : renderName(item)}
              </Typography>
            </MenuItem>
          )
        })}
      </CustomSelect>
      <ErrorMessage error={error} errorMessage={errorMessage} />
    </Grid>
  )
}

export default SelectDropDown
