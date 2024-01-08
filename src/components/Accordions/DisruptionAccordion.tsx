import { memo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { AccordionDetails, AccordionSummary, Grid, TextField, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { TemplateDashboard } from 'types'
import UploadFiles from 'components/Files/UploadFiles'
import ArrowIcon from 'components/Icons/ArrowIcon'
import DocumentIcon from 'components/Icons/document.svg'
import DisruptionDetails from 'components/Measures/DisruptionDetails'
import { CustomAccordion, IReportMeasureState } from 'components/Measures/ReportMeasures'
import useFormFile from 'hooks/useFormFile'
import SwitchToggle from 'lib/form/SwitchToggle'

const CustomTextField = styled(TextField)({
  '.MuiInputBase-multiline': {
    marginTop: '0.25rem',
    paddingTop: '0.5rem'
  }
})

interface Props {
  templateState: TemplateDashboard | undefined
}

const DisruptionAccordion = ({ templateState }: Props) => {
  const { t } = useTranslation('measures')

  const { reportId } = useParams()

  /* Hook form */
  const { register, control, setError, watch } = useFormContext<IReportMeasureState>()
  const { append, attachments, deletedFiles, remove, replace } = useFormFile<IReportMeasureState>({
    control,
    attachmentName: 'attachments',
    deletedFilesName: 'deletedFiles'
  })

  return (
    <CustomAccordion
      defaultExpanded={!!reportId}
      disableGutters
      sx={{
        margin: '4px 0',
        '&::before': {
          display: 'none'
        }
      }}
    >
      <AccordionSummary expandIcon={<ArrowIcon />} style={{ paddingLeft: 0 }}>
        <Grid container style={{ display: 'flex', alignItems: 'center' }}>
          <img height='24px' src={DocumentIcon} loading='lazy' />
          <Grid style={{ paddingLeft: '0.5rem' }}>
            <Typography variant='h2'>{t('disruptionDetails.title')}</Typography>
            <Typography variant='body2'>{t('disruptionDetails.description')}</Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails style={{ padding: 0 }}>
        <DisruptionDetails templateState={templateState}>
          <SwitchToggle
            {...register('isCritical')}
            checked={watch('isCritical')}
            text={t('measures.critical')}
            id='measure-report-criticality'
          />
          <Typography variant='subtitle1' style={{ fontWeight: 'bold', marginTop: '1rem' }}>
            {t('disruptionDetails.notesTitle')}
          </Typography>
          <CustomTextField
            {...register('notes')}
            placeholder={t('disruptionDetails.notesPlaceholder')}
            multiline
            rows={2}
            fullWidth
            inputProps={{ style: { fontSize: '1rem' } }}
            id='measure-report-notes'
          />
          <Typography variant='subtitle1' style={{ fontWeight: 'bold', marginTop: '1rem', marginBottom: '4px' }}>
            {t('disruptionDetails.attachments')}
          </Typography>
          <UploadFiles
            description={templateState?.description ?? ''}
            onUploadFile={replace}
            onRestoreFile={remove}
            name='attachments'
            attachments={attachments}
            onDeleteFile={append}
            deletedFiles={deletedFiles}
            onError={() => setError('attachments', { message: t('disruptionDetails.errorUploadingFile') })}
          />
        </DisruptionDetails>
      </AccordionDetails>
    </CustomAccordion>
  )
}

export default memo(DisruptionAccordion)
