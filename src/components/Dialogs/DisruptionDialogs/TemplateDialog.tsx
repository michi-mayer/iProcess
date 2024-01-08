import { memo, useCallback, useEffect, useMemo } from 'react'
import { Controller, FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Divider,
  Grid,
  IconButton,
  ListItem,
  MenuItem,
  Paper,
  PaperProps,
  Stack,
  styled,
  Typography
} from '@mui/material'
import deIProcess from 'i18n/de/iProcess.json'
import enIProcess from 'i18n/en/iProcess.json'
import { Team, TemplateBase, TemplateBaseWithOriginator } from 'types'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { IssueSchema, TemplateBaseWithTeamInfoSchema } from 'zodSchemas'
import Chip from 'components/Chips/Chip'
import PlusIcon from 'components/Icons/PlusIcon'
import searchIcon from 'components/Icons/search-32.svg'
import { StyledKeyboardArrowDownIcon } from 'components/Measures/ReportMeasures'
import { useIProcessState } from 'contexts/iProcessContext'
import { DUPLICATED_VALUE, EMPTY_STRING } from 'helper/constants'
import { textIsIncluded } from 'helper/utils'
import useMutateSingleTemplate from 'hooks/services/useMutateSingleTemplate'
import useQueryIssues from 'hooks/services/useQueryIssues'
import useQueryListTemplatesFiltered from 'hooks/services/useQueryListTemplatesFiltered'
import useAllInfiniteData from 'hooks/useAllInfiniteData'
import useCloseDialog from 'hooks/useCloseDialog'
import usePreviousTeams from 'hooks/usePreviousTeams'
import useTeams from 'hooks/useTeams'
import DisruptionClassificationChips from 'lib/form/DisruptionClassificationChips'
import type { Direction } from 'lib/form/DraggableInputForm'
import DraggableInputForm, { moveItemTo } from 'lib/form/DraggableInputForm'
import { validateDuplicatedNames } from 'lib/form/helper/validate'
import InputForm from 'lib/form/InputForm'
import InputFormAutocomplete, { OptionChip } from 'lib/form/InputFormAutocomplete'
import { CustomSelect } from 'lib/form/SelectForm'
import { OnInputChange } from 'lib/form/types'
import { AddButton, GroupUIDiscardButton, GroupUILayout, GroupUISubmitButton } from 'lib/ui/Buttons'
import DragAndDrop from 'lib/ui/DragAndDrop'
import { NonEmptyString, UNIT_SPECIFIC_CYCLE_STATION } from 'shared'
import { colors } from 'theme'
import CustomDialog from '../CustomDialog'
import DisruptionDialogHeaderInfo from './DisruptionDialogHeaderInfo'

export const MenuItemStyled = styled(MenuItem)({
  '&.MuiButtonBase-root': {
    '&:hover': {
      backgroundColor: colors.blueLightOpacity
    }
  }
})

const toLowerCaseWithoutSpaces = (_: string) => {
  return _.toLowerCase().replace(/\s/g, '')
}

const otherDisruptionsDE = toLowerCaseWithoutSpaces(deIProcess.disruptionDialog.genericDisruptionName)
const otherDisruptionsEN = toLowerCaseWithoutSpaces(enIProcess.disruptionDialog.genericDisruptionName)

