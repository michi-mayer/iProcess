import { FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import DeleteIcon from '@mui/icons-material/Delete'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Grid, IconButton, Paper, Typography } from '@mui/material'
import { ExtendedProductWithUnits } from 'APIcustom'
import { v4 as uuid } from 'uuid'
import { QualityIssueConfigSchema } from 'zodSchemas'
import type { ProductDialogForm } from 'components/Dialogs/Admin/ProductDialog' // ! Will this cause circular imports?
import { FullSizedForm } from 'components/styled'
import { QualityIssueConfig } from 'contexts/iProcessContext'
import { EMPTY_STRING } from 'helper/constants'
import useMutateProduct from 'hooks/services/useMutateProduct'
import useCloseDialog from 'hooks/useCloseDialog'
import { GroupUIButton, GroupUILayout, GroupUISubmitButton } from 'lib/ui/Buttons'
import { colors } from 'theme'
import ImageCropper from './ImageCropper'
import NavigationInputForm from './NavigationInputForm'
import StackInputForm from './StackInputForm'

interface ClassificationValueInputFormProps {
  width?: number | string
}

const ClassificationValueInputForm = ({ width }: ClassificationValueInputFormProps) => {
  const { t } = useTranslation('admin')
  const {
    formState: { errors },
    control,
    register
  } = useFormContext<QualityIssueConfig>()
  const { fields, append, remove } = useFieldArray({ control, name: 'nioClassificationLocation' })

  return (
    <StackInputForm
      id='nioClassificationLocation'
      name='nioClassificationLocation'
      maxElements={5}
      amountOfItems={fields.length}
      error={!!errors.nioClassificationLocation}
      handleAddItem={() => append({ id: uuid(), value: EMPTY_STRING })}
      title={t('productsSection.classification')}
      errorMessage={t('productsSection.genericFillInputMessage')}
      addItemTitle={t('productsSection.addElement')}
    >
      {fields.map((classification, index) => (
        <Grid
          container
          item
          direction='row'
          style={{ borderBottom: `0.3px solid ${colors.gray2}`, paddingBottom: '5px', paddingTop: '5px', width }}
          key={classification?.id}
        >
          <NavigationInputForm
            {...register(`nioClassificationLocation.${index}.value`)}
            className='nioClassificationLocation'
            placeholder={t('productsSection.locationPlaceholder')}
            style={{ width: '80%' }}
            error={!!errors.nioClassificationLocation}
            inputProps={{ maxLength: 40 }}
          />
          <IconButton id={`delete-${classification.id}`} onClick={() => remove(index)} size='large'>
            <DeleteIcon style={{ color: colors.blue }} />
          </IconButton>
        </Grid>
      ))}
    </StackInputForm>
  )
}

const ClassificationTypeInputForm = ({ width }: ClassificationValueInputFormProps) => {
  const { t } = useTranslation('admin')
  const {
    formState: { errors },
    control,
    register
  } = useFormContext<QualityIssueConfig>()
  const { fields, append, remove } = useFieldArray({ control, name: 'nioClassificationDamageType' })

  return (
    <StackInputForm
      id='nioClassificationDamageType'
      name='nioClassificationDamageType'
      maxElements={10}
      amountOfItems={fields.length}
      error={!!errors.nioClassificationDamageType}
      handleAddItem={() => append({ id: uuid(), value: EMPTY_STRING })}
      title={t('productsSection.typeOfDisruption')}
      errorMessage={t('productsSection.genericFillInputMessage')}
      addItemTitle={t('productsSection.addElement')}
    >
      {fields.map((classification, index) => (
        <Grid
          container
          item
          direction='row'
          style={{ borderBottom: `0.3px solid ${colors.gray2}`, paddingBottom: '5px', paddingTop: '5px', width }}
          key={classification?.id}
        >
          <NavigationInputForm
            {...register(`nioClassificationDamageType.${index}.value`)}
            className='nioClassificationDamageType'
            placeholder={t('productsSection.damageTypePlaceholder')}
            style={{ width: '80%' }}
            error={!!errors.nioClassificationLocation}
            inputProps={{ maxLength: 40 }}
          />
          <IconButton id={`delete-${classification.id}`} onClick={() => remove(index)} size='large'>
            <DeleteIcon style={{ color: colors.blue }} />
          </IconButton>
        </Grid>
      ))}
    </StackInputForm>
  )
}

