import { useEffect, useMemo } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { Divider, Grid, Typography } from '@mui/material'
import { z } from 'zod'
import { RejectedFormSchema } from 'zodSchemas'
import ClassificationChips from 'components/Chips/ClassificationChips'
import { Classification, useIProcessState } from 'contexts/iProcessContext'
import { getSelectedTabStartTime } from 'helper/time'
import useMutateRejected, { convertToDefectiveGrid } from 'hooks/services/useMutateRejected'
import useQueryFile from 'hooks/services/useQueryFile'
import { Rejected } from 'hooks/services/useQueryRejectedCount'
import useNow from 'hooks/useNow'
import Counter from 'lib/form/Counter'
import TimePicker from 'lib/form/TimePicker'
import { GroupUIDiscardButton, GroupUILayout, GroupUISubmitButton } from 'lib/ui/Buttons'
import {
  selectorAddRejectedCountButtonRejectedForm,
  selectorRejectedCountRejectedForm, selectorRemoveRejectedCountButtonRejectedForm,
  selectorSubmitButtonRejectedForm
} from '../../selector-ids'
import CustomDialog from '../CustomDialog'
import { validateNumber } from '../DisruptionDialogs/utils'
import CheckboxListForm from './CheckboxListForm'
import RadioListForm from './RadioListForm'
import RejectedGrid, { GridImage } from './RejectedGrid'

const ImageGridSchema = z
  .object({
    hasImages: z.boolean().optional(),
    gridImageA: z.array(z.number()).optional(),
    gridImageB: z.array(z.number()).optional()
  })
  .refine(
    ({ gridImageA, gridImageB, hasImages }) => {
      const imageALength = gridImageA?.length || 0
      const imageBLength = gridImageB?.length || 0

      if (hasImages) {
        return hasImages && imageALength + imageBLength !== 0
      } else {
        return true
      }
    },
    {
      message: `At least one square of the grid (gridImageA, gridImageB) should be selected`,
      path: ['gridImageA', 'gridImageB']
    }
  )

const BaseRejectedFormWithQualityIssueSchema = RejectedFormSchema.extend({
  location: z.string().min(1),
  damageType: z.string().min(1),
  errorSource: z
    .array(
      z.object({
        id: z.string(),
        value: z.string()
      })
    )
    .optional(),
  selectedLocationIndex: z.number()
})

const RejectedFormWithQualityIssueSchema = z.intersection(BaseRejectedFormWithQualityIssueSchema, ImageGridSchema)

type IRejectedFormWithQualityIssueSchema = z.infer<typeof RejectedFormWithQualityIssueSchema>

interface RejectedFormWithQualityIssueProps {
  onClose: () => void
  openDialog: boolean
  rejected?: Rejected
}

