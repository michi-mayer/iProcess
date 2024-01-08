import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'
import { MustCalculateDisruptionKPIsInput } from 'APIcustom'
import { useStorePareto } from 'contexts/paretoStore'
import { ALL_OPTION_DASHBOARDS } from 'helper/constants'
import OptionList from 'lib/form/OptionList'
import SelectForm from 'lib/form/SelectForm'

interface SelectFilterProps<T> {
  value: Exclude<keyof MustCalculateDisruptionKPIsInput, 'startDate' | 'endDate'>
  data: T[]
}

const renderSelectedItems = (storedValues: string[]) => {
  const { t } = useTranslation('dashboard')

  if (storedValues.length === 0) {
    return <Typography variant='body1'>{t('paretoFilter.nothingSelectedMessage')}</Typography>
  }
  // eslint-disable-next-line unicorn/prefer-includes
  const isAllOptionSelected = storedValues.some((item) => item === ALL_OPTION_DASHBOARDS.name)

  if (isAllOptionSelected) {
    return <Typography>{ALL_OPTION_DASHBOARDS.name}</Typography>
  } else {
    const selectedItems = storedValues.join(', ')
    return <Typography noWrap={true}>{selectedItems}</Typography>
  }
}

export const SelectStringFilter = <T extends string>({ value, data }: SelectFilterProps<T>) => {
  const { t } = useTranslation('dashboard')
  const [storedValues, setStore] = useStorePareto((store) => store[value])
  const storeKey = value

  const handleClickItem = (selected: string) => {
    const isAllOptionSelected = selected === ALL_OPTION_DASHBOARDS.name
    const totalItems = data.length
    let newFilterValues: string[] = []
    const selectedItem = data.find((item) => item === selected)

    if (selectedItem) {
      // eslint-disable-next-line unicorn/prefer-includes
      const isSelectedInStoredValues = storedValues.some((item) => item === selectedItem)
      if (isSelectedInStoredValues) {
        if (isAllOptionSelected) {
          newFilterValues = storedValues.filter((item) => item !== selectedItem)
        } else {
          newFilterValues = storedValues.filter((item) => item !== selectedItem && item !== ALL_OPTION_DASHBOARDS.name)
        }
      } else {
        newFilterValues = [...storedValues, selectedItem]
        if (newFilterValues.length === totalItems - 1 || isAllOptionSelected) {
          newFilterValues = data.map((item) => item)
        }
      }
      setStore({ [value]: newFilterValues })
    }
  }

  return (
    <SelectForm
      id='select-string-pareto'
      title={t('paretoFilter.by', {
        value: t(`paretoFilter.${value}`)
      })}
      style={{ lineHeight: 1.8 }}
      value={storedValues}
      name={`pareto-filter-${value}`}
      renderValue={() => renderSelectedItems(storedValues)}
    >
      <OptionList items={data} values={storedValues} storeKey={storeKey} onClickItem={handleClickItem} />
    </SelectForm>
  )
}
