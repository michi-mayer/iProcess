import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import { Button, TableCell, TableRow, Typography } from '@mui/material'
import { equals } from 'remeda'
import { ROUTER } from 'routes/routing'
import { TemplateDashboard } from 'types'
import { z } from 'zod'
import PlusIcon from 'components/Icons/PlusIcon'
import { BasicReportMeasure } from 'hooks/services/useQueryScanBasicReportMeasures'
import { NonEmptyString, OTHER_DISRUPTIONS_TEMPLATE_ID } from 'shared'

interface Props {
  template: TemplateDashboard
  reportMeasures: BasicReportMeasure[] | undefined
}

const ZodSchema = z.object({
  description: NonEmptyString,
  classifications: z.array(NonEmptyString).transform((_) => _.sort()),
  unitId: NonEmptyString,
  productNumber: NonEmptyString,
  cycleStationName: NonEmptyString
})

const checkExistingReportMeasure = ({ reportMeasures, template }: Props) => {
  if (template.templateId === OTHER_DISRUPTIONS_TEMPLATE_ID) {
    for (const reportMeasureItem of reportMeasures || []) {
      const reportMeasureValues = ZodSchema.parse({
        ...reportMeasureItem,
        classifications: JSON.parse(reportMeasureItem.classifications || '[]')
      })
      const templateValues = ZodSchema.parse(template)
      const isEqual = equals(reportMeasureValues, templateValues)
      if (isEqual) {
        return reportMeasureItem.id
      }
    }
  } else {
    return reportMeasures?.find((_) => _.templateId === template.templateId)?.id
  }
}

const TemplateRow = ({ template, reportMeasures }: Props) => {
  const reportId = useMemo(() => checkExistingReportMeasure({ reportMeasures, template }), [reportMeasures, template])
  const { t } = useTranslation('dashboard')
  const navigate = useNavigate()
  const handleClick = (template: TemplateDashboard) => {
    if (reportId) {
      navigate(`${ROUTER.MEASURES_UPDATE}/${reportId}`)
    } else {
      navigate(`${ROUTER.MEASURES}/${ROUTER.MEASURES_CREATE}`, { state: template })
    }
  }

  return (
    <TableRow>
      <TableCell align='left'>
        <Typography variant='body2'>{template.description}</Typography>
      </TableCell>
      <TableCell align='left'>
        <Typography variant='body2'>{`${template.totalDuration} h`}</Typography>
      </TableCell>
      <TableCell align='left'>
        <Typography variant='body2'>{template.frequency}</Typography>
      </TableCell>
      <TableCell align='left'>
        <Typography variant='body2'>{template.unitShortName}</Typography>
      </TableCell>
      <TableCell align='right'>
        <Button
          startIcon={reportId ? <EditIcon /> : <PlusIcon />}
          variant='outlined'
          onClick={() => handleClick(template)}
        >
          <Typography variant='caption'>
            {reportId ? t('disruptions.editMeasureReport') : t('disruptions.addMeasureReport')}
          </Typography>
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default TemplateRow
