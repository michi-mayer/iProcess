import { ChangeEvent, Fragment, memo } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Divider,
  Grid,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  styled,
  TextField as TimePicker,
  Typography
} from '@mui/material'
import deAdmin from 'i18n/de/admin.json'
import { v4 as uuid } from 'uuid'
import { Shift, Type } from 'API'
import { IScheduleHour, IShiftModel } from 'components/Dialogs/Admin/ShiftModelForm'
import AddIcon from 'components/Icons/AddIcon'
import ErrorIcon from 'components/Icons/ErrorIcon'
import { getTypeOccurrenceFromSchedule } from 'helper/getTypeOccurrenceFromSchedule'
import { calculateTimeDifference } from 'helper/time'
import { colors } from 'theme'
import ShiftModelDropDown from './ShiftModelDropDown'

const Timeline = styled('div')({
  width: '3rem',
  border: `1px solid ${colors.gray3}`
})

type AdminShiftModelTranslationKey = keyof typeof deAdmin.shiftModelsSection

const inputProps = {
  step: 300, // 5 min
  style: {
    fontSize: 16
  }
}

const isDisabled = (scheduleHours: IScheduleHour[]) => {
  const lastItem = scheduleHours[scheduleHours.length - 1]
  if (lastItem?.type === Type.ShiftChange || lastItem?.type === Type.Inactive) {
    return true
  }
  if (scheduleHours.length > 0) {
    for (const item of scheduleHours) {
      if (!item?.hoursEnd || !item?.hoursStart) {
        return true
      }
    }
  }
  return false
}

interface ScheduleHoursFormProps {
  title: string
  name: Shift
  previousShiftItems?: IScheduleHour[]
  nextShiftItems?: IScheduleHour[]
  errorMessage: string
  maxShiftItems: number
  minProductionItems: number
  timeReference: string
}