const TemplateSchema = z
  .object({
    id: z.string().optional(),
    selectedTemplate: TemplateBaseWithTeamInfoSchema.optional(),
    categoryClassification: NonEmptyString,
    reasonClassification: NonEmptyString,
    typeClassification: z.string().optional(),
    description: NonEmptyString,
    cycleStationId: NonEmptyString,
    isTypeRequired: z.boolean(),
    issues: z.array(IssueSchema),
    originatorId: NonEmptyString.optional()
  })
  .superRefine(({ isTypeRequired, typeClassification, issues, description }, context) => {
    const value = toLowerCaseWithoutSpaces(description)
    validateDuplicatedNames(issues, (index) =>
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: DUPLICATED_VALUE,
        path: [`issues.${index}.name`]
      })
    )
    if (isTypeRequired && !typeClassification) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Classification Type is required in this case`,
        path: ['typeClassification']
      })
    }
    if (value === otherDisruptionsEN || value === otherDisruptionsDE) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: otherDisruptionsEN,
        path: ['description']
      })
    }
  })

export type ICreateTemplate = z.infer<typeof TemplateSchema>

const CustomPaperComponent = (props: PaperProps) => {
  const { t } = useTranslation(['iProcess'])

  return (
    <Paper {...props}>
      <Stack style={{ paddingLeft: '16px', paddingTop: '8px' }}>
        <Typography variant='overline'>{t('iProcess:disruptionDialog.popupTitle')}</Typography>
        <ListItem style={{ paddingLeft: '0px', paddingBottom: '0px' }}>
          <Typography variant='subtitle1' style={{ width: '100%' }}>
            {t('iProcess:disruptionReview.disruptionsReportedTableHeaderDescription')}
          </Typography>
          <Typography variant='subtitle1' style={{ marginRight: '4px' }}>
            {t('iProcess:disruptionDialog.originator')}
          </Typography>
        </ListItem>
      </Stack>
      {props.children}
    </Paper>
  )
}

const initialTemplateState: ICreateTemplate = {
  id: undefined,
  categoryClassification: '',
  reasonClassification: '',
  typeClassification: undefined,
  description: '',
  cycleStationId: '',
  originatorId: undefined,
  isTypeRequired: false,
  issues: []
}

interface DisruptionDialogProps {
  onClose: () => void
  open: boolean
  showOriginators?: boolean
  templateBaseData?: TemplateBase & { originatorTeam?: Team }
}

const TemplateDialog = ({ onClose, open, templateBaseData, showOriginators = false }: DisruptionDialogProps) => {
  const { t } = useTranslation(['iProcess', 'admin'])
  const { unitSelected, cycleStationSelected, selectedTeam } = useIProcessState()
  const { teams } = useTeams()
  const { filteredTeams } = usePreviousTeams(teams)

  const { data, fetchNextPage, hasNextPage } = useQueryListTemplatesFiltered<TemplateBaseWithOriginator>({
    reportedByAnyTeam: true,
    reportedByPreviousTeams: true,
    reportedBySelectedPreviousTeams: filteredTeams.map((_) => _.id)
  })
  const listOriginatorTemplates = useAllInfiniteData({ fetchNextPage, hasNextPage, data })
  const { data: issuesData } = useQueryIssues(templateBaseData?.id)
  const { mutate, isPending, isSuccess } = useMutateSingleTemplate()

  useCloseDialog(isSuccess, onClose)

  const methods = useForm<ICreateTemplate>({
    resolver: zodResolver(TemplateSchema),
    defaultValues: initialTemplateState
  })

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    register,
    watch,
    control,
    trigger,
    getValues
  } = methods

  const {
    append,
    fields: issues,
    remove,
    move,
    replace
  } = useFieldArray({
    control,
    name: 'issues'
  })

  const categoryClassification = watch('categoryClassification')
  const reasonClassification = watch('reasonClassification')
  const typeClassification = watch('typeClassification')
  const selectedTemplate = watch('selectedTemplate')
  const description = watch('description')

  const isSelectedTemplate = !!selectedTemplate
  const templatesPreviousTeams =
    useMemo(
      () => listOriginatorTemplates?.filter((_) => _.originatorTeam.index < (selectedTeam?.index ?? 0)),
      [listOriginatorTemplates, selectedTeam?.index]
    ) || []

  const cycleStation = cycleStationSelected?.id ? cycleStationSelected : UNIT_SPECIFIC_CYCLE_STATION

  const descriptionErrorMessage =
    errors.description?.message === otherDisruptionsEN
      ? t('iProcess:disruptionDialog.reservedWord')
      : t('iProcess:disruptionDialog.disruptionDescriptionMissing')

  const title = templateBaseData
    ? t('iProcess:disruptionDialog.editTemplateDialogHeader')
    : t('iProcess:disruptionDialog.templateDialogHeader')

  const onSubmit: SubmitHandler<ICreateTemplate> = (data) => {
    mutate(data)
  }

  const handleAddIssue = () => {
    const nextIndex = issues.length + 1
    append({ id: uuidv4(), name: EMPTY_STRING, index: nextIndex }, { shouldFocus: true })
  }

  const handleMove = (direction: Direction, fromIndex: number) => {
    const toIndex = moveItemTo(direction, issues)
    move(fromIndex, toIndex)
    trigger('issues')
  }

  useEffect(() => {
    if (!open) {
      reset(initialTemplateState)
    } else if (cycleStation?.id) {
      setValue('cycleStationId', showOriginators ? UNIT_SPECIFIC_CYCLE_STATION.id : cycleStation?.id, {
        shouldValidate: true
      })
    }
  }, [cycleStation?.id, open, reset, setValue, showOriginators])

  useEffect(() => {
    const selectedCategory = unitSelected?.classificationPath?.find((item) => item.value === categoryClassification)
    const selectedReason = selectedCategory?.options?.find((item) => item.value === reasonClassification)
    if (selectedReason?.options?.length && selectedReason?.options?.length > 0) {
      setValue('isTypeRequired', true, { shouldValidate: true })
    } else {
      setValue('isTypeRequired', false, { shouldValidate: true })
    }
  }, [categoryClassification, reasonClassification, setValue, unitSelected?.classificationPath])

  useEffect(() => {
    if (open && templateBaseData) {
      reset(
        {
          ...getValues(),
          id: templateBaseData?.id,
          categoryClassification: templateBaseData?.disLocation,
          reasonClassification: templateBaseData?.disLocationSpecification,
          typeClassification: templateBaseData?.disLocationType ?? undefined,
          description: templateBaseData?.description,
          cycleStationId: cycleStation.id,
          issues: issuesData,
          originatorId: showOriginators ? templateBaseData.originatorTeam?.id : undefined
        },
        { keepDefaultValues: true }
      )
    }
  }, [cycleStation.id, getValues, issuesData, open, reset, showOriginators, templateBaseData])

  const suggestedOptions = useCallback(
    (options: TemplateBaseWithOriginator[]) => {
      const value = getValues('description')
      if (!value) return []
      return options.filter((_) => textIsIncluded(_.description, value))
    },
    [getValues]
  )

  const renderOptionLabel = useCallback((option: TemplateBaseWithOriginator | string) => {
    if (typeof option === 'string') {
      return option
    }
    return option.description
  }, [])

  const handleChangeInput: OnInputChange = (_event, value, _reason) => {
    setValue('selectedTemplate', undefined)
    setValue('description', value)
  }

  const handleClickRemove = () => {
    reset({
      ...initialTemplateState,
      cycleStationId: getValues('cycleStationId')
    })
  }

  const handleSelect = (option: TemplateBaseWithOriginator) => {
    reset({
      description: option.description,
      originatorId: option.originatorTeam.id,
      selectedTemplate: option,
      categoryClassification: option.disLocation,
      reasonClassification: option.disLocationSpecification,
      typeClassification: option.disLocationType ?? undefined,
      cycleStationId: showOriginators ? UNIT_SPECIFIC_CYCLE_STATION.id : getValues('cycleStationId'),
      issues: option.issues ?? []
    })
  }

  return (
    <CustomDialog
      onClose={onClose}
      open={open}
      fullWidth={true}
      dialogContentStyle={{ maxWidth: '640px' }}
      title={title}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Stack>
              <Typography variant='subtitle1'>
                {t('iProcess:disruptionReview.disruptionsReportedTableHeaderDescription')}
              </Typography>
              <Grid item xs={12}>
                {showOriginators ? (
                  <InputFormAutocomplete
                    freeSolo
                    options={templatesPreviousTeams}
                    inputValue={description}
                    onInputChange={handleChangeInput}
                    isError={!!errors.description}
                    errorMessage={descriptionErrorMessage}
                    getOptionLabel={renderOptionLabel}
                    filterOptions={suggestedOptions}
                    placeholder={t('iProcess:disruptionDialog.leftDisruptionDescriptionDefault')}
                    OptionChipComponent={(label) => <OptionChip label={label} />}
                    selectedOptionText={selectedTemplate?.originatorTeam.name}
                    openOnFocus={false}
                    id='disruption-description'
                    EndAdornmentComponent={(selectedOptionText, OptionChipComponent, value) => (
                      <Box display='flex' flexDirection='row' alignItems='center'>
                        {!!selectedOptionText && !!OptionChipComponent && OptionChipComponent(selectedOptionText)}
                        {!!value && (
                          <IconButton onClick={handleClickRemove} size='small'>
                            <PlusIcon width='20px' height='20px' style={{ transform: 'rotate(45deg)' }} />
                          </IconButton>
                        )}
                        <img
                          height='24px'
                          src={searchIcon}
                          loading='lazy'
                          style={{ borderLeft: `1px solid ${colors.gray2}`, marginLeft: '4px', paddingLeft: '8px' }}
                        />
                      </Box>
                    )}
                    renderOption={(props, option) => (
                      <ListItem
                        {...props}
                        key={option.id}
                        onClick={() => handleSelect(option)}
                        style={{ paddingLeft: '0px' }}
                      >
                        <Typography
                          {...props}
                          style={{ backgroundColor: 'transparent', width: '100%', height: '100%' }}
                        >
                          {option.description}
                        </Typography>
                        <OptionChip label={option.originatorTeam.name} onClick={() => handleSelect(option)} />
                      </ListItem>
                    )}
                    PaperComponent={(props) => (description ? <CustomPaperComponent {...props} /> : <></>)}
                  />
                ) : (
                  <InputForm
                    errorMessage={descriptionErrorMessage}
                    placeholder={t('iProcess:disruptionDialog.leftDisruptionDescriptionDefault')}
                    id='disruption-description'
                    {...register('description')}
                    error={!!errors.description}
                    style={{ fontSize: '14px', padding: '3px 8px', height: '40px', width: '100%' }}
                    marginTop='0px'
                  />
                )}
              </Grid>
              <DisruptionDialogHeaderInfo
                showCycleStationInfo={!showOriginators}
                xs={{ unit: 4, cycleStation: 4, product: 4 }}
                style={{ margin: '1.5rem 0rem' }}
              />
              <Divider style={{ backgroundColor: colors.gray4, marginBottom: '0.5rem' }} />
              {showOriginators && (
                <Stack style={{ marginBottom: '1rem' }}>
                  <Typography variant='overline'>{t('iProcess:disruptionDialog.originatorTitle')}</Typography>
                  <Typography variant='subtitle1'>{t('iProcess:disruptionDialog.originatorTeam')}</Typography>
                  <Grid item xs={6}>
                    <Controller
                      control={control}
                      name='originatorId'
                      defaultValue=''
                      render={({ field }) => (
                        <CustomSelect
                          {...field}
                          id='input-status'
                          displayEmpty
                          disabled={isSelectedTemplate}
                          renderValue={(value) => {
                            const response = z.string().safeParse(value)
                            if (!response.success || !response.data) {
                              return (
                                <Typography variant='body1' color={colors.gray2}>
                                  {t('iProcess:disruptionDialog.originatorTeamPlaceholder')}
                                </Typography>
                              )
                            }
                            return (
                              <Typography variant='body1'>
                                {filteredTeams?.find((_) => _.id === response.data)?.name}
                              </Typography>
                            )
                          }}
                          error={!!errors.originatorId}
                          IconComponent={StyledKeyboardArrowDownIcon}
                          style={{ height: '41px' }}
                        >
                          {filteredTeams?.map((team) => {
                            return (
                              <MenuItemStyled key={team.id} value={team.id}>
                                <Grid alignItems='center' display='flex'>
                                  <Typography variant='body1'>{team.name}</Typography>
                                </Grid>
                              </MenuItemStyled>
                            )
                          })}
                        </CustomSelect>
                      )}
                    />
                  </Grid>
                  {!!errors.originatorId && (
                    <Typography variant='subtitle2'>{t('iProcess:disruptionDialog.completeEntryError')}</Typography>
                  )}
                </Stack>
              )}
              {isSelectedTemplate ? (
                <Grid item xs={12} style={{ marginBottom: '1rem' }}>
                  <Typography variant='h5'>{t('iProcess:disruptionDialog.classification')}</Typography>
                  <Chip doneIcon label={categoryClassification} selected={true} iconPosition='right' />
                  <Chip doneIcon label={reasonClassification} selected={true} iconPosition='right' />
                  {!!typeClassification && (
                    <Chip doneIcon label={typeClassification} selected={true} iconPosition='right' />
                  )}
                </Grid>
              ) : (
                <>
                  <DisruptionClassificationChips options={unitSelected?.classificationPath} />
                  {(!!errors.categoryClassification ||
                    !!errors.reasonClassification ||
                    !!errors.typeClassification) && (
                    <Typography variant='subtitle2' style={{ marginBottom: '1rem' }}>
                      {t('iProcess:disruptionDialog.completeEntryError')}
                    </Typography>
                  )}
                </>
              )}
              <Stack>
                <Divider style={{ backgroundColor: colors.gray4, marginBottom: '0.5rem' }} />
                <Typography variant='overline'>{t('iProcess:disruptionDialog.issueSpecification')}</Typography>
                <DragAndDrop>
                  {(dragConstraints) => (
                    <Stack>
                      {issues.length > 0 && (
                        <Typography variant='subtitle1' style={{ paddingLeft: '40px' }}>
                          {t('iProcess:disruptionDialog.name')}
                        </Typography>
                      )}
                      <DragAndDrop.Group axis='y' values={getValues('issues')} onReorder={replace}>
                        {getValues('issues').map((issues, index) => (
                          <DragAndDrop.Item key={issues.id} item={issues} dragConstraints={dragConstraints}>
                            {(dragControls, boxShadow, iRef) => (
                              <>
                                <DraggableInputForm
                                  iconRef={iRef}
                                  disabled={isSelectedTemplate}
                                  moveTopText={t('admin:unitsSection.moveUp')}
                                  moveBottomText={t('admin:unitsSection.moveDown')}
                                  dragControls={dragControls}
                                  index={index}
                                  onDelete={remove}
                                  {...register(`issues.${index}.name`)}
                                  onClickMove={handleMove}
                                  error={!!errors?.issues?.[index]?.name}
                                  placeholder={t('iProcess:disruptionDialog.issuePlaceHolder')}
                                  id={`template-issue-${index}`}
                                  boxShadow={boxShadow}
                                  containerStyle={{ marginBottom: '0.5rem' }}
                                />
                                {!!errors?.issues?.[index]?.name && (
                                  <Typography
                                    variant='caption'
                                    style={{ color: colors.redError, fontSize: 12 }}
                                    id={`issues-${index}-name-errorMessage`}
                                  >
                                    {errors?.issues?.[index]?.name?.message === DUPLICATED_VALUE
                                      ? t('admin:unitsSection.duplicatedValue')
                                      : t('iProcess:disruptionDialog.emptyIssueSpecification')}
                                  </Typography>
                                )}
                              </>
                            )}
                          </DragAndDrop.Item>
                        ))}
                      </DragAndDrop.Group>
                    </Stack>
                  )}
                </DragAndDrop>
                <Grid item xs={12} style={{ paddingLeft: 2 }}>
                  <AddButton
                    id='add-issue'
                    onClick={handleAddIssue}
                    disabled={isSelectedTemplate}
                    text={t('iProcess:disruptionDialog.issueSpecificationButton')}
                  />
                </Grid>
              </Stack>
            </Stack>
            <GroupUILayout>
              <GroupUIDiscardButton id='discard-button-disruption-useTemplate' variant='secondary' onClick={onClose}>
                {t('iProcess:buttons.discard')}
              </GroupUIDiscardButton>
              <GroupUISubmitButton
                id='disruption-template-dialog-submit'
                icon={!isPending ? 'save-24' : 'icon-empty-24'}
                isLoading={isPending}
              >
                {templateBaseData
                  ? t('iProcess:buttons.save')
                  : isSelectedTemplate
                  ? t('iProcess:disruptionDialog.subscribeButton')
                  : t('iProcess:buttons.save')}
              </GroupUISubmitButton>
            </GroupUILayout>
          </Stack>
        </form>
      </FormProvider>
    </CustomDialog>
  )
}

export default memo(TemplateDialog)
