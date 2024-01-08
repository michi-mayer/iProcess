import { useEffect, useState } from 'react'
import { FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import DeleteIcon from '@mui/icons-material/Delete'
import { Grid, IconButton, Typography } from '@mui/material'
import { DisruptionClassification, DisruptionDialogForm } from 'APIcustom'
import { ClassificationPath, Value } from 'types'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'
import { ClassificationPathSchema, UnitBasicInfoSchema } from 'zodSchemas'
import { FullSizedForm } from 'components/styled'
import type { UnitBasicInfo } from 'contexts/iProcessContext'
import { EMPTY_STRING } from 'helper/constants'
import useMutateDisruptionsClassification from 'hooks/services/useMutateDisruptionsClassification'
import useQueryListUnits from 'hooks/services/useQueryListUnits'
import useCloseDialog from 'hooks/useCloseDialog'
import NavigationInputForm from 'lib/form/NavigationInputForm'
import SelectForm from 'lib/form/SelectForm'
import StackInputForm from 'lib/form/StackInputForm'
import UnitList from 'lib/form/UnitList'
import { GroupUIDiscardButton, GroupUILayout, GroupUISubmitButton } from 'lib/ui/Buttons'
import { defined, isNonEmptyArray, NonEmptyString, parse } from 'shared'
import { colors } from 'theme'
import { selectorSelectUnits } from '../../../routes/admin/selector-ids'

const DisruptionDialogFormSchema = parse<DisruptionDialogForm>().with({
  id: NonEmptyString.optional(),
  selectedUnits: z.array(UnitBasicInfoSchema).min(1),
  classificationPath: z.array(ClassificationPathSchema).min(1),
  categoryIndex: z.number().nonnegative(),
  reasonIndex: z.number().nonnegative()
})

const initialState: Partial<DisruptionDialogForm> = {
  selectedUnits: [],
  classificationPath: [],
  categoryIndex: 0,
  reasonIndex: 0
}

const updateReasonOptions = (
  path: ClassificationPath,
  categoryIndex: number,
  reasonIndex: number,
  getOptions: (options: Value<string>[] | undefined) => Value<string>[] | undefined
) => {
  const reasonOptions = path[categoryIndex]?.options ?? []
  const result: typeof reasonOptions = []

  for (const [index, { id, value, options }] of reasonOptions.entries()) {
    const newOptions = index === reasonIndex ? getOptions(options) : options

    result.push({ id, value, options: newOptions })
  }

  return result
}

interface CategoryPathInputFormProps {
  width?: number | string
}

const CategoryPathInputForm = ({ width }: CategoryPathInputFormProps) => {
  const { t } = useTranslation('admin')

  const {
    formState: { errors },
    register,
    setValue,
    watch,
    control
  } = useFormContext<DisruptionDialogForm>()
  const { fields, append, update, remove } = useFieldArray({ control, name: 'classificationPath' })

  const path = watch('classificationPath')
  const reasonIndex = watch('reasonIndex')
  const categoryIndex = watch('categoryIndex')

  const getReasons = (index = categoryIndex) => path[index]?.options ?? []
  const getDisruptionTypes = (index = reasonIndex) => path[categoryIndex]?.options?.[index]?.options ?? []

  return (
    <>
      {/* // ! Category input form */}
      <Grid item style={{ width: '30%' }}>
        <StackInputForm
          name='category'
          id='disruption-category'
          title={t('disruptionsSection.categoryForm')}
          addItemTitle={t('disruptionsSection.addCategory')}
          errorMessage={t('disruptionsSection.inputFieldsErrorMessage')}
          error={!!errors?.classificationPath}
          amountOfItems={fields.length}
          handleAddItem={() =>
            append({ id: uuid(), value: EMPTY_STRING, options: [{ id: uuid(), value: EMPTY_STRING }] })
          }
        >
          {fields.map((category, index) => (
            <Grid
              container
              item
              direction='row'
              style={{ borderBottom: `0.3px solid ${colors.gray2}`, paddingBottom: '5px', paddingTop: '5px', width }}
              key={category?.id}
            >
              <NavigationInputForm
                {...register(`classificationPath.${index}.value`)}
                placeholder={t('disruptionsSection.categoryPlaceholder')}
                style={{ width: '80%' }}
                inputProps={{ maxLength: 40 }}
                error={!!errors.classificationPath}
                isSelected={categoryIndex === index}
                hasAdornment={getReasons(index).length > 0}
                onFocus={() => setValue('categoryIndex', index)}
                onClickAdornment={() => setValue('categoryIndex', index)}
              />
              <IconButton id={`delete-${category.id}`} size='large' onClick={() => remove(index)}>
                <DeleteIcon style={{ color: colors.blue }} />
              </IconButton>
            </Grid>
          ))}
        </StackInputForm>
      </Grid>
      {/* // ! Reason input form */}
      <Grid item style={{ width: '30%' }}>
        <StackInputForm
          name='reason'
          id='disruption-reason'
          title={t('disruptionsSection.reasonForm')}
          addItemTitle={t('disruptionsSection.addReason')}
          errorMessage={t('disruptionsSection.inputFieldsErrorMessage')}
          amountOfItems={getReasons().length}
          error={!!errors.classificationPath}
          handleAddItem={() => {
            const { id, value, options } = defined(path[categoryIndex])
            update(categoryIndex, { id, value, options: [...(options ?? []), { id: uuid(), value: EMPTY_STRING }] })
          }}
        >
          {getReasons().map((classification, index) => (
            <Grid
              container
              item
              direction='row'
              style={{ borderBottom: `0.3px solid ${colors.gray2}`, paddingBottom: '5px', paddingTop: '5px', width }}
              key={classification?.id}
            >
              <NavigationInputForm
                {...register(`classificationPath.${categoryIndex}.options.${index}.value`)}
                placeholder={t('disruptionsSection.reasonsPlaceholder')}
                style={{ width: '80%' }}
                inputProps={{ maxLength: 40 }}
                error={!!errors.classificationPath}
                isSelected={reasonIndex === index}
                hasAdornment={getDisruptionTypes(index).length > 0}
                onFocus={() => setValue('reasonIndex', index)}
                onClickAdornment={() => setValue('reasonIndex', index)}
              />
              <IconButton
                id={`delete-${classification.id}`}
                size='large'
                onClick={() => {
                  const { id, value, options } = defined(path[categoryIndex])
                  const currentItemId = path[categoryIndex]?.options?.[index]?.id

                  update(categoryIndex, { id, value, options: options?.filter((_) => _.id !== currentItemId) })
                }}
              >
                <DeleteIcon style={{ color: colors.blue }} />
              </IconButton>
            </Grid>
          ))}
        </StackInputForm>
      </Grid>
      {/* // ! Disruption types input form */}
      <Grid item style={{ width: '30%' }}>
        <StackInputForm
          name='type'
          id='disruption-type'
          title={t('disruptionsSection.typeForm')}
          addItemTitle={t('disruptionsSection.addType')}
          errorMessage={t('disruptionsSection.inputFieldsErrorMessage')}
          amountOfItems={fields.length}
          error={!!errors?.classificationPath}
          handleAddItem={() => {
            const { id, value } = defined(path[categoryIndex])
            const options = updateReasonOptions(path, categoryIndex, reasonIndex, (options) => [
              ...(options ?? []),
              { id: uuid(), value: EMPTY_STRING }
            ])

            update(categoryIndex, { id, value, options })
          }}
        >
          {getDisruptionTypes().map((classification, index) => {
            return (
              <Grid
                container
                item
                direction='row'
                style={{ borderBottom: `0.3px solid ${colors.gray2}`, paddingBottom: '5px', paddingTop: '5px', width }}
                key={classification?.id}
              >
                <NavigationInputForm
                  {...register(`classificationPath.${categoryIndex}.options.${reasonIndex}.options.${index}.value`)}
                  style={{ width: '80%' }}
                  inputProps={{ maxLength: 40 }}
                  error={!!errors.classificationPath}
                  placeholder={t('disruptionsSection.typePlaceholder')}
                />
                <IconButton
                  id={`delete-${classification.id}`}
                  size='large'
                  onClick={() => {
                    const { id, value } = defined(path[categoryIndex])
                    const currentItemId = path[categoryIndex]?.options?.[reasonIndex]?.options?.[index]?.id

                    const options = updateReasonOptions(
                      path,
                      categoryIndex,
                      reasonIndex,
                      (_) => _?.filter((_) => _.id !== currentItemId)
                    )

                    update(categoryIndex, { id, value, options })
                  }}
                >
                  <DeleteIcon style={{ color: colors.blue }} />
                </IconButton>
              </Grid>
            )
          })}
        </StackInputForm>
      </Grid>
    </>
  )
}

interface DisruptionsDialogProps {
  data: DisruptionClassification | undefined
  usedUnitIds: string[]
  onClose: () => void | undefined
}

// TODO: Rename to DisruptionDialog
const DisruptionsDialog = ({ data, usedUnitIds, onClose }: DisruptionsDialogProps) => {
  const [selectableUnits, setSelectableUnits] = useState<UnitBasicInfo[] | undefined>([])

  const { t } = useTranslation('admin')
  const { data: allUnits } = useQueryListUnits()
  const { mutate, isPending, isSuccess } = useMutateDisruptionsClassification()

  const hasCategories = isNonEmptyArray(data?.classificationPath)
  const hasReasons = hasCategories && data.classificationPath?.some((_) => isNonEmptyArray(_.options))

  const methods = useForm<DisruptionDialogForm>({
    resolver: zodResolver(DisruptionDialogFormSchema),
    defaultValues: {
      ...initialState,
      ...data,
      categoryIndex: hasCategories ? 0 : undefined,
      reasonIndex: hasReasons ? 0 : undefined
    }
  })

  const {
    formState: { errors },
    watch,
    setValue,
    handleSubmit
  } = methods

  useCloseDialog(isSuccess, onClose)

  const selectedUnits = watch('selectedUnits')

  const onSubmit = (data: DisruptionDialogForm) => void mutate(data)

  useEffect(() => {
    let mounted = true

    const filterUnits = () => {
      const filteredUnits = allUnits?.items?.filter((_) => !usedUnitIds.includes(_.id)) ?? []
      const selectableUnits = data ? [...filteredUnits, ...(data?.units ?? [])] : filteredUnits

      setSelectableUnits(selectableUnits)
    }

    if (mounted && usedUnitIds && allUnits) filterUnits()

    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, usedUnitIds, allUnits])

  return (
    <FormProvider {...methods}>
      <FullSizedForm onSubmit={handleSubmit(onSubmit)}>
        <Grid container item justifyContent='flex-end' xs={12}>
          <Typography variant='caption' color='inherit' style={{ fontSize: 14 }}>
            {t('disruptionsSection.mandatoryInfo')}
          </Typography>
        </Grid>
        <Grid container item style={{ width: '50%' }}>
          <SelectForm
            id={`${selectorSelectUnits}`}
            name='selectedUnits'
            title={`${t('disruptionsSection.unitSelector')}*`}
            error={!!errors?.selectedUnits}
            errorMessage={t('disruptionsSection.selectUnitErrorMessage')}
            value={selectedUnits?.map((_) => _.shortName ?? EMPTY_STRING) ?? []}
            placeholder={t('disruptionsSection.selectorPlaceholder')}
            popupDisplayWidth='554px'
          >
            <UnitList
              name='selectedUnits'
              data={selectableUnits}
              values={selectedUnits ?? []}
              onClickItem={(_, values) => setValue('selectedUnits', values)}
              getValue={(_) => _}
            />
          </SelectForm>
        </Grid>
        <Grid
          container
          item
          direction='row'
          justifyContent='space-between'
          style={{ margin: '2rem 0 3rem 0', height: '23rem' }}
        >
          <CategoryPathInputForm />
        </Grid>
        <GroupUILayout>
          <GroupUIDiscardButton id='disruptions-usetemplate-dialog-discard' onClick={onClose}>
            {t('buttons.discard')}
          </GroupUIDiscardButton>
          <GroupUISubmitButton
            id='disruptions-usetemplate-dialog-submit'
            icon={!isPending ? 'save-24' : 'icon-empty-24'}
            isLoading={isPending}
          >
            {t('buttons.save')}
          </GroupUISubmitButton>
        </GroupUILayout>
      </FullSizedForm>
    </FormProvider>
  )
}

export default DisruptionsDialog
