import { memo, useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material'
import { Measure } from 'APIcustom'
// Other libraries
import { v4 as uuid } from 'uuid'
import { Status } from 'API'
import ArrowIcon from 'components/Icons/ArrowIcon'
// Icons
import ListIcon from 'components/Icons/list.svg'
import MeasureItem from 'components/Measures/MeasureItem'
import { AccordionDivider, CustomAccordion, IReportMeasureState } from 'components/Measures/ReportMeasures'
import useQueryListUsers from 'hooks/services/useQueryListUsers'
import { AddButton } from 'lib/ui/Buttons'
import { getDateAndTime } from 'shared/time'

const initialMeasureValues: Measure = {
  id: uuid(),
  description: '',
  subDepartment: '',
  status: Status.Described,
  dueDate: getDateAndTime().date
}

const MeasuresAccordion = () => {
  const { reportId } = useParams()
  const [expanded, setIsExpanded] = useState<boolean>(!!reportId)
  const { t } = useTranslation('measures')
  const { data: subDepartments } = useQueryListUsers(['custom:subdepartment'])
  const {
    control,
    watch,
    formState: { errors }
  } = useFormContext<IReportMeasureState>()

  const {
    fields: fieldsMeasures,
    append: appendMeasure,
    remove: removeMeasure
  } = useFieldArray({
    control,
    name: 'measures'
  })

  const measures = watch('measures')
  const lastMeasure = measures?.slice(-1)[0]
  const isNewMeasureDisabled = lastMeasure ? Object.values(lastMeasure).includes('') : false

  /* Handlers */
  const handleAddMeasure = () => {
    initialMeasureValues.id = uuid()
    appendMeasure(initialMeasureValues)
  }

  const handleDeleteMeasure = (index: number) => {
    removeMeasure(index)
  }

  const handleMeasureClick = () => {
    setIsExpanded(!expanded)
    if (measures?.length === 0 && !expanded) {
      handleAddMeasure()
    }
  }

  useEffect(() => {
    if (errors.measures) {
      setIsExpanded(true)
    }
  }, [errors])

  return (
    <>
      <CustomAccordion
        defaultExpanded={!!reportId}
        expanded={expanded}
        disableGutters
        sx={{
          margin: '4px 0',
          '&::before': {
            display: 'none'
          }
        }}
      >
        <AccordionSummary expandIcon={<ArrowIcon />} style={{ paddingLeft: 0 }} onClick={handleMeasureClick}>
          <Grid container style={{ display: 'flex', alignItems: 'center' }}>
            <img height='24px' src={ListIcon} loading='lazy' />
            <Grid style={{ paddingLeft: '0.5rem' }}>
              <Typography variant='h2'>{t('measures.title')}</Typography>
              <Typography variant='body2'>{t('measures.description')}</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails style={{ padding: 0 }}>
          {fieldsMeasures?.map((measure, index) => {
            return (
              <MeasureItem
                key={measure.id}
                index={index}
                onDelete={handleDeleteMeasure}
                subDepartments={subDepartments}
              />
            )
          })}

          {fieldsMeasures.length > 0 ? <AccordionDivider /> : undefined}
          <AddButton
            text={t('measures.addNewMeasure')}
            onClick={handleAddMeasure}
            disabled={isNewMeasureDisabled}
            id='add-new-measure'
          />
        </AccordionDetails>
      </CustomAccordion>
      {!expanded ? <AccordionDivider /> : undefined}
    </>
  )
}

export default memo(MeasuresAccordion)
