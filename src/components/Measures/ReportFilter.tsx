import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Autocomplete,
  Button,
  ClickAwayListener,
  Divider,
  FormControl,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { useStoreReport } from 'routes/measures/MeasuresApp'
import { Bool, Progress } from 'API'
import FilterIcon from 'components/Icons/FilterIcon'
import PlusIcon from 'components/Icons/PlusIcon'
import searchIcon from 'components/Icons/search-32.svg'
import useQueryListUsers from 'hooks/services/useQueryListUsers'
import { colors } from 'theme'
import ReportFilterOptions from './ReportFilterOptions'
import { MeasureTranslationKeys } from './ReportMeasures'

export enum Group {
  Status = 'status',
  Critical = 'critical',
  Assignee = 'assignee'
}

export type Option = {
  id: string
  group?: Group
  value: string
}

const statusOptions = Object.keys(Progress).map((progress) => ({
  id: Group.Status + progress,
  group: Group.Status,
  value: progress
}))

const criticalOptions = Object.keys(Bool).map((critical) => ({
  id: Group.Critical + critical,
  group: Group.Critical,
  value: critical
}))

const ReportFilter = () => {
  const { t } = useTranslation('measures')

  const [{ options: selectedOptions, searchInput }, setStore] = useStoreReport((store) => store)
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const [showMore, setShowMore] = useState<boolean>(false)

  const { data: subDepartments } = useQueryListUsers(['custom:subdepartment'])

  const assigneeOptions = useMemo(() => {
    return subDepartments.map((value) => ({
      id: Group.Assignee + value,
      group: Group.Assignee,
      value
    }))
  }, [subDepartments])

  const options = useMemo(() => {
    return [statusOptions, criticalOptions, assigneeOptions].flat()
  }, [assigneeOptions])

  const handleClick = useCallback(
    (item: Option) => {
      let newOptions = [...selectedOptions]

      const isAlreadySelected = newOptions?.some((option) => option.value === item.value)
      const isCriticalAlreadySelected = newOptions.some((option) => option.group === Group.Critical)

      if (isAlreadySelected) {
        newOptions = selectedOptions.filter((option) => option.value !== item.value)
      } else {
        // Special case: mutually exclusive yes/no
        if (item.group === Group.Critical && isCriticalAlreadySelected) {
          newOptions = selectedOptions.filter((option) => option.group !== item.group || option.value === item.value)
        }
        newOptions.push(item)
      }
      setStore({ options: newOptions })
    },
    [selectedOptions, setStore]
  )

  const handleClickShow = () => {
    setShowMore((previousState) => !previousState)
  }

  return (
    <Grid
      container
      style={{
        maxWidth: '370px',
        backgroundColor: 'white',
        marginTop: '1.5rem'
      }}
    >
      <Button
        id='reports-filter-dropdown-button'
        startIcon={<FilterIcon width={24} height={24} />}
        onClick={() => setShowFilter(!showFilter)}
        variant='outlined'
        style={{
          justifyContent: 'left',
          borderRadius: '2px',
          border: showFilter ? `1.5px solid ${colors.blue}` : `1.5px solid ${colors.gray2}`,
          minHeight: '40px'
        }}
      >
        <Grid item display='flex' alignItems='center'>
          <Typography variant='body1' style={{ color: colors.gray1 }}>
            {selectedOptions.length > 0 ? 'Filter:' : 'Filter'}
          </Typography>
          <Typography variant='h4' style={{ paddingLeft: '4px', color: colors.gray1 }}>
            {selectedOptions.length > 0 ? selectedOptions.length : undefined}
          </Typography>
        </Grid>
      </Button>

      {showFilter ? (
        <ClickAwayListener onClickAway={() => setShowFilter(false)}>
          <FormControl sx={{ width: '100%' }}>
            <Autocomplete
              id='reports-filter-search-autocomplete'
              disablePortal
              autoSelect
              multiple
              options={options}
              groupBy={(option) => option.group}
              inputValue={searchInput}
              sx={{
                width: '100%',
                position: 'absolute',
                zIndex: 10
              }}
              PaperComponent={({ ...props }) => {
                return (
                  <Paper {...props} sx={{ '& .MuiAutocomplete-listbox': { padding: '0px 0px', maxHeight: '492px' } }} />
                )
              }}
              onInputChange={(_, value) => setStore({ searchInput: value })}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              open={showFilter}
              getOptionLabel={(option) => {
                const itemText =
                  option.group !== Group.Assignee
                    ? t(`filter.${option.value.toLowerCase() as MeasureTranslationKeys}`)
                    : option.value
                return itemText
              }}
              renderInput={(params) => (
                <TextField
                  id={params.id}
                  fullWidth={params.fullWidth}
                  size={params.size}
                  inputProps={params.inputProps}
                  InputProps={{
                    ref: params.InputProps.ref,
                    value: searchInput,
                    style: {
                      borderRadius: '2px',
                      height: '40px',
                      fontSize: '1rem',
                      backgroundColor: colors.white,
                      paddingLeft: '1rem',
                      paddingRight: '4px'
                    },
                    startAdornment: <img height='24px' src={searchIcon} loading='lazy' />,
                    endAdornment:
                      searchInput.length > 0 ? (
                        <IconButton onClick={() => setStore({ searchInput: '' })} size='small'>
                          <PlusIcon width='24px' height='24px' style={{ transform: 'rotate(45deg)' }} />
                        </IconButton>
                      ) : undefined
                  }}
                  placeholder={t('overview.search')}
                />
              )}
              renderGroup={({ key, group }) => (
                <Grid key={key}>
                  <Grid container alignItems='center' height='40px' paddingLeft='1rem'>
                    <Typography variant='body1'>{t(`filter.${group as Group}`)}</Typography>
                  </Grid>

                  <Divider style={{ backgroundColor: colors.gray4 }} />

                  <ReportFilterOptions
                    group={group}
                    input={searchInput}
                    options={options}
                    selectedOptions={selectedOptions}
                    showMore={showMore}
                    onClickOption={handleClick}
                    onClickShowMore={handleClickShow}
                  />
                </Grid>
              )}
            />
          </FormControl>
        </ClickAwayListener>
      ) : undefined}
    </Grid>
  )
}

export default ReportFilter
