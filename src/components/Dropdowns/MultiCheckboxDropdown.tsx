import { CSSProperties } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Autocomplete, Checkbox, FormControlLabel, Grid, ListItem, TextField, Typography } from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'
import { IssueInput } from 'API'
import { colors } from 'theme'
import CustomChip from '../Chips/CustomChip'
import { IDisruptionFormState } from '../Dialogs/DisruptionDialogs/DisruptionDialog'

interface MultiCheckboxDropdownProps {
  id: string
  title?: string
  titleVariant?: Variant
  options: IssueInput[]
  placeholder?: string
  isError?: boolean
  errorMessage?: string
  popupDisplayWidth?: string | number
  style?: CSSProperties
}

const MultiCheckboxDropdown = ({
  id,
  title,
  titleVariant = 'overline',
  placeholder,
  options,
  style
}: MultiCheckboxDropdownProps) => {
  const { setValue, control } = useFormContext<IDisruptionFormState>()
  const MAX_NUMBER_OF_CHIPS = 4

  const renderChips = (values: IssueInput[]) => {
    return values.map((value, index) => {
      if (index < MAX_NUMBER_OF_CHIPS) {
        return <CustomChip key={index} label={value.name} />
      }
      if (index === MAX_NUMBER_OF_CHIPS) {
        return <span key={index}>...</span>
      }
      return <></>
    })
  }

  return (
    <Grid container direction='column'>
      {title && <Typography variant={titleVariant}>{title}</Typography>}
      <Controller
        name='issues'
        control={control}
        render={({ field: { value } }) => (
          <Autocomplete
            id={`multi-checkbox-dropdown-${id}`}
            multiple
            options={options}
            value={value}
            size='small'
            onChange={(_, issues) => {
              setValue('issues', issues)
            }}
            sx={{ width: style?.width }}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderTags={renderChips}
            renderInput={(params) => (
              <TextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  style: {
                    borderRadius: 0,
                    fontSize: '1rem',
                    backgroundColor: colors.white,
                    paddingLeft: '1rem'
                  }
                }}
                placeholder={value.length > 0 ? undefined : placeholder}
              />
            )}
            renderOption={(props, option, { selected }) => (
              <ListItem {...props}>
                <FormControlLabel
                  id={`checkbox-list-label-${option.id}`}
                  control={<Checkbox />}
                  onClick={(_) => _.preventDefault()}
                  label={option.name}
                  checked={selected}
                />
              </ListItem>
            )}
          />
        )}
      />
    </Grid>
  )
}

export default MultiCheckboxDropdown
