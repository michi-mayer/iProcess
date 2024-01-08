import { useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { Grid, Typography } from '@mui/material'
import { z } from 'zod'
import { RejectedFormSchema } from 'zodSchemas'
import { useIProcessState } from 'contexts/iProcessContext'
import { getSelectedTabStartTime } from 'helper/time'
import useMutateRejected from 'hooks/services/useMutateRejected'
import type { Rejected } from 'hooks/services/useQueryRejectedCount'
import useNow from 'hooks/useNow'
import Counter from 'lib/form/Counter'
import TimePicker from 'lib/form/TimePicker'
import { GroupUIDiscardButton, GroupUILayout, GroupUISubmitButton } from 'lib/ui/Buttons'
import CustomDialog from '../CustomDialog'
import { validateNumber } from '../DisruptionDialogs/utils'

type IRejectedFormWithNoQualityIssue = z.infer<typeof RejectedFormSchema>

const initialState = {
  id: undefined,
  count: 0,
  timeStamp: undefined
}

interface RejectedFormWithNoQualityIssueProps {
  onClose: () => void
  openDialog: boolean
  rejected?: Rejected
}

const RejectedFormWithNoQualityIssue = ({ onClose, openDialog, rejected }: RejectedFormWithNoQualityIssueProps) => {
  const { t } = useTranslation('iProcess')
  const now = useNow([openDialog])
  const {
    unitSelected,
    productSelected: partSelected,
    currentShiftScheduleSlots,
    selectedShiftTab,
    currentShiftTab
  } = useIProcessState()
  const { mutate: createDefective, isSuccess, isPending } = useMutateRejected('create')
  const { mutate: updateDefective, isSuccess: isUpdateSuccess } = useMutateRejected('update')

  const timeSlotStartTime = getSelectedTabStartTime({ currentShiftScheduleSlots, selectedShiftTab, currentShiftTab })

  const methods = useForm<IRejectedFormWithNoQualityIssue>({
    shouldUnregister: true,
    resolver: zodResolver(RejectedFormSchema),
    defaultValues: rejected
      ? { id: rejected.id, count: rejected.count, timeStamp: rejected.timeStamp }
      : {
          ...initialState,
          timeStamp: timeSlotStartTime ?? now
        }
  })

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors }
  } = methods

  const onSubmit: SubmitHandler<IRejectedFormWithNoQualityIssue> = (data) => {
    if (data?.id) {
      updateDefective(data)
    } else {
      createDefective(data)
    }
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
    let mounted = true
    if (mounted && openDialog) {
      if (rejected) {
        setValue('id', rejected.id)
        setValue('count', rejected.count)
        setValue('timeStamp', rejected.timeStamp)
      } else {
        setValue('timeStamp', timeSlotStartTime ?? now)
      }
    }
    return () => {
      mounted = false
    }
  }, [rejected, openDialog, setValue, timeSlotStartTime, now])

  const rejectedProducts = watch('count')

  return (
    <CustomDialog
      onClose={onClose}
      open={openDialog}
      maxWidth={false}
      title={t('nioDialog.leftHeader')}
      dialogContentStyle={{ width: '560px', padding: '24px' }}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%' }}>
          <Grid container style={{ height: '100%' }}>
            <Grid container item xs={12}>
              <Grid container item style={{ marginTop: '24px' }}>
                <Grid item xs={6}>
                  <Typography variant='h5'>{t('nioDialog.leftMachine')}</Typography>
                  <Typography variant='body1'>{unitSelected?.shortName}</Typography>
                </Grid>
                <Grid item xs={5}>
                  <Typography variant='h5'>{t('nioDialog.leftProduct')}</Typography>
                  <Typography variant='body1'>{partSelected.name}</Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} style={{ marginTop: '24px' }}>
                <Typography variant='subtitle1' style={{ marginBottom: '4px' }}>
                  {t('nioDialog.leftTimeStamp')}
                </Typography>
                <TimePicker
                  errorMessage={t('nioDialog.nioDamageTime')}
                  isError={!!errors.timeStamp}
                  {...register('timeStamp')}
                />
              </Grid>
              <Grid item xs={12} style={{ marginTop: '24px' }}>
                <Typography variant='h2'>{t('nioDialog.nioCountHeader')}</Typography>
                <Typography variant='caption' style={{ marginTop: '16px', display: 'block' }}>
                  {t('nioDialog.nioCountSubHeader')}
                </Typography>
                <Counter
                  defaultValue={rejectedProducts}
                  {...register('count', {
                    valueAsNumber: true,
                    setValueAs: (value) => validateNumber(value)
                  })}
                  formStateField='count'
                  errorMessage={t('nioDialog.nioCounterMissing')}
                  isError={!!errors.count}
                  inputId='rejected-nqi-counter-edit'
                  addButtonId='rejected-nqi-counter-add'
                />
              </Grid>
            </Grid>
            <GroupUILayout>
              <GroupUIDiscardButton onClick={onClose}>{t('buttons.discard')}</GroupUIDiscardButton>
              <GroupUISubmitButton
                id='nio-nqi-submit-button'
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

export default RejectedFormWithNoQualityIssue
