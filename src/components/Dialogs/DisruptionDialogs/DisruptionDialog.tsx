import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Grid, IconButton, ListItem, Paper, Stack, Typography } from '@mui/material'
import moment from 'moment-timezone'
import { isNumber } from 'remeda'
import { Disruption, isAssemblyLine } from 'types'
import { z } from 'zod'
import { DisruptionDialogSchema } from 'zodSchemas'
import { AttachmentInput } from 'API'
import MultiCheckboxDropdown from 'components/Dropdowns/MultiCheckboxDropdown'
import UploadFiles from 'components/Files/UploadFiles'
import ClockLines from 'components/Icons/ClockLines'
import PlusIcon from 'components/Icons/PlusIcon'
import searchIcon from 'components/Icons/search-32.svg'
import { DialogDivider } from 'components/styled'
import { useIProcessState } from 'contexts/iProcessContext'
import { defaultMaxRange, defaultMinRange, isBetweenRange } from 'helper/actualCount'
import { REMOVE_VALUE } from 'helper/constants'
import { getSelectedTabStartTime, localDateTimeFormatTimePicker } from 'helper/time'
import { getCurrentConfigs, textIsIncluded } from 'helper/utils'
import useMutateDisruptionCount from 'hooks/services/useMutateDisruptionCount'
import useMutateFile from 'hooks/services/useMutateFile'
import useQueryIssues from 'hooks/services/useQueryIssues'
import useQueryUniqueMeasures from 'hooks/services/useQueryUniqueMeasures'
import useCloseDialog from 'hooks/useCloseDialog'
import useFormFile from 'hooks/useFormFile'
import useNow from 'hooks/useNow'
import Counter from 'lib/form/Counter'
import DisruptionClassificationChips from 'lib/form/DisruptionClassificationChips'
import Duration from 'lib/form/Duration'
import InputForm from 'lib/form/InputForm'
import InputFormAutocomplete from 'lib/form/InputFormAutocomplete'
import SwitchToggle from 'lib/form/SwitchToggle'
import TimePicker from 'lib/form/TimePicker'
import { GroupUIDiscardButton, GroupUILayout, GroupUISubmitButton } from 'lib/ui/Buttons'
import { UNIT_SPECIFIC_CYCLE_STATION } from 'shared'
import { colors } from 'theme'
import CustomDialog from '../CustomDialog'
import DisruptionDialogHeaderInfo from './DisruptionDialogHeaderInfo'
import { calculateDurationOfDisruption, parseDisruption, validateNumber } from './utils'

export type IDisruptionFormState = z.infer<typeof DisruptionDialogSchema>

const now = moment(new Date()).format(localDateTimeFormatTimePicker)

const initialState: IDisruptionFormState = {
  id: undefined,
  teamId: undefined,
  templateId: '',
  cycleStationId: '',
  startDateTime: now,
  duration: '00:00:00',
  durationInMinutes: 0,
  categoryClassification: '',
  reasonClassification: '',
  lostVehicles: 0,
  typeClassification: undefined,
  measures: '',
  description: '',
  m100: undefined,
  issues: [],
  attachments: [],
  deletedFiles: [],
  isSolved: true
}

const validateFiles = (files: File[], acceptedFileType: string) => {
  const [fileType] = acceptedFileType.split('/')
  return !!fileType && files.every((_) => _.type.includes(fileType))
}

interface DisruptionDialogProps {
  onClose: () => void
  open: boolean
  disruption: Disruption | undefined
  isUpdatingDisruption: boolean
}

