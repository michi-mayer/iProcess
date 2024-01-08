import { memo, useRef } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { AccordionDetails, AccordionSummary, Grid, IconButton, Typography } from '@mui/material'
import { Reorder } from 'framer-motion'
import { v4 as uuid } from 'uuid'
import AddIcon from 'components/Icons/AddIcon'
import ArrowIcon from 'components/Icons/ArrowIcon'
import ChecklistIcon from 'components/Icons/checklist.svg'
import CauseItem from 'components/Measures/CauseItem'
import { AccordionDivider, CustomAccordion, IReportMeasureState } from 'components/Measures/ReportMeasures'
import DatePicker from 'lib/form/DatePicker'
import InputForm from 'lib/form/InputForm'
import { colors } from 'theme'

const SystematicAccordion = () => {
  const { t } = useTranslation('measures')

  const { reportId } = useParams()

  const dragConstraints = useRef<HTMLDivElement | null>(null)

  /* Hook form */

  const { control, watch, register, setValue } = useFormContext<IReportMeasureState>()

  const {
    fields: fieldsCauses,
    append: appendCause,
    remove: removeCause
  } = useFieldArray({
    control,
    name: 'causes'
  })

  const causes = watch('causes')
  const lastCause = causes?.slice(-1)[0]
  const isNewCauseDisabled = lastCause ? lastCause.cause.length <= 0 : false

  /* Handlers */
  const handleAddCause = () => {
    appendCause({
      id: uuid(),
      cause: ''
    })
  }

  const handleDeleteCause = (index: number) => {
    removeCause(index)
  }

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
          <img height='24px' src={ChecklistIcon} loading='lazy' />
          <Grid style={{ paddingLeft: '0.5rem' }}>
            <Typography variant='h2'>{t('systematicProblemAnalysis.title')}</Typography>
            <Typography variant='body2'>{t('systematicProblemAnalysis.description')}</Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails style={{ padding: 0 }}>
        <Grid container style={{ marginTop: '1rem' }}>
          <Grid item xs={12}>
            <Typography variant='h4'>{t('systematicProblemAnalysis.problemOverview')}</Typography>
          </Grid>
          <Grid item xs={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant='h5'>{t('systematicProblemAnalysis.what')}</Typography>
          </Grid>
          <Grid item xs={11}>
            <Typography variant='subtitle1' color={colors.gray1} style={{ marginTop: '1rem' }}>
              {t('systematicProblemAnalysis.whatSubTitle')}
            </Typography>
            <InputForm
              {...register(`what` as const)}
              type='text'
              placeholder={t('systematicProblemAnalysis.whatPlaceholder')}
              defaultValue=''
              id='input-what'
              style={{ width: '100%' }}
              marginTop='2px'
            />
          </Grid>
          <Grid item xs={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant='h5'>{t('systematicProblemAnalysis.when')}</Typography>
          </Grid>
          <Grid item xs={11}>
            <Typography variant='subtitle1' color={colors.gray1} style={{ marginTop: '1rem' }}>
              {t('systematicProblemAnalysis.whenSubTitle')}
            </Typography>
            <DatePicker {...register('when' as const)} style={{ width: '210px', marginTop: '2px' }} />
          </Grid>
          <Grid item xs={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant='h5'>{t('systematicProblemAnalysis.where')}</Typography>
          </Grid>
          <Grid item xs={11} style={{ marginBottom: '2rem' }}>
            <Typography variant='subtitle1' color={colors.gray1} style={{ marginTop: '1rem' }}>
              {t('systematicProblemAnalysis.whereSubTitle')}
            </Typography>
            <InputForm
              {...register(`where` as const)}
              type='text'
              placeholder={t('systematicProblemAnalysis.wherePlaceholder')}
              defaultValue=''
              id='input-where'
              style={{ width: '100%' }}
              marginTop='2px'
            />
          </Grid>
          <Grid item xs={12}>
            <AccordionDivider />
            <Typography variant='h4' style={{ marginTop: '1rem' }}>
              {t('systematicProblemAnalysis.prioritiseCauses')}
            </Typography>
            <Typography variant='body2'>{t('systematicProblemAnalysis.prioritiseCausesDescription')}</Typography>
          </Grid>
          <Grid item xs={12} ref={dragConstraints}>
            <Reorder.Group
              axis='y'
              values={causes}
              onReorder={(items) => setValue('causes', items)}
              style={{ marginBottom: 0, padding: 0 }}
            >
              {fieldsCauses?.map((_cause, index) => {
                return (
                  <CauseItem
                    key={causes[index]?.id}
                    dragConstraints={dragConstraints}
                    index={index}
                    onDelete={handleDeleteCause}
                  />
                )
              })}
            </Reorder.Group>
          </Grid>
          <Grid container justifyContent='center'>
            <IconButton
              onClick={handleAddCause}
              disabled={isNewCauseDisabled}
              style={{ padding: 0, marginTop: '0.5rem', marginBottom: '1rem' }}
              id='add-cause'
            >
              <AddIcon fill={isNewCauseDisabled ? colors.gray2 : colors.blue} height={24} width={24} />
            </IconButton>
          </Grid>
        </Grid>
      </AccordionDetails>
    </CustomAccordion>
  )
}

export default memo(SystematicAccordion)
