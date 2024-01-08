import { useTranslation } from 'react-i18next'
import { Checkbox, Divider, Grid, MenuItem, Typography } from '@mui/material'
import { useStorePareto } from 'contexts/paretoStore'
import { colors } from 'theme'

// ! TODO: Remove duplicated code
interface OptionListProps<T> {
  items: T[]
  values: string[]
  storeKey: string
  onClickItem: (selected: string) => void
}

const OptionList = <T extends string>({ items, values, storeKey, onClickItem }: OptionListProps<T>) => {
  const { t } = useTranslation(['dashboard', 'iProcess'])
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
              key={item}
              value={item}
              style={{
                backgroundColor: values?.includes(item) ? colors.bluegray : ''
              }}
            >
              <Grid container>
                <Grid container direction='row' alignItems='center'>
                  <Grid item xs={1} style={{ paddingTop: 2 }} onClick={() => onClickItem(item)}>
                    <Checkbox size='small' color='primary' checked={values.includes(item)} id={`menu-item-${item}`} />
                  </Grid>
                  <Grid item xs={isFirstItem ? 8 : 11} onClick={() => onClickItem(item)}>
                    <Typography variant='caption' color='textSecondary' style={{ marginRight: '1rem' }}>
                      {item}
                    </Typography>
                  </Grid>
                  {isFirstItem ? (
                    <Grid item xs={3} onClick={handleClearAll}>
                      <Typography variant='caption' textAlign='center'>
                        {t('dashboard:paretoFilter.clearAll')}
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

export default OptionList
