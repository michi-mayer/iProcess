import { ChangeEvent, CSSProperties, HTMLAttributes, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Autocomplete,
  Button,
  Checkbox,
  ClickAwayListener,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  ListItem,
  Radio,
  styled,
  TextField,
  Typography
} from '@mui/material'
import clsx from 'clsx'
import searchIcon from 'components/Icons/search-32.svg'
import { useRadioStyles } from 'components/styled'
import { colors } from 'theme'
import { GetOptionLabel, RenderOption } from './types'

const StyledRadio = styled(Radio)({
  '& .MuiSvgIcon-root': {
    height: 30,
    width: 30
  }
})

interface OptionProps {
  label: string
  checked: boolean
  onChange?: ((event: ChangeEvent<HTMLInputElement>, checked: boolean) => void) | undefined
  value?: unknown
  showDivider: boolean
  listProps: HTMLAttributes<HTMLLIElement>
  type: 'radio' | 'checkbox'
}

export const DropDownOption = ({ label, checked, onChange, value, showDivider, type, listProps }: OptionProps) => {
  const { classes } = useRadioStyles()
  return (
    <Grid>
      <ListItem
        {...listProps}
        style={{ display: 'flex', flex: 1, height: '50px', boxSizing: 'border-box', padding: 0 }}
      >
        <FormControlLabel
          style={{ display: 'flex', flex: 1, height: '50px', padding: '6px 16px' }}
          label={label}
          control={
            type === 'radio' ? (
              <StyledRadio
                checked={checked}
                onChange={onChange}
                value={value}
                checkedIcon={<span className={clsx(classes.root, classes.checkedIcon)} />}
                icon={<span className={classes.root} />}
              />
            ) : (
              <Checkbox size='small' color='primary' checked={checked} onChange={onChange} value={value} />
            )
          }
        />
      </ListItem>
      {showDivider && <Divider style={{ width: '90%', margin: '0 auto' }} />}
    </Grid>
  )
}

interface Props<TOption extends object> {
  selectedName?: string
  options: TOption[]
  getOptionLabel: GetOptionLabel<TOption>
  renderOption: RenderOption<TOption>
  placeholder?: string
  name: string
  icon: ReactNode
  multiple?: boolean
  containerStyle?: CSSProperties
}

const DropDownAutocomplete = <TOption extends object>({
  selectedName,
  options,
  getOptionLabel,
  renderOption,
  placeholder,
  name,
  icon,
  multiple,
  containerStyle
}: Props<TOption>) => {
  const { t } = useTranslation()
  const [showDropdown, setShowDropdown] = useState(false)
  return (
    <Grid
      container
      style={{
        width: '240px',
        backgroundColor: 'white',
        marginLeft: '1rem',
        ...containerStyle
      }}
    >
      <Button
        id={`${name}-dropdown-button`}
        onClick={() => setShowDropdown((previousState) => !previousState)}
        startIcon={icon}
        endIcon={<KeyboardArrowDownIcon />}
        variant='outlined'
        fullWidth
        style={{
          borderRadius: 0,
          border: `1.5px solid ${colors.gray2}`,
          height: '42px'
        }}
      >
        <Grid container wrap='nowrap' maxWidth='80%'>
          <Typography style={{ color: colors.gray1 }}>{t('disruptionReview.filter')}:</Typography>
          <Typography
            id={`${name}-dropdown-selected-item-${selectedName}`}
            style={{ fontWeight: 'bold', marginLeft: '4px', color: colors.gray1 }}
            noWrap
          >
            {selectedName}
          </Typography>
        </Grid>
      </Button>
      {options && showDropdown && (
        <ClickAwayListener onClickAway={() => setShowDropdown(false)}>
          <FormControl sx={{ width: '100%' }}>
            <Autocomplete
              disablePortal
              autoSelect
              multiple={multiple}
              id={`${name}-search-autocomplete`}
              options={options}
              sx={{ width: '100%', position: 'absolute', zIndex: 1000, height: '400px' }}
              noOptionsText={t('autocomplete.noOptions')}
              open={showDropdown}
              getOptionLabel={getOptionLabel}
              renderInput={(params) => (
                <TextField
                  id={params.id}
                  fullWidth={params.fullWidth}
                  size={params.size}
                  inputProps={params.inputProps}
                  InputProps={{
                    ref: params.InputProps.ref,
                    style: {
                      height: '40px',
                      borderRadius: 0,
                      fontSize: '1rem',
                      backgroundColor: colors.white,
                      paddingLeft: '1rem'
                    },
                    startAdornment: <img height='20px' src={searchIcon} loading='lazy' />
                  }}
                  placeholder={placeholder}
                />
              )}
              renderOption={renderOption}
            />
          </FormControl>
        </ClickAwayListener>
      )}
    </Grid>
  )
}

export default DropDownAutocomplete
