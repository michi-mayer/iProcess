import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox, Divider, Grid, MenuItem, Typography } from '@mui/material'
import { Shift } from 'API'
import { useStorePareto } from 'contexts/paretoStore'
import { ALL_OPTION_DASHBOARDS } from 'helper/constants'
import SelectForm from 'lib/form/SelectForm'
import { colors } from 'theme'

const renderSelectedItems = (selected: string[], isAllShiftSelected: boolean) => {
  const { t } = useTranslation('dashboard')

  const storedValues = Object.keys(selected)
  if (storedValues.length === 0) {
    return <Typography variant='body1'>{t('paretoFilter.nothingSelectedMessage')}</Typography>
  }

  if (isAllShiftSelected) {
    return <Typography>{ALL_OPTION_DASHBOARDS.name}</Typography>
  } else {
    const selectedItems = Object.values(selected).join(', ')
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
  setIsAllShiftSelected: (_: boolean) => void
}

const OptionEnumList = <T extends Option>({
  items,
  values,
  storeKey,
  onClickItem,
  setIsAllShiftSelected
}: OptionListProps<T>) => {
  const { t } = useTranslation('dashboard')

  const [, setStore] = useStorePareto((store) => store)

  const handleClearAll = () => {
    setIsAllShiftSelected(false)
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
                backgroundColor: values?.includes(item.name) ? colors.bluegray : ''
              }}
            >
              <Grid container>
                <Grid container direction='row' alignItems='center'>
                  <Grid item xs={1} style={{ paddingTop: 2 }} onClick={() => onClickItem(item.id)}>
                    <Checkbox
                      size='small'
                      color='primary'
                      checked={values.includes(item.name)}
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
  value: 'shifts'
  data: T[]
}

export const SelectEnumFilter = <T extends Option>({ value, data }: SelectFilterProps<T>) => {
  const { t } = useTranslation('dashboard')

  const [isAllShiftSelected, setIsAllShiftSelected] = useState(false)

  const storeKey = value
  const [items, setStore] = useStorePareto((store) => store[storeKey])

  const handleClickItem = (selectedId: string) => {
    const isAllOptionSelected = selectedId === ALL_OPTION_DASHBOARDS.id
    const totalItems = data.length
    let newFilterValues: Shift[] = []
    const selectedItem = data.find((item) => item.id === selectedId) as Option | undefined

    if (selectedItem) {
      const isSelectedInStoredValues = items.includes(selectedItem.id as Shift) || isAllShiftSelected
      if (isSelectedInStoredValues) {
        if (isAllOptionSelected) {
          setIsAllShiftSelected(false)
          newFilterValues = items.filter((item) => item !== selectedItem?.id)
        } else {
          setIsAllShiftSelected(false)
          newFilterValues = items.filter((item) => item !== selectedItem?.id && item !== ALL_OPTION_DASHBOARDS.id)
        }
      } else {
        if (isAllOptionSelected) {
          setIsAllShiftSelected(true)
          newFilterValues = Object.values(Shift)
        }

        const selectedShift = Object.values(Shift).find((shift) => shift === selectedItem.id)

        if (selectedShift) {
          setIsAllShiftSelected(false)
          newFilterValues = [...items, selectedShift]
          if (newFilterValues.length === totalItems - 1 || isAllShiftSelected) {
            setIsAllShiftSelected(true)
            newFilterValues = Object.values(Shift)
          }
        }
      }

      setStore({ shifts: newFilterValues })
    }
  }

  const selectedShifts = useMemo(() => {
    const parsedShiftNames: string[] = []

    if (isAllShiftSelected) {
      parsedShiftNames.push(ALL_OPTION_DASHBOARDS.name)
    }

    for (const shiftId of items) {
      const value = data.find((item) => item.id === shiftId)
      if (value) {
        parsedShiftNames.push(value.name)
      }
    }
    return parsedShiftNames
  }, [data, isAllShiftSelected, items])

  useEffect(() => {
    if (items.length === 3) {
      // morningShift, afternoonShift & nightShift
      setIsAllShiftSelected(true)
    }
  }, [items.length])

  return (
    <SelectForm
      id='select-enum-pareto'
      title={t('paretoFilter.by', {
        value: t(`paretoFilter.${value}`)
      })}
      style={{ lineHeight: 1.8 }}
      value={selectedShifts}
      name={`pareto-filter-${value}`}
      renderValue={() => renderSelectedItems(selectedShifts, isAllShiftSelected)}
    >
      <OptionEnumList
        items={data}
        values={selectedShifts}
        storeKey={storeKey}
        onClickItem={handleClickItem}
        setIsAllShiftSelected={setIsAllShiftSelected}
      />
    </SelectForm>
  )
}