const ClassificationSourceInputForm = ({ width }: ClassificationValueInputFormProps) => {
  const { t } = useTranslation('admin')
  const {
    formState: { errors },
    control,
    register
  } = useFormContext<QualityIssueConfig>()
  const { fields, append, remove } = useFieldArray({ control, name: 'nioClassificationErrorSource' })

  return (
    <StackInputForm
      name='nioClassificationErrorSource'
      id='nioClassificationErrorSource'
      maxElements={3}
      amountOfItems={fields.length}
      error={!!errors.nioClassificationErrorSource}
      handleAddItem={() => append({ id: uuid(), value: EMPTY_STRING })}
      title={t('productsSection.errorSource')}
      errorMessage={t('productsSection.genericFillInputMessage')}
      addItemTitle={t('productsSection.addElement')}
    >
      {fields.map((classification, index) => (
        <Grid
          container
          item
          direction='row'
          style={{ borderBottom: `0.3px solid ${colors.gray2}`, paddingBottom: '5px', paddingTop: '5px', width }}
          key={classification?.id}
        >
          <NavigationInputForm
            {...register(`nioClassificationErrorSource.${index}.value`)}
            className='nioClassificationErrorSource'
            placeholder={t('productsSection.errorSourcePlaceholder')}
            style={{ width: '80%' }}
            error={!!errors.nioClassificationLocation}
            inputProps={{ maxLength: 40 }}
          />
          <IconButton id={`delete-${classification.id}`} onClick={() => remove(index)} size='large'>
            <DeleteIcon style={{ color: colors.blue }} />
          </IconButton>
        </Grid>
      ))}
    </StackInputForm>
  )
}

const initialState: QualityIssueConfig = {
  nioClassificationLocation: undefined,
  nioClassificationDamageType: undefined,
  nioClassificationErrorSource: undefined,
  hasQualityIssueConfig: undefined,
  partImageKeyFront: undefined,
  partImageKeyBack: undefined
}

interface QualityIssueFormProps {
  product: ExtendedProductWithUnits
  onClose: () => void
  onClickBackButton: () => void
}

const QualityIssueForm = ({ product, onClose, onClickBackButton }: QualityIssueFormProps) => {
  const { t } = useTranslation('admin')
  const { mutate, isPending, isSuccess } = useMutateProduct()

  // * Mind we have 2 FormProviders; one in here and one in 'ProductDialog'
  const { getValues } = useFormContext<ProductDialogForm & QualityIssueConfig>()

  const methods = useForm<QualityIssueConfig>({
    resolver: zodResolver(QualityIssueConfigSchema),
    defaultValues: { ...initialState, ...product }
  })

  const { watch, setValue, handleSubmit } = methods

  useCloseDialog(isSuccess, onClose)

  const partImageKeyBack = watch('partImageKeyBack')
  const partImageKeyFront = watch('partImageKeyFront')

  const onSubmit = (data: QualityIssueConfig) => {
    const { id, name, partNumber, unitsConfig, selectedUnits } = getValues()
    mutate({ ...data, id, name, partNumber, unitsConfig, selectedUnits })
  }

  return (
    <FormProvider {...methods}>
      <FullSizedForm onSubmit={handleSubmit(onSubmit)}>
        <div style={{ height: '100%', justifyContent: 'space-between' }}>
          <Grid container item direction='row' style={{ height: '80%' }}>
            <Grid container item style={{ marginBottom: '1rem' }}>
              <Typography variant='caption' color='inherit' style={{ fontSize: 14, marginLeft: '17rem' }}>
                {t('productsSection.mandatoryInfo')}
              </Typography>
            </Grid>
            <Paper
              elevation={0}
              square
              style={{
                borderRight: `0.5px solid ${colors.gray3}`,
                maxHeight: '100%',
                width: '32%',
                overflow: 'auto'
              }}
            >
              <ClassificationValueInputForm />
              <ClassificationTypeInputForm />
              <ClassificationSourceInputForm />
            </Paper>
            <Paper elevation={0} square style={{ paddingLeft: '5rem', overflow: 'hidden', width: '63%' }}>
              <Grid container direction='column'>
                <Typography variant='overline'>{t('productsSection.imageTitle')}</Typography>
                <Grid container item direction='row' style={{ justifyContent: 'space-around', width: '100%' }}>
                  <ImageCropper
                    onCroppedImage={(_) => setValue('partImageKeyFront', _, { shouldValidate: true })}
                    croppedImageKey={partImageKeyFront}
                  />
                  <ImageCropper
                    onCroppedImage={(_) => setValue('partImageKeyBack', _, { shouldValidate: true })}
                    croppedImageKey={partImageKeyBack}
                  />
                </Grid>
              </Grid>
              <Grid container item alignItems='flex-end' style={{ height: '2.5rem', marginLeft: 10 }}>
                <ErrorOutlineIcon color='primary' />
                <Typography variant='caption' color='inherit' style={{ marginLeft: 5, fontSize: 14 }}>
                  {t('productsSection.acceptedFormats')}
                </Typography>
              </Grid>
            </Paper>
          </Grid>
          <GroupUILayout>
            <GroupUIButton
              id='products-usetemplate-dialog-discard'
              icon='chevron-left-24'
              variant='secondary'
              onClick={onClickBackButton}
            >
              {t('productsSection.goBack')}
            </GroupUIButton>
            <GroupUISubmitButton
              id='submit-button'
              icon={isPending ? 'icon-empty-24' : 'save-24'}
              isLoading={isPending}
            >
              {t('buttons.save')}
            </GroupUISubmitButton>
          </GroupUILayout>
        </div>
      </FullSizedForm>
    </FormProvider>
  )
}

export default QualityIssueForm
