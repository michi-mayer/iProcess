import { useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { GroupuiRadioButton, GroupuiRadioGroup } from '@group-ui/group-ui-react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { differenceWith } from 'remeda'
import { Bool, UnitType } from 'API'
import type { ProductDialogForm } from 'components/Dialogs/Admin/ProductDialog'
import { FullSizedForm } from 'components/styled'
import { ExtendedUnit, UnitBasicInfo } from 'contexts/iProcessContext'
import { EMPTY_STRING } from 'helper/constants'
import useMutateProduct from 'hooks/services/useMutateProduct'
import useQueryListUnits from 'hooks/services/useQueryListUnits'
import useCloseDialog from 'hooks/useCloseDialog'
import { GroupUIDiscardButton, GroupUILayout, GroupUISubmitButton } from 'lib/ui/Buttons'
import { WithID } from 'shared'
import { colors } from 'theme'
import { selectorSelectUnits } from '../../routes/admin/selector-ids'
import InputForm from './InputForm'
import SelectForm from './SelectForm'
import UnitCycleTime from './UnitCycleTime'
import UnitList from './UnitList'

interface ProductInfoFormProps {
  alreadySelectedUnits: (ExtendedUnit & WithID)[] | undefined
  unitsFromProducts: ExtendedUnit[]
  onClose: () => void
  onClickNextButton: () => void
}

const ProductInfoForm = ({
  onClickNextButton,
  onClose,
  unitsFromProducts,
  alreadySelectedUnits = []
}: ProductInfoFormProps) => {
  const [selectableUnits, setSelectableUnits] = useState<(ExtendedUnit & WithID)[] | undefined>([])
  const [unitsType, setUnitsType] = useState<UnitType | string>()

  const { t } = useTranslation('admin')
  const { data } = useQueryListUnits()
  const { mutate, isPending, isSuccess } = useMutateProduct()

  const {
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
    register
  } = useFormContext<ProductDialogForm>()

  useCloseDialog(isSuccess, onClose)

  const unitsConfig = watch('unitsConfig')
  const selectedUnits = watch('selectedUnits')
  const hasQualityIssueConfig = watch('hasQualityIssueConfig')

  const hasQualityIssueConfigRegister = register('hasQualityIssueConfig')

  const allUnits = data?.items
  const selectedUnitType = selectedUnits?.[0]?.type
  const continueToQualityIssueConfig =
    hasQualityIssueConfig === Bool.yes && selectedUnitType === UnitType.productionUnit

  const onSubmit = (data: ProductDialogForm) => {
    if (continueToQualityIssueConfig) {
      onClickNextButton()
    } else {
      mutate(data)
    }
  }

  const handleSelectUnits = (_: string, values: UnitBasicInfo[], unitId: string) => {
    const unitIsAlreadySetUp = unitsConfig?.some((_) => _.unitId === unitId)

    const updatedUnitsConfig = unitIsAlreadySetUp
      ? unitsConfig?.filter((_) => _.unitId !== unitId)
      : [...(unitsConfig ?? []), { unitId, targetCycleTime: 0 }]

    // if (unitType === UnitType.assemblyLine && hasQualityIssueConfig) setValue('hasQualityIssueConfig', Bool.no)
    setValue('unitsConfig', updatedUnitsConfig)
    setValue('selectedUnits', values)
  }

  const filterAvailableUnitsByType = useCallback(() => {
    const isAddingNewPart = selectedUnits?.length === 0
    const usedALUnits = unitsFromProducts.filter((_) => _.type === UnitType.assemblyLine)

    let allAvailableUnits = differenceWith(allUnits ?? [], usedALUnits, (first, second) => first.id === second.id)

    if (isAddingNewPart) {
      setSelectableUnits(allAvailableUnits)
      setUnitsType(undefined)
    } else {
      // * If the user already selected an unit, then the app should only display units of the same type
      if (selectedUnitType) {
        if (alreadySelectedUnits?.[0]?.type === UnitType.assemblyLine) {
          allAvailableUnits = allAvailableUnits?.concat(alreadySelectedUnits ?? [])
        }

        const sameUnitType = allAvailableUnits?.filter((_) => _.type === selectedUnitType)

        setUnitsType(selectedUnitType)
        setSelectableUnits(sameUnitType)
      }
    }
  }, [allUnits, selectedUnitType, selectedUnits?.length, alreadySelectedUnits, unitsFromProducts])

  useEffect(() => {
    let mounted = true

    if (allUnits && mounted) filterAvailableUnitsByType()

    return () => {
      mounted = false
    }
  }, [filterAvailableUnitsByType, allUnits])

  return (
    <FullSizedForm onSubmit={handleSubmit(onSubmit)}>
      <Grid container item direction='row' style={{ height: '80%' }}>
        <Grid
          item
          xs={6}
          style={{
            borderRight: `0.5px solid ${colors.gray3}`,
            height: '100%'
          }}
        >
          <Grid container item justifyContent='flex-end'>
            <Typography variant='caption' color='inherit' style={{ fontSize: 14, paddingRight: '7rem' }}>
              {t('productsSection.mandatoryInfo')}
            </Typography>
          </Grid>
          <InputForm
            id='input-part-number'
            title={t('productsSection.productNumber')}
            errorMessage={t('productsSection.genericFillInputMessage')}
            placeholder={t('productsSection.productNumberPlaceholder')}
            error={!!errors.partNumber}
            {...register('partNumber')}
          />
          <InputForm
            id='input-part-name'
            title={t('productsSection.productName')}
            errorMessage={t('productsSection.genericFillInputMessage')}
            placeholder={t('productsSection.productNamePlaceholder')}
            error={!!errors.name}
            {...register('name')}
          />
          <SelectForm
            id={`${selectorSelectUnits}`}
            name='selectedUnits'
            popupDisplayWidth='90%'
            style={{ width: '80%' }}
            error={!!errors.selectedUnits}
            value={selectedUnits?.map((_) => _.shortName ?? _.id ?? EMPTY_STRING) ?? []}
            title={t('productsSection.unitsSelector')}
            errorMessage={t('productsSection.genericFillInputMessage')}
            placeholder={t('productsSection.unitSelectorPlaceholder')}
          >
            <UnitList
              name='selectedUnits'
              data={selectableUnits}
              values={selectedUnits ?? []}
              onClickItem={handleSelectUnits}
              getValue={(_) => _}
            />
          </SelectForm>
        </Grid>
        <Grid item xs={6} style={{ height: '100%', paddingLeft: '7rem' }}>
          <Paper
            square
            elevation={0}
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '30rem',
              overflowY: 'auto',
              paddingRight: '2rem'
            }}
          >
            {unitsType === UnitType.productionUnit && (
              <>
                <UnitCycleTime
                  unitCycleTimeTitle={t('productsSection.unitConfigtitle')}
                  cycleTimeCollection={unitsConfig ?? []}
                  isError={!!errors.unitsConfig}
                  selectedUnits={selectedUnits}
                  onInputChange={(_) => setValue('unitsConfig', _)}
                />
                <div style={{ marginTop: '2rem' }} />
                <Grid container item direction='column'>
                  <Typography variant='overline'>{t('productsSection.hasQualityIssue')}</Typography>
                  <GroupuiRadioGroup
                    aria-label={t('productsSection.hasQualityIssue')}
                    onGroupuiChange={hasQualityIssueConfigRegister.onChange}
                    {...hasQualityIssueConfigRegister}
                  >
                    <GroupuiRadioButton value={Bool.no}>{t('productsSection.quantityOnly')}</GroupuiRadioButton>
                    <GroupuiRadioButton value={Bool.yes}>{t('productsSection.withErrorPattern')}</GroupuiRadioButton>
                  </GroupuiRadioGroup>
                </Grid>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
      <GroupUILayout>
        <GroupUIDiscardButton id='products-usetemplate-dialog-discard' onClick={onClose}>
          {t('buttons.discard')}
        </GroupUIDiscardButton>
        <GroupUISubmitButton
          id='products-usetemplate-dialog-submit'
          icon={continueToQualityIssueConfig ? 'chevron-right-24' : isPending ? 'icon-empty-24' : 'save-24'}
          isLoading={isPending}
        >
          {continueToQualityIssueConfig ? t('productsSection.goToQualityIssue') : t('buttons.save')}
        </GroupUISubmitButton>
      </GroupUILayout>
    </FullSizedForm>
  )
}

export default ProductInfoForm
