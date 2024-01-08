import { memo, useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { Grid, Stack, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { ROUTER } from 'routes/routing'
import { z } from 'zod'
import { UnitBasicInfoSchema } from 'zodSchemas'
import { Shift, Type } from 'API'
import ArrowIcon from 'components/Icons/ArrowIcon'
import { FormContainer } from 'components/Sections/SectionContainer'
import { EMPTY_STRING } from 'helper/constants'
import { getTypeOccurrenceFromSchedule } from 'helper/getTypeOccurrenceFromSchedule'
import { calculateTimeDifference } from 'helper/time'
import useMutateShiftModel from 'hooks/services/useMutateShiftModel'
import { fetchShiftModelList } from 'hooks/services/useQueryListShiftModels'
import useQueryListUnits from 'hooks/services/useQueryListUnits'
import { useQueryShiftModelById } from 'hooks/services/useQueryShiftModelById'
import InputForm from 'lib/form/InputForm'
import ScheduleHoursForm from 'lib/form/ScheduleHoursForm'
import SelectForm from 'lib/form/SelectForm'
import SwitchToggle from 'lib/form/SwitchToggle'
import UnitList from 'lib/form/UnitList'
import { GroupUIDiscardButton, GroupUISubmitButton } from 'lib/ui/Buttons'
import { colors } from 'theme'
import { selectorSelectUnits } from '../../../routes/admin/selector-ids'

const maxShiftItems = 9
const minProductionItems = 4

const ScheduleHourSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(Type),
  hoursStart: z.string().min(1, 'EmptyStartOrEnd'),
  hoursEnd: z.string().min(1, 'EmptyStartOrEnd'),
  hoursStartUTC: z.string().optional(),
  hoursEndUTC: z.string().optional(),
  i: z.number().nullish(),
  shiftType: z.nativeEnum(Shift),
  timeZone: z.string(),
  downtime: z.string().optional()
})

export type IScheduleHour = z.infer<typeof ScheduleHourSchema>

const scheduleHourValidation = (
  scheduleHours: IScheduleHour[],
  firstStartTime?: string
): [boolean, number | undefined] => {
  let index: number | undefined
  let isNegativeTime = false
  for (const itemIndex in scheduleHours) {
    const { hasNegativeTime } = calculateTimeDifference({
      scheduleHour: scheduleHours[itemIndex],
      timeReference: firstStartTime
    })
    isNegativeTime = hasNegativeTime
    if (hasNegativeTime) {
      index = Number.parseInt(itemIndex)
      break
    }
    continue
  }

  return [isNegativeTime, index]
}

const scheduleHourShiftValidation = (scheduleHours: IScheduleHour[], context: z.RefinementCtx) => {
  const count = getTypeOccurrenceFromSchedule(scheduleHours, Type.Production)
  if (count < minProductionItems && scheduleHours[0]?.type !== Type.Inactive) {
    context.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: minProductionItems,
      type: 'array',
      inclusive: true,
      message: `Please add a minimum of ${minProductionItems} production time slots or 1 inactive time slot per shift`,
      path: ['[0].type']
    })
  }
}

const ShiftModelSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1),
    isActive: z.boolean(),
    selectedUnits: z.array(UnitBasicInfoSchema).min(1),
    timeZone: z.string().nullish(),
    createdAt: z.string().nullish(),
    updatedAt: z.string().nullish(),
    morningShift: z.array(ScheduleHourSchema).superRefine(scheduleHourShiftValidation),
    afternoonShift: z.array(ScheduleHourSchema).superRefine(scheduleHourShiftValidation),
    nightShift: z.array(ScheduleHourSchema).superRefine(scheduleHourShiftValidation)
  })
  .superRefine(({ morningShift, afternoonShift, nightShift }, context) => {
    const firstMorningStartTime = morningShift?.[0]?.hoursStart
    const lastNightShiftIndex = nightShift?.length - 1
    const lastNightHoursEnd = nightShift?.[lastNightShiftIndex]?.hoursEnd
    const [shouldValidateMorningShift, morningShiftIndex] = scheduleHourValidation(morningShift, firstMorningStartTime)
    const [shouldValidateAfternoonShift, afternoonShiftIndex] = scheduleHourValidation(
      afternoonShift,
      firstMorningStartTime
    )
    const [shouldValidateNightShift, nightShiftIndex] = scheduleHourValidation(nightShift, firstMorningStartTime)

    if (lastNightHoursEnd !== firstMorningStartTime) {
      context.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: 'startEndTimeValidation',
        path: [`nightShift.${lastNightShiftIndex}.hoursEnd`]
      })
    }
    if (shouldValidateMorningShift) {
      context.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: 'timeDifferenceValidation',
        path: [`morningShift.${morningShiftIndex}.hoursEnd`]
      })
    }
    if (shouldValidateAfternoonShift) {
      context.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: 'timeDifferenceValidation',
        path: [`afternoonShift.${afternoonShiftIndex}.hoursEnd`]
      })
    }
    if (shouldValidateNightShift) {
      context.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: 'timeDifferenceValidation',
        path: [`nightShift.${nightShiftIndex}.hoursEnd`]
      })
    }
  })

