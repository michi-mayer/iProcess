import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid, Typography } from '@mui/material'
import { TargetCycleTimeInput } from 'API'
import { ExtendedUnit } from 'contexts/iProcessContext'
import { onEmptyString } from 'helper/utils'
import { round } from 'shared'
import InputForm, { InputFormProps } from './InputForm'

interface UnitCycleTimeProps extends InputFormProps {
  unitCycleTimeTitle: string
  cycleTimeCollection: TargetCycleTimeInput[]
  isError?: boolean
  selectedUnits?: Partial<ExtendedUnit>[]
  onInputChange: (cycleTimeCollection: TargetCycleTimeInput[]) => void
}

const UnitCycleTime = ({
  unitCycleTimeTitle,
  cycleTimeCollection,
  onInputChange,
  isError,
  selectedUnits
}: UnitCycleTimeProps) => {
  const { t } = useTranslation('admin')

  const setTargetCycleTime = (event: ChangeEvent<HTMLInputElement>, unitId: string) => {
    const inputValue = Number(onEmptyString(event.target.value, '0'))
    const targetCycleTime = round(Math.abs(inputValue), 2)

    return cycleTimeCollection.map((_) => ({
      ..._,
      targetCycleTime: _.unitId === unitId ? targetCycleTime : _.targetCycleTime
    }))
  }

  return (
    <Grid container item direction='column'>
      <Grid container item>
        <Typography variant='overline'>{unitCycleTimeTitle}</Typography>
      </Grid>
      <Grid container item>
        <Grid container item xs={6}>
          <Typography variant='caption'>{t('productsSection.unitConfig')}</Typography>
        </Grid>
        <Grid container item xs={6} style={{ paddingLeft: '1.5rem' }}>
          <Typography variant='caption'>{t('productsSection.targetCycleTime')}</Typography>
        </Grid>
      </Grid>
      <Grid container item direction='column'>
        {cycleTimeCollection?.map(({ unitId, targetCycleTime }) => {
          const { shortName } = selectedUnits?.find((_) => _.id === unitId) ?? {}

          return (
            <Grid container item direction='row' key={unitId}>
              <Grid container item xs={6}>
                <InputForm
                  name='name'
                  value={shortName}
                  style={{ width: '90%', marginBottom: '0.5rem' }}
                  marginTop='0px'
                  disabled
                />
              </Grid>
              <Grid container item xs={6} direction='column' style={{ paddingLeft: '1.5rem' }}>
                <InputForm
                  name='targetCycleTime'
                  id={`targetCycleTime-${shortName}`}
                  type='number'
                  onChange={(event) => onInputChange(setTargetCycleTime(event, unitId))}
                  value={targetCycleTime || ''}
                  style={{ width: '98%' }}
                  error={isError && !targetCycleTime}
                  inputProps={{ min: 0 }}
                  errorMessage={t('productsSection.genericFillInputMessage')}
                  placeholder={t('productsSection.targetCycleTimePlaceHolder')}
                  marginTop='0px'
                />
              </Grid>
            </Grid>
          )
        })}
      </Grid>
    </Grid>
  )
}

export default UnitCycleTime
