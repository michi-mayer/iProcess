import { useCallback, useDeferredValue } from 'react'
import { useTranslation } from 'react-i18next'
import { Autocomplete, IconButton, ListItem, TextField, Typography } from '@mui/material'
import { Template } from 'types'
import PlusIcon from 'components/Icons/PlusIcon'
import searchIcon from 'components/Icons/search-32.svg'
import { defined } from 'helper/utils'
import useMediaQuery from 'hooks/useMediaQuery'
import { WithID } from 'shared'
import { colors } from 'theme'
import { useStoreDisruptionTemplates } from '../DisruptionDashboard'

const SearchDisruptionTemplates = ({ id }: WithID) => {
  const { t } = useTranslation(['iProcess', 'measures'])
  const [isDesktopWidth] = useMediaQuery('lg')

  const [{ templates, previousTeamTemplates, searchInput }, setDisruptionStore] = useStoreDisruptionTemplates(
    (store) => store
  )
  const deferredSearchInput = useDeferredValue(searchInput)

  const suggestedOptions = useCallback(
    (options: Template[]) => {
      return options.filter((_) => _.description?.toLowerCase().includes(deferredSearchInput.toLowerCase().trim()))
    },
    [deferredSearchInput]
  )

  const renderClearInputButton = useCallback(() => {
    if (searchInput.length > 0) {
      return (
        <IconButton onClick={() => setDisruptionStore({ searchInput: '', clickedOption: undefined })} size='small'>
          <PlusIcon width='24px' height='24px' style={{ transform: 'rotate(45deg)' }} />
        </IconButton>
      )
    }
  }, [searchInput.length, setDisruptionStore])

  const renderOptionLabel = (option: string | Template) => {
    if (typeof option === 'string') {
      return option
    }
    return defined('option description is not defined on renderOptionLabel', option.description)
  }

  return (
    <Autocomplete
      id={id}
      noOptionsText={t('measures:measures.noOptionsPlaceholder')}
      options={[...templates, ...previousTeamTemplates]}
      filterOptions={suggestedOptions}
      freeSolo
      getOptionLabel={renderOptionLabel}
      inputValue={searchInput}
      value={deferredSearchInput}
      isOptionEqualToValue={() => false} // ? Only way I've found to disable automatic highlight of the option. Nothing in the Autocomplete API: https://mui.com/material-ui/api/autocomplete/
      onInputChange={(_, value) => {
        setDisruptionStore({ searchInput: value, clickedOption: undefined })
      }}
      style={{ marginRight: '1rem' }}
      renderInput={({ id, fullWidth, size, inputProps, InputProps }) => (
        <TextField
          id={id}
          fullWidth={fullWidth}
          size={size}
          inputProps={inputProps}
          InputProps={{
            ref: InputProps.ref,
            value: inputProps.value,
            style: {
              borderRadius: '2px',
              width: isDesktopWidth ? '312px' : '240px',
              height: '42px',
              fontSize: '1rem',
              backgroundColor: colors.white,
              paddingLeft: '1rem',
              paddingRight: '4px'
            },
            startAdornment: <img height='24px' src={searchIcon} loading='lazy' />,
            endAdornment: renderClearInputButton()
          }}
          placeholder={t('iProcess:disruptionList.searchForDisruptions')}
        />
      )}
      renderOption={(props, { id, description }) => (
        <ListItem
          {...props}
          key={id}
          onClick={() => setDisruptionStore({ clickedOption: templates.find((_) => _.description === description) })}
        >
          <Typography {...props} style={{ backgroundColor: 'transparent', width: '100%', height: '100%' }}>
            {description}
          </Typography>
        </ListItem>
      )}
    />
  )
}

export default SearchDisruptionTemplates
