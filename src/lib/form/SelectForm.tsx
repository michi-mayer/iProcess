import { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { FormControl, Grid, Select, SelectProps, Typography } from '@mui/material'
import CustomChip from 'components/Chips/CustomChip'
import ErrorMessage from 'components/ErrorMessage'
import { ALL_OPTION_DASHBOARDS } from 'helper/constants'
import { isArrayOfStrings } from 'shared/types'
import { colors } from 'theme'

export const CustomSelect = <T,>({ children, ...props }: SelectProps<T>) => (
  <Select
    {...props}
    sx={{
      width: '100%',
      marginTop: '4px',
      padding: 0,
      '.MuiOutlinedInput-notchedOutline': {
        border: `1.5px solid ${colors.gray2}`
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        border: `1.5px solid ${colors.blue}`
      }
    }}
  >
    {children}
  </Select>
)

const DefaultRenderValue = (selected: unknown) => {
  const { t } = useTranslation('admin')
  if (isArrayOfStrings(selected)) {
    const isAllUnitsSelected = selected.includes(ALL_OPTION_DASHBOARDS.id)
    const isAllSelected = selected.includes(ALL_OPTION_DASHBOARDS.name)

    if (isAllSelected || isAllUnitsSelected) {
      return <Typography variant='body1'>{ALL_OPTION_DASHBOARDS.name}</Typography>
    }

    if (Array.isArray(selected) && selected.length === 0) {
      return <Typography variant='body1'>{t('unitsSection.selectPlaceHolder')}</Typography>
    }

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {/* // FIXME: index as key is an anti-pattern */}
        {selected?.map((value, index) => <CustomChip key={index} label={value} />)}
      </div>
    )
  }
  return <></>
}

type CustomSelectProps = Pick<
  SelectProps<string[]>,
  'id' | 'name' | 'value' | 'error' | 'placeholder' | 'style' | 'renderValue' | 'children'
>

interface SelectUnitsProps extends CustomSelectProps {
  // * Component props
  title?: string
  errorMessage?: string
  popupDisplayWidth?: string | number
  selectFormStyle?: CSSProperties
  // * CustomSelect props
  id: string
  value: string[]
}

const SelectForm = ({
  id,
  title,
  error,
  errorMessage,
  style,
  popupDisplayWidth,
  children,
  selectFormStyle,
  renderValue = DefaultRenderValue,
  ...props
}: SelectUnitsProps) => {
  return (
    <Grid container direction='column' style={{ marginTop: title ? '1rem' : undefined, ...selectFormStyle }}>
      {title && (
        <Typography variant='overline' style={{ lineHeight: style?.lineHeight }}>
          {title}
        </Typography>
      )}
      <FormControl style={{ width: '100%' }}>
        <CustomSelect
          id={id}
          multiple
          variant='filled'
          error={error}
          style={style}
          renderValue={renderValue}
          SelectDisplayProps={{
            style: {
              width: popupDisplayWidth,
              paddingTop: '8px'
            }
          }}
          displayEmpty
          MenuProps={{ PaperProps: { style: { maxHeight: 360, padding: 0 } } }}
          {...props}
        >
          {children}
        </CustomSelect>
      </FormControl>
      <ErrorMessage error={error} errorMessage={errorMessage} />
    </Grid>
  )
}

export default SelectForm