const RejectedFormWithQualityIssue = ({ onClose, openDialog, rejected }: RejectedFormWithQualityIssueProps) => {
  const { t } = useTranslation('iProcess')
  const now = useNow([openDialog])
  // Global State
  const { unitSelected, productSelected, currentShiftScheduleSlots, selectedShiftTab, currentShiftTab } =
    useIProcessState()

  const timeSlotStartTime = getSelectedTabStartTime({ currentShiftScheduleSlots, selectedShiftTab, currentShiftTab })

  // Mutations and queries
  const { data: partImageUrlFront, isSuccess: isSuccessFront } = useQueryFile(productSelected.partImageKeyFront)
  const { data: partImageUrlBack, isSuccess: isSuccessBack } = useQueryFile(productSelected.partImageKeyBack)

  const { mutate: createDefective, isSuccess, isPending } = useMutateRejected('create')
  const { mutate: updateDefective, isSuccess: isUpdateSuccess } = useMutateRejected('update')

  const initialValues: IRejectedFormWithQualityIssueSchema = useMemo(
    () => ({
      hasImages: false,
      location: '',
      damageType: '',
      errorSource: [],
      timeStamp: timeSlotStartTime ?? now,
      count: 0,
      gridImageA: productSelected.partImageKeyFront ? [] : undefined,
      gridImageB: productSelected.partImageKeyBack ? [] : undefined,
      selectedLocationIndex: -1
    }),
    [now, productSelected.partImageKeyBack, productSelected.partImageKeyFront, timeSlotStartTime]
  )

  const methods = useForm<IRejectedFormWithQualityIssueSchema>({
    shouldUnregister: true,
    resolver: zodResolver(RejectedFormWithQualityIssueSchema),
    defaultValues: initialValues
  })

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
    register,
    clearErrors
  } = methods

  const gridImageA = watch('gridImageA')
  const gridImageB = watch('gridImageB')
  const typeOfDamage = watch('damageType')

  const onSubmit: SubmitHandler<IRejectedFormWithQualityIssueSchema> = (data) => {
    if (data?.id) {
      const defectiveGridA = watch('gridImageA')
      const defectiveGridB = watch('gridImageB')
      const defectiveGrid = convertToDefectiveGrid(defectiveGridA, defectiveGridB)
      updateDefective({ ...data, defectiveGrid })
    } else {
      createDefective(data)
    }
  }

  const frontImageExists = productSelected.partImageKeyFront && isSuccessFront
  const backImageExists = productSelected.partImageKeyBack && isSuccessBack
  const hasImages = frontImageExists || backImageExists

  const handleClickToggle = (item: Classification, event: React.MouseEvent<HTMLDivElement>) => {
    event?.preventDefault()

    let errorSource = watch('errorSource') || []

    const isUnselectAction = errorSource?.some((error) => error.id === item?.id)

    if (isUnselectAction) {
      errorSource = errorSource?.filter((classification: Classification) => classification.id !== item.id) || []
    } else {
      errorSource.push(item)
    }
    setValue('errorSource', errorSource, { shouldValidate: true })
  }

  const handleClickRejectedGrid = (item: number, name: GridImage) => {
    let items: number[] = []
    const gridImage = watch(name) || []

    if (gridImage?.includes(item)) {
      items = gridImage?.filter((element) => element !== item)
    } else {
      items = [...gridImage, item]
    }

    setValue(name, items, { shouldValidate: true })
  }

  useEffect(() => {
    let mounted = true
    if (mounted && (isSuccess || isUpdateSuccess)) onClose()
    return () => {
      mounted = false
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isUpdateSuccess])

  useEffect(() => {
    if ((gridImageA && gridImageA.length > 0) || (gridImageB && gridImageB.length > 0)) {
      clearErrors('gridImageA')
      clearErrors('gridImageB')
    }

    if (hasImages) {
      setValue('hasImages', true)
    }
  }, [clearErrors, gridImageA, gridImageB, hasImages, setValue])

  useEffect(() => {
    if (!openDialog) {
      reset(initialValues)
    }
  }, [initialValues, openDialog, reset])

  useEffect(() => {
    let mounted = true

    const setStoredValues = () => {
      if (rejected) {
        const defectiveCause = rejected?.defectiveCause?.split(';').map((_) => _.trim())
        const errorSource = productSelected.nioClassificationErrorSource?.filter(
          (_) => defectiveCause?.includes(_.value)
        )

        let selectLocationIndex = -1
        if (productSelected.nioClassificationLocation) {
          selectLocationIndex = productSelected.nioClassificationLocation?.findIndex(
            (item) => item.value === rejected.classification
          )
        }

        // Convert to gridData
        const gridA = rejected.defectiveGrid?.split(';').filter((item) => item.includes('A'))
        const topGridNumber = gridA?.map((item) => Number.parseInt(item.replace('A', '')))
        const gridB = rejected.defectiveGrid?.split(';').filter((item) => item.includes('B'))
        const bottomGridNumber = gridB?.map((item) => Number.parseInt(item.replace('B', '')))

        setValue('gridImageA', topGridNumber)
        setValue('gridImageB', bottomGridNumber)

        setValue('id', rejected.id)
        setValue('damageType', rejected.typeOfDamage)
        setValue('errorSource', errorSource)
        setValue('location', rejected.classification)
        setValue('count', rejected.count)
        setValue('selectedLocationIndex', selectLocationIndex)
        setValue('timeStamp', rejected?.timeStamp ?? timeSlotStartTime)
      } else {
        setValue('timeStamp', timeSlotStartTime ?? now)
      }
    }

    if (mounted && openDialog) setStoredValues()

    return () => {
      mounted = false
    }
  }, [
    rejected,
    openDialog,
    productSelected.nioClassificationErrorSource,
    productSelected.nioClassificationLocation,
    setValue,
    timeSlotStartTime,
    now
  ])

  const hasClassificationErrorSource =
    productSelected.nioClassificationErrorSource && productSelected.nioClassificationErrorSource?.length > 0
  const rejectedProducts = watch('count')

  return (
    <CustomDialog
      onClose={onClose}
      open={openDialog}
      maxWidth={false}
      title={t('nioDialog.leftHeader')}
      dialogContentStyle={{ width: '624px' }}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container>
            {/* Content */}
            <Grid container item>
              {/* Entry Rejected Products */}
              <Grid container item style={{ marginTop: '1rem' }}>
                <Grid item xs={6}>
                  <Typography variant='h5'>{t('nioDialog.leftMachine')}</Typography>
                  <Typography variant='body1'>{unitSelected?.shortName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='h5'>{t('nioDialog.leftProduct')}</Typography>
                  <Typography variant='body1'>{productSelected.name}</Typography>
                </Grid>
              </Grid>
              <Grid container display='flex' flexDirection='column' style={{ maxWidth: '276px', marginTop: '1rem' }}>
                <Typography variant='subtitle1'>{t('nioDialog.leftTimeStamp')}</Typography>
                <TimePicker
                  errorMessage={t('nioDialog.nioDamageTime')}
                  isError={!!errors.timeStamp}
                  {...register('timeStamp')}
                />
              </Grid>
              <Grid item style={{ marginTop: '16px' }}></Grid>

              <Grid container display='flex' flexDirection='column'>
                <Divider style={{ width: '100%', marginBottom: '1rem', marginTop: '1rem' }} />
                <Typography variant='h4' style={{ marginBottom: '1rem' }}>
                  {t('nioDialog.amountOfRejects')}*
                </Typography>
                <Counter
                  {...register('count', {
                    valueAsNumber: true,
                    setValueAs: (value) => validateNumber(value)
                  })}
                  formStateField='count'
                  errorMessage={t('nioDialog.nioCounterMissing')}
                  isError={!!errors.count}
                  defaultValue={rejectedProducts}
                  inputId={`${selectorRejectedCountRejectedForm}`}
                  addButtonId={`${selectorAddRejectedCountButtonRejectedForm}`}
                  removeButtonId={`${selectorRemoveRejectedCountButtonRejectedForm}`}
                />
                <Divider style={{ width: '100%', marginBottom: '1rem', marginTop: '1rem' }} />
              </Grid>
              {/* Images */}
              <Grid container item>
                {hasImages && (
                  <Grid container item style={{ height: '90%' }}>
                    <Grid item xs={12}>
                      <Typography variant='h4'>{t('nioDialog.rightHeader')}</Typography>
                    </Grid>
                    <Grid item xs={12} style={{ margin: '8px 0px' }}>
                      <Typography variant='caption'>{t('nioDialog.rightSubHeader')}</Typography>
                    </Grid>
                    {frontImageExists && (
                      <Grid id='left-rejected-grid' item style={{ width: '275px', height: '200px' }}>
                        <RejectedGrid
                          onClickRejectedGrid={handleClickRejectedGrid}
                          nioClassificationGrid={watch('gridImageA')}
                          backgroundImage={`url(${partImageUrlFront})`}
                          name='gridImageA'
                        />
                      </Grid>
                    )}
                    {backImageExists && (
                      <Grid
                        id='right-rejected-grid'
                        item
                        style={{ width: '275px', height: '200px', marginLeft: frontImageExists ? '24px' : undefined }}
                      >
                        <RejectedGrid
                          onClickRejectedGrid={handleClickRejectedGrid}
                          nioClassificationGrid={watch('gridImageB')}
                          backgroundImage={`url(${partImageUrlBack})`}
                          name='gridImageB'
                        />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      {(!!errors.gridImageA || !!errors.gridImageB) && (
                        <Typography variant='subtitle2' style={{ padding: '12px' }}>
                          {t('nioDialog.nioClassificationGridHeckklappeMissing')}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                )}
              </Grid>
              {hasImages && <Divider style={{ width: '100%', marginBottom: '2rem', marginTop: '1rem' }} />}
              {/* Classification, Damage Source, Type of damage */}
              <Grid display='flex'>
                {/* left: Classification, Damage Source */}
                <Grid container item direction='column' xs={6}>
                  <Grid item style={{ height: 'fit-content' }}>
                    <Typography variant='h4' style={{ marginRight: '10rem', marginBottom: '1rem' }}>
                      {t('nioDialog.leftClassification')}
                    </Typography>
                    <ClassificationChips
                      options={productSelected.nioClassificationLocation}
                      onSelectChip={({ value }, _, index) => {
                        setValue('location', value, { shouldValidate: true })
                        setValue('selectedLocationIndex', index)
                      }}
                      selectedIndex={watch('selectedLocationIndex')}
                      name='location'
                    />
                    {!!errors.location && (
                      <Typography variant='subtitle2' style={{ padding: '12px' }}>
                        {t('nioDialog.nioClassificationLocationMissing')}
                      </Typography>
                    )}
                  </Grid>
                  {hasClassificationErrorSource && (
                    <Grid item id='nio-error-source' style={{ marginTop: '24px' }}>
                      <Typography variant='h4' style={{ marginBottom: '1rem' }}>
                        {t('nioDialog.leftDamageSource')}
                      </Typography>
                      <CheckboxListForm
                        id='errorSource-checkbox'
                        onClickToggle={handleClickToggle}
                        checked={watch('errorSource')?.map((_) => _.id) || []}
                        items={productSelected.nioClassificationErrorSource}
                      />
                    </Grid>
                  )}
                </Grid>
                {/* right: Damage Type */}
                <Grid container item xs={12} md={6}>
                  <Grid item id='nio-damage-type'>
                    <Typography variant='h4' style={{ marginBottom: '16px' }}>
                      {t('nioDialog.leftDamageType')}
                    </Typography>
                    <RadioListForm
                      errorMessage={t('nioDialog.nioClassificationDamageTypeMissing')}
                      isError={!!errors.damageType}
                      isTextFieldError={!!errors.damageType}
                      items={productSelected.nioClassificationDamageType}
                      selectedValue={typeOfDamage || ''}
                      {...register('damageType', { onChange: (event) => setValue('damageType', event.target.value) })}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/* Discard & Save buttons */}

            <GroupUILayout>
              <GroupUIDiscardButton onClick={onClose}>{t('buttons.discard')}</GroupUIDiscardButton>
              <GroupUISubmitButton
                id={`${selectorSubmitButtonRejectedForm}`}
                type='submit'
                icon={!isPending ? 'save-24' : 'icon-empty-24'}
                disabled={isPending}
              >
                {t('buttons.save')}
              </GroupUISubmitButton>
            </GroupUILayout>
          </Grid>
        </form>
      </FormProvider>
    </CustomDialog>
  )
}

export default RejectedFormWithQualityIssue