const ScheduleHoursForm = ({
  title,
  name,
  previousShiftItems,
  maxShiftItems,
  nextShiftItems,
  timeReference
}: ScheduleHoursFormProps) => {
  const {
    control,
    getValues,
    setValue,
    formState: { errors },
    register,
    clearErrors,
    watch,
    trigger
  } = useFormContext<IShiftModel>()

  const { fields, append, remove } = useFieldArray({
    control,
    name
  })
  const lastItemIndex = fields.length - 1
  const firstItemNextShift = nextShiftItems?.[0]
  const { t } = useTranslation('admin')

  const handleAddScheduleHour = () => {
    let previousEndTime = ''

    const scheduleHour: IScheduleHour = {
      id: uuid(),
      type: Type.Production,
      hoursStart: '',
      hoursEnd: '',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      shiftType: name
    }
    const previousEndTimeFromLastItem = previousShiftItems?.[previousShiftItems?.length - 1]?.hoursEnd

    if (fields.length > 0) {
      previousEndTime = getValues(`${name}.${lastItemIndex}`).hoursEnd
    } else if (previousShiftItems && previousShiftItems?.length > 0 && previousEndTimeFromLastItem) {
      previousEndTime = previousEndTimeFromLastItem
    }

    append({ ...scheduleHour, hoursStart: previousEndTime })
    clearErrors(`${name}.0`)
  }

  const handleDelete = (index: number) => {
    remove(index)
    const previousItem = fields[index - 1]

    if (firstItemNextShift && previousItem) {
      const { hoursEnd } = previousItem

      setValue(`${firstItemNextShift.shiftType}.0`, { ...firstItemNextShift, hoursStart: hoursEnd })
      trigger(`${firstItemNextShift.shiftType}`)
    }
  }

  const handleChangeHoursEnd = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = event.target
    const nextScheduleSlot = getValues(`${name}.${index + 1}`)
    if (nextScheduleSlot) {
      setValue(`${name}.${index + 1}.hoursStart`, value)
    } else {
      if (firstItemNextShift) {
        setValue(`${firstItemNextShift?.shiftType}.0.hoursStart`, value)
      }
    }
  }

  const handleClickHoursEnd = (index: number) => {
    const hoursEnd = getValues(`${name}.${index}.hoursEnd`)
    if (!hoursEnd) {
      setValue(`${name}.${index}.hoursEnd`, watch(`${name}.${index}.hoursStart`))
    }
  }

  return (
    <Grid container direction='column' style={{ display: 'block', marginBottom: '1.5rem' }}>
      <Grid
        item
        style={{
          borderBottom: `1px solid ${colors.gray2}`,
          width: '100%',
          paddingBottom: '1rem',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Typography variant='h2'>{title}</Typography>
        {!!errors[name] && <ErrorIcon style={{ marginLeft: '1rem' }} width='24px' height='24px' />}
      </Grid>
      <Stack>
        <Paper elevation={0} square>
          {fields.length > 0 && (
            <>
              <Grid
                container
                style={{
                  marginTop: '1rem',
                  marginBottom: '0.5rem'
                }}
              >
                <Grid item xs={3} style={{ paddingLeft: '1rem' }}>
                  <Typography variant='h5'>{t('shiftModelsSection.type')}</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography variant='h5'>{t('shiftModelsSection.startTime')}</Typography>
                </Grid>
                <Grid item xs={2} style={{ marginLeft: '2rem' }} />
                <Grid item xs={2.5}>
                  <Typography variant='h5'>{t('shiftModelsSection.endTime')}</Typography>
                </Grid>
                <Grid item xs={2.5}>
                  <Typography variant='h5'>{t('shiftModelsSection.downtime')}</Typography>
                </Grid>
              </Grid>
              <Stack>
                {fields.map((field, index) => {
                  const scheduleHour = getValues(`${name}.${index}`)

                  const { timeDifference, hasNegativeTime } = calculateTimeDifference({
                    timeReference,
                    scheduleHour
                  })
                  return (
                    <Fragment key={field.id}>
                      <Grid container>
                        <Grid item xs={3}>
                          <ShiftModelDropDown
                            shifts={getValues(name)}
                            id={`shift-type-dropdown-${name}-${index}`}
                            onChangeType={(type) => setValue(`${name}.${index}.type`, type)}
                            type={watch(`${name}.${index}.type`)}
                            index={index}
                            isProductionLimit={
                              getTypeOccurrenceFromSchedule(getValues(name), Type.Production) >= maxShiftItems
                            }
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <TimePicker
                            value={scheduleHour?.hoursStart}
                            id={`hours-start-time-picker-${name}-${index}`}
                            disabled={index > 0 || name === Shift.afternoonShift || name === Shift.nightShift}
                            type='time'
                            size='small'
                            error={!!errors[name]?.[index]?.hoursStart}
                            inputProps={inputProps}
                            sx={{ width: '7rem' }}
                            {...register(`${name}.${index}.hoursStart`)}
                          />
                        </Grid>
                        {/* Time Calculation */}
                        <Grid
                          item
                          xs={2}
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            marginLeft: '2rem'
                          }}
                        >
                          {timeDifference && (
                            <div
                              style={{
                                width: '3rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 3
                              }}
                            >
                              <AccessTimeIcon
                                style={{
                                  fontSize: 14,
                                  color: colors.gray2,
                                  marginRight: 2
                                }}
                              />
                              <Typography variant='h5'>{timeDifference}</Typography>
                            </div>
                          )}
                          <Timeline />
                        </Grid>
                        <Grid item xs={2.5}>
                          <TimePicker
                            value={scheduleHour.hoursEnd}
                            id={`hours-end-time-picker-${name}-${index}`}
                            onClick={() => handleClickHoursEnd(index)}
                            type='time'
                            size='small'
                            error={!!errors[name]?.[index]?.hoursEnd || hasNegativeTime}
                            inputProps={inputProps}
                            sx={{ width: '7rem' }}
                            {...register(`${name}.${index}.hoursEnd`, {
                              onChange: (event) => handleChangeHoursEnd(event, index)
                            })}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TimePicker
                            value={scheduleHour.downtime ?? '00:00'}
                            id={`downtime-time-picker-${name}-${index}`}
                            type='time'
                            size='small'
                            sx={{ width: '7rem' }}
                            disabled={scheduleHour.type !== Type.Production || !timeDifference} // disable downtime until the user enters [start, end] for the schedulehour
                            {...register(`${name}.${index}.downtime`)}
                          />
                        </Grid>
                        {lastItemIndex === index && (
                          <Grid item xs={1}>
                            <IconButton style={{ marginLeft: '1rem' }} onClick={() => handleDelete(index)}>
                              <DeleteIcon color='primary' id={`delete-timeslot-${name}`} />
                            </IconButton>
                          </Grid>
                        )}
                      </Grid>
                      <Divider style={{ margin: '6px 0 8px 0' }} light />
                      {(!!errors[name]?.[index]?.hoursEnd || !!errors[name]?.[index]?.hoursStart) && (
                        <Typography variant='subtitle2' id={`error-message-${name}`}>
                          {t(
                            `shiftModelsSection.${
                              errors[name]?.[index]?.hoursEnd?.message as AdminShiftModelTranslationKey
                            }`
                          )}
                        </Typography>
                      )}
                    </Fragment>
                  )
                })}
              </Stack>
            </>
          )}
          <Grid container item direction='row' xs={4} style={{ paddingBottom: '5px', width: '95%' }}>
            <ListItemButton
              onClick={handleAddScheduleHour}
              style={{ paddingLeft: 0 }}
              id={`add-${name}-button`}
              disabled={isDisabled(watch(name))}
            >
              <ListItemIcon style={{ minWidth: 0, marginRight: '8px' }}>
                <AddIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant='h3' color={colors.blue}>
                    {t('shiftModelsSection.addShiftButton')}
                  </Typography>
                }
              />
            </ListItemButton>
          </Grid>
          <Grid item>
            {!!errors[name]?.[0]?.type && (
              <Typography variant='subtitle2' id={`error-message-${name}`}>
                {t('shiftModelsSection.minimumItemsOfProduction')}
              </Typography>
            )}
          </Grid>
        </Paper>
      </Stack>
    </Grid>
  )
}

export default memo(ScheduleHoursForm)
