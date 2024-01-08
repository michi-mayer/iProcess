import { useTranslation } from 'react-i18next'
import { Checkbox, Grid, MenuItem, Typography } from '@mui/material'
import { UnitType } from 'API'
import { UnitBasicInfo } from 'contexts/iProcessContext'
import { sortByShortName } from 'helper/sortData'
import { colors } from 'theme'

const unitEqual = <T extends UnitBasicInfo | string>(value: T, { id }: UnitBasicInfo) =>
  typeof value !== 'string' && value.id === id

interface SelectUnitListProps<T extends UnitBasicInfo | string> {
  data: UnitBasicInfo[] | undefined
  values: T[]
  name: string
  onClickItem: (name: string, values: T[], unitId: string) => void
  getValue: (_: UnitBasicInfo) => T
  /** @deprecated Match units on ID instead of short name */
  equal?: (first: T, second: UnitBasicInfo) => boolean
}

const UnitList = <T extends UnitBasicInfo | string>({
  data,
  values,
  name,
  onClickItem,
  getValue,
  equal = unitEqual
}: SelectUnitListProps<T>) => {
  const { t } = useTranslation('admin')

  const handleClickItem = (item: UnitBasicInfo) => {
    if (values.some((_) => equal(_, item))) {
      const otherValues = values.filter((_) => !equal(_, item))
      onClickItem(name, otherValues, item.id)
    } else {
      onClickItem(name, [...values, getValue(item)], item.id)
    }
  }

  return (
    <>
      {sortByShortName(data)?.map((unit) => (
        <MenuItem
          key={unit.id}
          value={unit.shortName}
          style={{
            backgroundColor: values.some((_) => equal(_, unit)) ? colors.bluegray : ''
          }}
          onClick={() => handleClickItem(unit)}
        >
          <Grid container direction='row' alignItems='center'>
            <Grid item xs={1} style={{ paddingTop: 2 }}>
              <Checkbox
                size='small'
                color='primary'
                checked={values.some((_) => equal(_, unit))}
                id={`menu-item-${unit.shortName}`}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant='caption' color='textSecondary' style={{ marginLeft: '1rem', width: '5rem' }}>
                {unit.shortName}
              </Typography>
            </Grid>
            <Grid item xs={4.5}>
              <Typography variant='caption' color='textSecondary' style={{ marginRight: '1rem' }}>
                {unit.name}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='caption' color='textSecondary'>
                {unit.type === UnitType.assemblyLine
                  ? t('unitsSection.assemblyLine')
                  : t('unitsSection.productionUnit')}
              </Typography>
            </Grid>
          </Grid>
        </MenuItem>
      ))}
    </>
  )
}

export default UnitList
