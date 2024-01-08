import { SyntheticEvent, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import DeleteIcon from '@mui/icons-material/Delete'
import { Autocomplete, Grid, IconButton, MenuItem, Typography } from '@mui/material'
import measures from 'i18n/en/measures.json'
import { Status } from 'API'
import DeleteDialog from 'components/Dialogs/DeleteDialog'
import UploadFiles from 'components/Files/UploadFiles'
import StatusIcon from 'components/Icons/StatusIcon'
import useDialogHandler from 'hooks/useDialogHandler'
import useFormFile from 'hooks/useFormFile'
import DatePicker from 'lib/form/DatePicker'
import InputForm from 'lib/form/InputForm'
import { CustomSelect } from 'lib/form/SelectForm'
import { IReportMeasureState, StyledKeyboardArrowDownIcon } from './ReportMeasures'

type keyStatus = keyof typeof measures.status

interface Props {
  index: number
  onDelete: (index: number) => void
  subDepartments: string[] | undefined
}

const MeasureItem = ({ index, onDelete, subDepartments }: Props) => {
  const [isDeleted, setIsDeleted] = useState(false)
  const { handleClickOpen, open, handleClose } = useDialogHandler()

  const {
    register,
    setError,
    watch,
    setValue,
    formState: { errors },
    control
  } = useFormContext<IReportMeasureState>()

  const { append, attachments, deletedFiles, remove, replace } = useFormFile<IReportMeasureState>({
    control,
    attachmentName: `measures.${index}.attachments`,
    deletedFilesName: 'deletedFiles'
  })

  const { t } = useTranslation(['measures', 'admin'])

  const handleDeleteMeasure = () => {
    append(attachments)
    onDelete(index)
    setIsDeleted(true)
  }

  const handleClickDelete = () => {
    if (attachments.length > 0) {
      handleClickOpen()
    } else {
      onDelete(index)
    }
  }

  const handleAutocomplete = (_event: SyntheticEvent<Element, Event>, value: string | null) => {
    if (value) {
      setValue(`measures.${index}.subDepartment`, value, {
        shouldValidate: true
      })
    } else {
      setValue(`measures.${index}.subDepartment`, '')
    }
  }

  return (
    <>
      <Grid style={{ marginBottom: '1rem' }}>
        <Grid container alignItems={'center'} justifyContent={'space-between'} style={{ marginTop: '1rem' }}>
          <Typography variant='h4'>{t('measures:measures.subTitle')}</Typography>
          <IconButton onClick={handleClickDelete} id='delete-measure-button'>
            <DeleteIcon color='primary' />
          </IconButton>
        </Grid>
        <Typography variant='subtitle1' style={{ marginTop: '1rem' }}>
          {t('measures:measures.descriptionTitle')}
        </Typography>
        <InputForm
          {...register(`measures.${index}.description` as const)}
          type='text'
          error={!!errors.measures?.[index]?.description}
          errorMessage={t('measures:measures.descriptionError')}
          placeholder={t('measures:measures.descriptionPlaceholder')}
          defaultValue=''
          id='input-description'
          style={{ width: '100%' }}
          marginTop='4px'
        />
        <Grid container spacing={6}>
          <Grid item xs={5}>
            <Typography variant='subtitle1' style={{ marginTop: '1rem' }}>
              {t('measures:measures.assigneeTitle')}
            </Typography>
            <Autocomplete
              id='input-assignee'
              sx={{
                '& .MuiAutocomplete-endAdornment': {
                  paddingRight: '8px'
                }
              }}
              componentsProps={{
                paper: {
                  sx: {
                    marginTop: '8px',
                    boxShadow: 3
                  }
                }
              }}
              disablePortal
              popupIcon={<StyledKeyboardArrowDownIcon />}
              clearIcon={<div />}
              noOptionsText={t('measures:measures.noOptionsPlaceholder')}
              style={{ marginTop: '4px' }}
              onChange={handleAutocomplete}
              options={subDepartments || []}
              value={watch(`measures.${index}.subDepartment`)}
              isOptionEqualToValue={(option, value) => option === value}
              getOptionLabel={(subDepartment) => subDepartment}
              renderInput={(params) => (
                <InputForm
                  type='text'
                  error={!!errors.measures?.[index]?.subDepartment}
                  inputProps={params.inputProps}
                  errorMessage={t('measures:measures.assigneeError')}
                  ref={params.InputProps.ref}
                  placeholder={t('measures:measures.assigneePlaceholder')}
                  id={params.id}
                  endAdornment={params.InputProps.endAdornment}
                  style={{ width: '100%', padding: '3.5px 10px' }}
                  marginTop='0px'
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography variant='subtitle1' style={{ marginTop: '1rem' }}>
              {t('measures:measures.statusTitle')}
            </Typography>
            <Controller
              name={`measures.${index}.status`}
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  id='input-status'
                  error={!!errors.measures?.[index]?.status}
                  IconComponent={StyledKeyboardArrowDownIcon}
                  style={{ height: '41px' }}
                >
                  {Object.values(Status)?.map((status, index) => {
                    return (
                      <MenuItem key={index} value={status}>
                        <Grid alignItems={'center'} display={'flex'}>
                          <StatusIcon status={status} />
                          <Typography variant='body1' style={{ marginLeft: '1rem' }}>
                            {t(`measures:status.${status.toLowerCase() as keyStatus}`)}
                          </Typography>
                        </Grid>
                      </MenuItem>
                    )
                  })}
                </CustomSelect>
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography variant='subtitle1' style={{ marginTop: '1rem' }}>
              {t('measures:measures.dueDateTitle')}
            </Typography>
            <DatePicker
              {...register(`measures.${index}.dueDate` as const)}
              isError={!!errors?.measures?.[index]?.dueDate}
              errorMessage={t('measures:measures.dueDateError')}
              style={{ marginTop: '4px' }}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Typography
            variant='subtitle1'
            style={{ fontWeight: 'bold', marginTop: '1rem', marginBottom: '4px', width: '100%' }}
          >
            {t('measures:disruptionDetails.attachments')}
          </Typography>
          <UploadFiles
            description={watch(`measures.${index}.description`)}
            onUploadFile={replace}
            name={`measures.${index}.attachments`}
            attachments={attachments}
            onDeleteFile={append}
            onRestoreFile={remove}
            deletedFiles={deletedFiles}
            onError={() =>
              setError(`measures.${index}.attachments`, { message: t('measures:disruptionDetails.errorUploadingFile') })
            }
          />
        </Grid>
      </Grid>
      <DeleteDialog
        openDialog={open}
        isSuccess={isDeleted}
        title={t('measures:deleteMeasure.title')}
        onCloseDialog={handleClose}
        confirmToDeleteText={t('measures:deleteMeasure.confirmToDeleteText')}
        deleteButtonText={t('admin:deleteDialog.deleteButton')}
        discardButtonText={t('admin:deleteDialog.discardDeleteButton')}
        itemName={watch(`measures.${index}.description`)}
        onClickDelete={handleDeleteMeasure}
        onClickDiscard={handleClose}
      />
    </>
  )
}

export default MeasureItem