export type IShiftModel = z.infer<typeof ShiftModelSchema>

const initialShiftModelState: IShiftModel = {
  name: '',
  selectedUnits: [],
  morningShift: [],
  afternoonShift: [],
  nightShift: [],
  isActive: true,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
}

const ShiftModelForm = () => {
  const { shiftModelId } = useParams()
  const navigate = useNavigate()
  const { isPending, mutate } = useMutateShiftModel({ operation: 'put', id: shiftModelId })
  const { data: selectedShiftModel } = useQueryShiftModelById(shiftModelId)
  const { data: listUnits } = useQueryListUnits()
  const { t } = useTranslation('admin')
  const queryClient = useQueryClient()

  const methods = useForm<IShiftModel>({
    resolver: zodResolver(ShiftModelSchema),
    defaultValues: selectedShiftModel ?? initialShiftModelState
  })

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
    register
  } = methods

  const firstStartTimeMorning = watch('morningShift.0.hoursStart')
  const selectedUnits = watch('selectedUnits')

  const onSubmit: SubmitHandler<IShiftModel> = (data) => {
    mutate(data)
  }

  useEffect(() => {
    console.debug(errors)
  }, [errors])

  useEffect(() => {
    if (selectedShiftModel) {
      reset(selectedShiftModel)
    }
  }, [selectedShiftModel, reset])

  return (
    <FormContainer>
      <FormProvider {...methods}>
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
          <Grid container style={{ display: 'flex', alignItems: 'center' }}>
            <Link
              to={ROUTER.ADMIN_SHIFT_MODEL_PATH}
              onMouseOver={() =>
                queryClient.prefetchQuery({
                  queryKey: ['ListShiftModels'],
                  queryFn: fetchShiftModelList
                })
              }
              style={{
                color: colors.gray2
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <ArrowIcon
                  fill={colors.gray2}
                  width={'1rem'}
                  height={'1rem'}
                  style={{ transform: 'rotate(90deg)', marginLeft: -5 }}
                />
                <Typography variant='body1' style={{ color: colors.gray2 }}>
                  {t('shiftModelsSection.backToShiftModels')}
                </Typography>
              </div>
            </Link>
          </Grid>
          <Grid container style={{ marginTop: '1rem' }}>
            {selectedShiftModel ? (
              <Typography variant='h1'>{t('shiftModelsSection.dialogTitleEditShiftModel')}</Typography>
            ) : (
              <Typography variant='h1'>{t('shiftModelsSection.dialogTitleShiftModel')}</Typography>
            )}
          </Grid>
          {selectedShiftModel?.createdAt ? (
            <Grid container style={{ marginTop: '8px' }}>
              <Typography variant='caption'>
                {t('shiftModelsSection.createdOn', {
                  createdAt: new Date(selectedShiftModel?.createdAt).toLocaleDateString('de-DE', {
                    dateStyle: 'short'
                  }),
                  updatedAt: new Date(selectedShiftModel?.updatedAt || '').toLocaleDateString('de-DE', {
                    dateStyle: 'short'
                  })
                })}
              </Typography>
            </Grid>
          ) : undefined}
          <Grid container alignItems='center' style={{ marginTop: '8px' }}>
            <Grid item sm={6} xs={12}>
              <SwitchToggle
                id='shift-active-toggle'
                checked={watch('isActive')}
                text={t('shiftModelsSection.activeShiftModel')}
                {...register('isActive')}
              />
            </Grid>
            <Grid
              item
              gap={2}
              sm={6}
              xs={12}
              style={{
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center'
              }}
            >
              <GroupUIDiscardButton
                id='shiftModel-usetemplate-form-discard'
                onClick={() => navigate(ROUTER.ADMIN_SHIFT_MODEL_PATH)}
              >
                {t('buttons.discard')}
              </GroupUIDiscardButton>
              <GroupUISubmitButton
                id='shiftModel-usetemplate-dialog-submit'
                icon={!isPending ? 'save-24' : 'icon-empty-24'}
                size='m'
                isLoading={isPending}
              >
                {t('buttons.save')}
              </GroupUISubmitButton>
            </Grid>
          </Grid>
          <Stack justifyContent='space-between' style={{ height: '100%', padding: 0 }}>
            <Stack>
              <Grid container item>
                <Grid item xs={12}>
                  <Typography variant='subtitle1' style={{ marginTop: '1rem' }}>
                    {t('shiftModelsSection.shiftModelName')}
                  </Typography>
                  <InputForm
                    style={{ width: '100%' }}
                    type='text'
                    error={!!errors?.name}
                    errorMessage={t('shiftModelsSection.genericFillInputMessage')}
                    placeholder={t('shiftModelsSection.shiftModelNamePlaceHolder')}
                    id='input-shiftModel-name'
                    marginTop='0px'
                    {...register('name')}
                  />
                </Grid>
                <Grid container>
                  <Typography variant='subtitle1' style={{ marginTop: '1rem' }}>
                    {t('shiftModelsSection.selectUnitsShiftModel')}
                  </Typography>
                  <SelectForm
                    id={`${selectorSelectUnits}`}
                    name='selectedUnits'
                    error={!!errors?.selectedUnits}
                    errorMessage={t('shiftModelsSection.selectUnitErrorMessage')}
                    value={selectedUnits?.map((_) => _.shortName ?? EMPTY_STRING) ?? []}
                    placeholder={t('shiftModelsSection.unitSelectorPlaceholder')}
                  >
                    <UnitList
                      name='selectedUnits'
                      data={listUnits?.items ?? []}
                      onClickItem={(_, values) => setValue('selectedUnits', values, { shouldValidate: true })}
                      values={selectedUnits}
                      getValue={(_) => _}
                    />
                  </SelectForm>
                </Grid>
              </Grid>
              <Stack style={{ marginTop: '2rem' }}>
                {/* Morning Shift */}
                <ScheduleHoursForm
                  errorMessage={t('shiftModelsSection.emptyFieldValidation')}
                  maxShiftItems={maxShiftItems}
                  minProductionItems={minProductionItems}
                  name={Shift.morningShift}
                  nextShiftItems={watch('afternoonShift')}
                  title={t('shiftModelsSection.morningShift')}
                  timeReference={firstStartTimeMorning}
                />
                {/* Afternoon Shift */}
                <ScheduleHoursForm
                  errorMessage={t('shiftModelsSection.emptyFieldValidation')}
                  maxShiftItems={maxShiftItems}
                  minProductionItems={minProductionItems}
                  name={Shift.afternoonShift}
                  previousShiftItems={watch('morningShift')}
                  nextShiftItems={watch('nightShift')}
                  title={t('shiftModelsSection.afternoonShift')}
                  timeReference={firstStartTimeMorning}
                />
                {/* Night Shift */}
                <ScheduleHoursForm
                  errorMessage={t('shiftModelsSection.emptyFieldValidation')}
                  maxShiftItems={maxShiftItems}
                  minProductionItems={minProductionItems}
                  name={Shift.nightShift}
                  previousShiftItems={watch('afternoonShift')}
                  title={t('shiftModelsSection.nightShift')}
                  timeReference={firstStartTimeMorning}
                />
              </Stack>
            </Stack>
          </Stack>
        </form>
      </FormProvider>
    </FormContainer>
  )
}

export default memo(ShiftModelForm)