// TODO: Rename to CreateDisruptionDialog
const DisruptionDialog = ({ onClose, open, disruption, isUpdatingDisruption }: DisruptionDialogProps) => {
  const { t } = useTranslation(['iProcess', 'measures', 'tables'])

  const now = useNow([open])
  const { data } = useQueryUniqueMeasures()
  const INPUT_FIELD_WIDTH = '344px'
  const firstUpdate = useRef(true)
  const {
    unitSelected,
    productSelected: partSelected,
    cycleStationSelected,
    currentShiftScheduleSlots,
    selectedShiftTab,
    currentShiftTab,
    configurationByUnitId,
    selectedTeam
  } = useIProcessState()

  const reporterTeam = isUpdatingDisruption ? disruption?.team : selectedTeam
  const cycleStation = cycleStationSelected?.id ? cycleStationSelected : UNIT_SPECIFIC_CYCLE_STATION

  const configurations = getCurrentConfigs(configurationByUnitId, unitSelected?.id)
  const timeSlotStartTime = getSelectedTabStartTime({ currentShiftScheduleSlots, selectedShiftTab, currentShiftTab })
  const isGenericTemplate = disruption?.description === t('iProcess:disruptionDialog.genericDisruptionName')
  const description = disruption?.description && !isGenericTemplate ? disruption?.description : ''

  const id = disruption?.templateId || disruption?.id
  const { data: issues } = useQueryIssues(id)
  const { mutate, isPending, isSuccess } = useMutateDisruptionCount({
    isUpdatingDisruption
  })
  const { mutate: deleteFile } = useMutateFile()

  useCloseDialog(isSuccess, onClose)

  const methods = useForm<IDisruptionFormState>({
    resolver: zodResolver(
      DisruptionDialogSchema.refine(
        ({ m100 }) =>
          isNumber(m100) ? isBetweenRange(m100, unitSelected?.m100Range?.min, unitSelected?.m100Range?.max) : true,
        { message: 'm100 is not between range', path: ['m100'] }
      )
    ),
    defaultValues: isUpdatingDisruption
      ? parseDisruption(disruption ? { ...disruption, team: reporterTeam } : undefined)
      : {
          ...initialState,
          description,
          templateId: disruption?.id,
          teamId: reporterTeam?.id,
          cycleStationId: disruption?.cycleStationId ?? cycleStation?.id,
          startDateTime: timeSlotStartTime || now,
          categoryClassification: disruption?.disLocation || '',
          reasonClassification: disruption?.disLocationSpecification || '',
          typeClassification: disruption?.disLocationType || undefined,
          isSolved: disruption?.isSolved || true
        }
  })

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    register,
    watch,
    reset,
    control,
    setError,
    getValues,
    trigger
  } = methods

  // ! TODO: remove watch since this triggers a lot of re-renders
  const category = watch('categoryClassification')
  const cause = watch('reasonClassification')
  const type = watch('typeClassification')
  const disruptionDescription = watch('description')
  const lostVehicles = watch('lostVehicles')
  const startDateTime = watch('startDateTime')

  const classifications = useMemo(
    () => (isGenericTemplate ? undefined : { category, cause, type }),
    [isGenericTemplate, category, cause, type]
  )

  const { append, attachments, deletedFiles, remove, replace } = useFormFile<IDisruptionFormState>({
    control,
    attachmentName: 'attachments',
    deletedFilesName: 'deletedFiles'
  })

  const handleUploadFiles = useCallback(
    (attachments: AttachmentInput[]) => {
      replace(attachments)
      trigger('attachments')
    },
    [replace, trigger]
  )

  const handleDeleteFiles = useCallback(() => {
    for (const attachment of getValues('deletedFiles')) {
      // this deletes the file from the S3 bucket once we press the save button
      deleteFile(attachment.key)
    }
  }, [deleteFile, getValues])

  const onSubmit: SubmitHandler<IDisruptionFormState> = (data) => {
    mutate(data)
    handleDeleteFiles()
  }

  const handleClose = () => {
    onClose()
    // Optimistically deletes the files and assume that everything went well deleting them
    handleDeleteFiles()
  }

  const suggestedOptions = useCallback(
    (options: string[]) => {
      const value = getValues('measures')
      if (!value) return []
      return options.filter((_) => textIsIncluded(_, value))
    },
    [getValues]
  )

  useEffect(() => {
    let mounted = true

    if (mounted && open) {
      const duration = calculateDurationOfDisruption({
        lostVehicles,
        unitSelected,
        configurations,
        startDateTime,
        partSelected,
        currentShiftScheduleSlots
      })
      if (isUpdatingDisruption && firstUpdate.current) {
        firstUpdate.current = false
      } else {
        setValue('duration', duration, { shouldValidate: true })
      }
    }
    firstUpdate.current = true
    return () => {
      mounted = false
    }
  }, [
    configurations,
    currentShiftScheduleSlots,
    getValues,
    isUpdatingDisruption,
    lostVehicles,
    open,
    partSelected,
    setValue,
    startDateTime,
    unitSelected
  ])

  /**
   * Set initial state when opened and mounted
   */
  useEffect(() => {
    let mounted = true
    if (open && mounted && isUpdatingDisruption) {
      const parsedDisruption = parseDisruption(disruption)
      if (parsedDisruption) {
        reset(parsedDisruption)
      }
    }
    return () => {
      mounted = false
    }
  }, [disruption, isUpdatingDisruption, open, reset])

  useEffect(() => {
    if (disruption?.originatorTeam?.id && reporterTeam?.id) {
      setValue('originatorId', disruption.originatorTeam.id)
    }
  }, [disruption?.originatorTeam?.id, reporterTeam?.id, setValue])

  return (
    <FormProvider {...methods}>
      <CustomDialog
        onClose={handleClose}
        open={open}
        maxWidth={false}
        title={isGenericTemplate ? t('iProcess:disruptionDialog.leftHeaderDisruption') : disruptionDescription}
        header={isUpdatingDisruption ? t('iProcess:disruptionDialog.editDisruptionDialogHeader') : undefined}
        dialogContentStyle={{ width: '790px', overflow: 'clip' }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container>
            <Stack style={{ flex: 1 }}>
              <Typography variant='subtitle1'>
                {t('iProcess:disruptionReview.disruptionsReportedTableHeaderDescription')}
              </Typography>
              {isGenericTemplate && (
                <InputForm
                  errorMessage={t('iProcess:disruptionDialog.disruptionDescriptionMissing')}
                  placeholder={t('iProcess:disruptionDialog.leftDisruptionDescriptionDefault')}
                  id='disruption-description'
                  {...register('description')}
                  error={!!errors.description}
                  style={{ fontSize: '14px', padding: '3px 1rem', marginBottom: '1rem', height: '40px', width: '100%' }}
                  defaultValue={isUpdatingDisruption ? disruption.description : undefined}
                  marginBottom='1rem'
                  marginTop='0px'
                />
              )}
              <DisruptionDialogHeaderInfo
                disruption={disruption}
                reporterTeam={reporterTeam}
                showCycleStationInfo={!disruption?.originatorTeam?.id}
                showTeamsInfo={!!disruption?.originatorTeam && !!reporterTeam?.name}
                classifications={classifications}
                xs={{ unit: 2, cycleStation: 3, product: 3, classifications: 4, teams: 2 }}
              />
              <DialogDivider variant='middle' />
              <Grid item xs={12}>
                <Typography variant='h4'>{t('iProcess:disruptionDialog.leftTimeStampHeader')}</Typography>
              </Grid>
              <Grid item xs={12} style={{ marginTop: '0.5rem' }}>
                <Typography variant='h3'>{t('iProcess:disruptionDialog.startTime')}</Typography>
                <TimePicker
                  isError={!!errors.startDateTime}
                  errorMessage={t('iProcess:disruptionDialog.disruptionStartDateTime')}
                  {...register('startDateTime')}
                />
              </Grid>
              <Grid item xs={12} style={{ paddingTop: '2rem' }}>
                <Typography variant='h4'>{t('iProcess:disruptionDialog.disruptionCounterTitle')}</Typography>
                <Grid container display='flex' spacing={2} style={{ paddingTop: '1rem' }}>
                  <Grid item>
                    <Counter
                      {...register('lostVehicles', {
                        valueAsNumber: true,
                        setValueAs: (value) => validateNumber(value)
                      })}
                      firstUpdate={firstUpdate}
                      formStateField='lostVehicles'
                      errorMessage={t('iProcess:nioDialog.nioCounterMissing')}
                      isError={!!errors.lostVehicles}
                      defaultValue={lostVehicles}
                      inputId='disruption-lost-vehicles'
                    />
                  </Grid>
                  <Grid item display='flex' alignItems='center' width='350px'>
                    {!!lostVehicles && (
                      <>
                        <ClockLines />
                        <Typography
                          style={{ display: 'flex', alignItems: 'center', marginLeft: '6px' }}
                          id='disruption-calculated-duration'
                        >
                          {t('iProcess:disruptionDialog.calculatedDisruption')}
                          {calculateDurationOfDisruption({
                            lostVehicles,
                            unitSelected,
                            configurations,
                            startDateTime,
                            partSelected,
                            currentShiftScheduleSlots
                          })}
                        </Typography>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} style={{ paddingTop: '2rem' }}>
                <Typography variant='h4'>{t('iProcess:disruptionDialog.leftDurationHeader')}</Typography>
                <Duration />
              </Grid>
              {isGenericTemplate && (
                <Stack style={{ marginTop: '1rem' }}>
                  <DisruptionClassificationChips options={unitSelected?.classificationPath} />
                  {!!errors.categoryClassification || !!errors.reasonClassification || !!errors.typeClassification ? (
                    <Typography variant='subtitle2' style={{ padding: '12px' }}>
                      {t('iProcess:disruptionDialog.completeEntryError')}
                    </Typography>
                  ) : undefined}
                </Stack>
              )}
              <DialogDivider variant='middle' style={{ marginBottom: '2rem', marginTop: '2rem' }} />
              <Grid item xs={12}>
                <Typography variant='h4'>{t('iProcess:disruptionDialog.rightMeasuresHeader')}</Typography>
                <Grid item xs={4.5} style={{ marginTop: '0.5rem' }}>
                  <Controller
                    name='measures'
                    defaultValue={watch('measures')}
                    control={control}
                    render={({ field: { name, value, onChange }, formState: { errors } }) => (
                      <InputFormAutocomplete
                        freeSolo
                        id='disruption-measure-text-input'
                        options={data}
                        name={name}
                        onInputChange={onChange}
                        inputValue={value}
                        maxLength={140}
                        filterOptions={suggestedOptions}
                        openOnFocus={false}
                        isError={!!errors.measures}
                        style={{ width: '344px' }}
                        errorMessage={t('iProcess:disruptionDialog.disruptionMeasureMissing')}
                        placeholder={t('iProcess:disruptionDialog.rightMeasuresDefault')}
                        EndAdornmentComponent={(_, _f, value) => (
                          <Box display='flex' flexDirection='row' alignItems='center'>
                            {!!value && (
                              <IconButton onClick={() => setValue('measures', '')} size='small'>
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
                        renderOption={(props, measure) => (
                          <ListItem
                            {...props}
                            key={measure}
                            onClick={() => setValue('measures', measure)}
                            style={{ paddingLeft: '0px' }}
                          >
                            <Typography
                              {...props}
                              style={{ backgroundColor: 'transparent', width: '100%', height: '100%' }}
                            >
                              {measure}
                            </Typography>
                          </ListItem>
                        )}
                        PaperComponent={Paper}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              {issues.length > 0 && (
                <Grid item xs={12} style={{ paddingTop: '2rem' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <Typography variant='h4'>{t('iProcess:disruptionDialog.issueSpecifications')}</Typography>
                  </div>
                  <Grid item xs={4.5}>
                    <MultiCheckboxDropdown
                      id='issue-specifications'
                      title={t('iProcess:disruptionDialog.issueSpecification')}
                      titleVariant={'subtitle1'}
                      placeholder={t('iProcess:disruptionDialog.issueSpecificationsPlaceholder')}
                      options={issues}
                      style={{ width: INPUT_FIELD_WIDTH }}
                    />
                  </Grid>
                </Grid>
              )}
              {isAssemblyLine(unitSelected) && (
                <Grid item xs={12} style={{ paddingTop: '2rem' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <Typography variant='h4'>{t('iProcess:disruptionDialog.m100Title')}</Typography>
                  </div>
                  <Grid item xs={4.5}>
                    <InputForm
                      type='number'
                      title={t('iProcess:disruptionDialog.m100Number')}
                      titleVariant={'subtitle1'}
                      errorMessage={t('iProcess:quantitiesCard.rangeError', {
                        min: unitSelected?.m100Range?.min || defaultMinRange,
                        max: unitSelected?.m100Range?.max || defaultMaxRange
                      })}
                      placeholder={t('iProcess:disruptionDialog.m100Placeholder')}
                      id='disruption-m100'
                      {...register('m100', {
                        setValueAs: (value: string | undefined) => (value ? Number.parseInt(value) : REMOVE_VALUE)
                      })}
                      defaultValue={disruption?.m100}
                      marginTop='0px'
                      error={!!errors.m100}
                      style={{ fontSize: '14px', width: INPUT_FIELD_WIDTH }}
                    />
                  </Grid>
                </Grid>
              )}
              <Grid item xs={12} style={{ marginTop: '2rem' }}>
                <Typography variant='h4'>{t('iProcess:disruptionDialog.addPhotos')}</Typography>
                <Grid item xs={12}>
                  <Typography variant='subtitle1' style={{ fontWeight: 'bold', marginTop: '8px', marginBottom: '4px' }}>
                    {t('measures:disruptionDetails.attachments')}
                  </Typography>

                  <UploadFiles
                    description={getValues('description')}
                    onUploadFile={handleUploadFiles}
                    onRestoreFile={remove}
                    name='attachments'
                    attachments={attachments}
                    onDeleteFile={append}
                    deletedFiles={deletedFiles}
                    onError={(error) => {
                      setError('attachments', { message: t(`measures:disruptionDetails.${error}`) })
                    }}
                    acceptedFileType='image/*'
                    validateAcceptedFileType={validateFiles}
                  />

                  {!!errors.attachments && (
                    <Typography variant='subtitle2' style={{ padding: '12px' }}>
                      {errors.attachments.message}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} style={{ marginTop: '2rem' }}>
                <Typography variant='h4' style={{ marginBottom: '8px' }}>
                  {t('tables:status')}
                </Typography>
                <Controller
                  name='isSolved'
                  control={control}
                  defaultValue={true}
                  render={({ field: { name, onChange, value, ref } }) => (
                    <SwitchToggle
                      name={name}
                      onChange={onChange}
                      ref={ref}
                      checked={value}
                      text={value ? t('iProcess:disruptionDialog.solved') : t('iProcess:disruptionDialog.notSolved')}
                    />
                  )}
                />
              </Grid>
            </Stack>
            <GroupUILayout>
              <GroupUIDiscardButton
                id='discard-button-disruption-useTemplate'
                variant='secondary'
                onClick={handleClose}
              >
                {t('iProcess:buttons.discard')}
              </GroupUIDiscardButton>
              <GroupUISubmitButton
                id='disruption-usetemplate-dialog-submit'
                icon='save-24'
                size='m'
                isLoading={isPending}
              >
                {t('iProcess:buttons.save')}
              </GroupUISubmitButton>
            </GroupUILayout>
          </Grid>
        </form>
      </CustomDialog>
    </FormProvider>
  )
}

export default memo(DisruptionDialog)
