import { memo, useCallback, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Grid, Typography } from '@mui/material'
import ClassificationChips from 'components/Chips/ClassificationChips'
import { Classification } from 'contexts/iProcessContext'
import { isDefined } from 'shared'

interface ChipPositions {
  categoryIndex?: number
  reasonIndex?: number
  typeIndex?: number
}

const showReasonOptions = ({ categoryIndex }: ChipPositions) => isDefined(categoryIndex)

const showTypeOptions = ({ categoryIndex, reasonIndex }: ChipPositions, selectedReason: Classification | undefined) =>
  isDefined(categoryIndex) && isDefined(reasonIndex) && (selectedReason?.options?.length || 0) > 0

interface DisruptionClassificationSectionProps {
  options: Classification[] | undefined
}

const DisruptionClassificationChips = ({ options }: DisruptionClassificationSectionProps) => {
  const { t } = useTranslation()
  const { setValue, watch } = useFormContext()

  // * Requirement for the parent component's form: it should use these 3 attributes for setting classification data
  // * This is also done in the 'handleSelectChip' function below
  const category = watch('categoryClassification')
  const reason = watch('reasonClassification')
  const type = watch('typeClassification')

  const { selectedCategory, selectedCategoryIndex, selectedReason, selectedReasonIndex, selectedTypeIndex } =
    useMemo(() => {
      const selectedCategory = options?.find((_) => _.value === category)
      const selectedReason = selectedCategory?.options?.find((_) => _.value === reason)
      const selectedCategoryIndex = options?.findIndex((_) => _.value === category)
      const selectedReasonIndex = selectedCategory?.options?.findIndex((_) => _.value === reason)
      const selectedTypeIndex = selectedReason?.options?.findIndex((_) => _.value === type)

      return {
        selectedCategory,
        selectedReason,
        selectedCategoryIndex: selectedCategoryIndex === -1 ? undefined : selectedCategoryIndex,
        selectedReasonIndex: selectedReasonIndex === -1 ? undefined : selectedReasonIndex,
        selectedTypeIndex: selectedTypeIndex === -1 ? undefined : selectedTypeIndex
      }
    }, [options, category, reason, type])

  const [chipsPosition, setChipsPosition] = useState<ChipPositions>({
    categoryIndex: selectedCategoryIndex,
    reasonIndex: selectedReasonIndex,
    typeIndex: selectedTypeIndex
  })

  const handleSelectChip = useCallback(
    (item: Classification, name: string, index: number) => {
      switch (name) {
        case 'category':
          setChipsPosition({ categoryIndex: index, reasonIndex: undefined, typeIndex: undefined })
          setValue('categoryClassification', item.value, { shouldValidate: true })
          break

        case 'reason':
          setChipsPosition({ categoryIndex: chipsPosition.categoryIndex, reasonIndex: index, typeIndex: undefined })
          setValue('reasonClassification', item.value, { shouldValidate: true })
          break

        case 'type':
          setChipsPosition({
            categoryIndex: chipsPosition.categoryIndex,
            reasonIndex: chipsPosition.reasonIndex,
            typeIndex: index
          })
          setValue('typeClassification', item.value, { shouldValidate: true })
          break
      }
    },
    [chipsPosition.categoryIndex, chipsPosition.reasonIndex, setValue]
  )

  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Typography variant='overline'>{t('disruptionDialog.rightClassificationHeader')}</Typography>
      </Grid>
      <Grid item xs={12} id='classification-category'>
        <div style={{ marginBottom: '8px' }}>
          <Typography variant='caption'>{t('disruptionDialog.rightClassificationLocation')}</Typography>
        </div>
        <ClassificationChips
          options={options}
          name='category'
          onSelectChip={handleSelectChip}
          selectedIndex={chipsPosition.categoryIndex}
        />
      </Grid>
      <Grid item xs={12} id='classification-reason'>
        {showReasonOptions(chipsPosition) && (
          <div style={{ marginBottom: '8px' }}>
            <Typography variant='caption'>{t('disruptionDialog.rightClassificationLocation2')}</Typography>
          </div>
        )}
        <ClassificationChips
          options={selectedCategory?.options}
          name='reason'
          onSelectChip={handleSelectChip}
          selectedIndex={chipsPosition.reasonIndex}
        />
      </Grid>
      <Grid item xs={12} style={{ marginBottom: '1rem' }} id='classification-type'>
        {showTypeOptions(chipsPosition, selectedReason) && (
          <div style={{ marginBottom: '8px' }}>
            <Typography variant='caption'>{t('disruptionDialog.rightClassificationType')}</Typography>
          </div>
        )}
        <ClassificationChips
          options={selectedReason?.options}
          name='type'
          onSelectChip={handleSelectChip}
          selectedIndex={chipsPosition.typeIndex}
        />
      </Grid>
    </Grid>
  )
}

export default memo(DisruptionClassificationChips)
