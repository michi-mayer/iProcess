import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox, Divider, Grid, MenuItem, Typography } from '@mui/material'
import { useStorePareto } from 'contexts/paretoStore'
import { ALL_OPTION_DASHBOARDS } from 'helper/constants'
import SelectForm from 'lib/form/SelectForm'
import { colors } from 'theme'

type UnitRecord = Record<string, string>

const renderSelectedItems = (selectedUnitsRecord: UnitRecord) => {
  const { t } = useTranslation('dashboard')

  const storedValues = Object.keys(selectedUnitsRecord)
  if (storedValues.length === 0) {
    return <Typography variant='body1'>{t('paretoFilter.nothingSelectedMessage')}</Typography>
  }

  // eslint-disable-next-line unicorn/prefer-includes
  const isAllOptionSelected = storedValues.some((item) => item === ALL_OPTION_DASHBOARDS.id)

  if (isAllOptionSelected) {
    return <Typography>{ALL_OPTION_DASHBOARDS.name}</Typography>
  } else {
    const selectedItems = Object.values(selectedUnitsRecord).join(', ')
    return <Typography noWrap={true}>{selectedItems}</Typography>
  }
}

// ! TODO: Remove duplicated code
interface Option {
  id: string
  name: string
}

// ! TODO: Remove duplicated code
interface OptionListProps<T> {
  items: T[]
  values: string[]
  storeKey: string
  onClickItem: (selected: string) => void
}

const OptionObjectList = <T extends Option>({ items, values, storeKey, onClickItem }: OptionListProps<T>) => {
  const { t } = useTranslation('dashboard')

  const [, setStore] = useStorePareto((store) => store)

  const handleClearAll = () => {
    setStore({ [storeKey]: [] })
  }

  return (
    <>
      {
        // eslint-disable-next-line array-callback-return
        items.map((item, index) => {
          const isFirstItem = index === 0
          return (
            <MenuItem
              key={item.id}
              value={item.name}
              style={{
                backgroundColor: values?.includes(item.id) ? colors.bluegray : ''
              }}
            >
              <Grid container>
                <Grid container direction='row' alignItems='center'>
                  <Grid item xs={1} style={{ paddingTop: 2 }} onClick={() => onClickItem(item.id)}>
                    <Checkbox
                      size='small'
                      color='primary'
                      checked={values.includes(item.id)}
                      id={`menu-item-${item}`}
                    />
                  </Grid>
                  <Grid item xs={isFirstItem ? 8 : 11} onClick={() => onClickItem(item.id)}>
                    <Typography variant='caption' color='textSecondary' style={{ marginRight: '1rem' }}>
                      {item.name}
                    </Typography>
                  </Grid>

                  {isFirstItem ? (
                    <Grid item xs={3} onClick={handleClearAll}>
                      <Typography variant='caption' textAlign='center'>
                        {t('paretoFilter.clearAll')}
                      </Typography>
                    </Grid>
                  ) : undefined}
                </Grid>

                {isFirstItem ? (
                  <Divider
                    orientation='horizontal'
                    style={{ color: colors.bluegray, backgroundColor: colors.bluegray, height: '1px', width: '100%' }}
                  />
                ) : undefined}
              </Grid>
            </MenuItem>
          )
        })
      }
    </>
  )
}

interface SelectFilterProps<T> {
  storeKey: 'unitIds'
  data: T[]
}

export const SelectObjectFilter = <T extends Option>({ storeKey, data }: SelectFilterProps<T>) => {
  const { t } = useTranslation('dashboard')

  const [unitIds, setStore] = useStorePareto((store) => store.unitIds)

  const handleClickItem = (selectedId: string) => {
    const isAllOptionSelected = selectedId === ALL_OPTION_DASHBOARDS.id
    const totalItems = data.length
    let newFilterValues: string[] = []
    const selectedItem = data.find((item) => item.id === selectedId) as Option | undefined

    if (selectedItem) {
      const isSelectedInStoredValues = unitIds.includes(selectedItem?.id)
      if (isSelectedInStoredValues) {
        if (isAllOptionSelected) {
          newFilterValues = unitIds.filter((item) => item !== selectedItem?.id)
        } else {
          newFilterValues = unitIds.filter((item) => item !== selectedItem?.id && item !== ALL_OPTION_DASHBOARDS.id)
        }
      } else {
        newFilterValues = [...unitIds, selectedItem.id]
        if (newFilterValues.length === totalItems - 1 || isAllOptionSelected) {
          newFilterValues = data.map((item) => item.id)
        }
      }

      setStore({ unitIds: newFilterValues })
    }
  }

  const selectedUnitsRecord = useMemo(() => {
    const parsedUnitNames: UnitRecord = {}

    for (const unitId of unitIds) {
      const value = data.find((item) => item.id === unitId)?.name
      if (value) {
        parsedUnitNames[unitId] = value
      }
    }

    return parsedUnitNames
  }, [data, unitIds])

  return (
    <SelectForm
      id='select-object-pareto'
      title={t('paretoFilter.by', {
        value: t(`paretoFilter.${storeKey}`)
      })}
      style={{ lineHeight: 1.8 }}
      value={unitIds}
      name={`pareto-filter-${storeKey}`}
      renderValue={() => renderSelectedItems(selectedUnitsRecord)}
    >
      <OptionObjectList items={data} values={unitIds} storeKey={storeKey} onClickItem={handleClickItem} />
    </SelectForm>
  )
}
