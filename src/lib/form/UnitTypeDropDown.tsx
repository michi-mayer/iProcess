import { CSSProperties, forwardRef, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { FormControl, Grid, MenuItem, SelectChangeEvent, Typography } from '@mui/material'
import { UnitType } from 'API'
import { StyledKeyboardArrowDownIcon } from 'components/Measures/ReportMeasures'
import { colors } from 'theme'
import { CustomSelect } from './SelectForm'

interface UnitTypeDropDownProps {
  onChange: (event: SelectChangeEvent<unknown>, child?: ReactNode) => void
  value?: UnitType | string
  title: string
  name: string
  placeholder?: string
  style?: CSSProperties
  isError?: boolean
  errorMessage: string
}

const UnitTypeDropDown = forwardRef<unknown, UnitTypeDropDownProps>(
  ({ title, onChange, value, name, style, placeholder, isError, errorMessage }, ref) => {
    const { t } = useTranslation('admin')

    return (
      <Grid container direction='column'>
        <Typography variant='overline'>{title}</Typography>
        <FormControl style={{ width: '100%' }}>
          <CustomSelect
            id='select-unit-type'
            name={name}
            value={value ?? ''}
            variant='outlined'
            onChange={onChange}
            placeholder={placeholder}
            error={isError}
            style={style}
            ref={ref}
            sx={{ paddingTop: '0px' }}
            IconComponent={StyledKeyboardArrowDownIcon}
            SelectDisplayProps={{
              style: {
                padding: '9px',
                width: '92%'
              }
            }}
            displayEmpty
            renderValue={(selected) => {
              if (typeof selected === 'string') {
                if (selected.length === 0) {
                  return <Typography variant='body2'>{t('unitsSection.selectPlaceHolder')}</Typography>
                }
                return selected === UnitType.assemblyLine ? (
                  <Typography variant='body2'>{t('unitsSection.assemblyLine')}</Typography>
                ) : (
                  <Typography variant='body2'>{t('unitsSection.productionUnit')}</Typography>
                )
              }
            }}
          >
            <MenuItem value={UnitType.assemblyLine} id='select-assemblyLine'>
              <Typography variant='body2'>{t('unitsSection.assemblyLine')}</Typography>
            </MenuItem>
            <MenuItem value={UnitType.productionUnit} id='select-productionUnit'>
              <Typography variant='body2'>{t('unitsSection.productionUnit')}</Typography>
            </MenuItem>
          </CustomSelect>
        </FormControl>
        <Typography
          variant='caption'
          style={{ color: colors.redError, fontSize: 12, marginBottom: '12px' }}
          id='select-unit-errorMessage'
        >
          {isError ? errorMessage : undefined}
        </Typography>
      </Grid>
    )
  }
)

UnitTypeDropDown.displayName = 'UnitTypeDropDown'

export default UnitTypeDropDown
