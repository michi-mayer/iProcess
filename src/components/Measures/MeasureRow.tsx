import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Collapse, Grid, IconButton, TableCell, TableRow, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { ClassificationChipStyled } from 'components/Chips/Chip'
import { ReportMeasure } from 'hooks/services/useQueryListReportMeasures'
import { fetchReportMeasureById } from 'hooks/services/useQueryReportMeasureById'
import { ActionButtons } from 'lib/ui/Buttons'
import { colors } from 'theme'
import MeasureTable from './MeasureTable'
import { MeasureTranslationKeys } from './ReportMeasures'

const MeasureRow = ({
  report,
  onClickEdit,
  onClickDelete
}: {
  report: ReportMeasure
  onClickEdit: () => void
  onClickDelete: () => void
}) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation('measures')

  const [open, setOpen] = useState<boolean>(false)

  const hasMeasures = report.measures.length > 0

  const handleOnMouseOver = (reportId: string | undefined) => {
    queryClient.prefetchQuery({
      queryKey: ['ReportMeasureById', { reportId }],
      queryFn: () => fetchReportMeasureById(reportId)
    })
  }

  return (
    <>
      <TableRow
        hover={hasMeasures}
        onClick={hasMeasures ? () => setOpen(!open) : undefined}
        style={{ cursor: hasMeasures ? 'pointer' : undefined }}
        id='measure-report-row'
      >
        <TableCell style={{ padding: 0 }} id={'measure-report-expand'}>
          {hasMeasures ? (
            <IconButton aria-label='expand row' size='small'>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          ) : undefined}
        </TableCell>
        <TableCell align='left' height={56} style={{ padding: '0 0 0 1rem' }} id={'measure-report-description'}>
          <Typography variant='body1'>{report?.description}</Typography>
        </TableCell>
        <TableCell align='left' height={56} style={{ padding: '0 0 0 1rem' }} id={'measure-report-progress'}>
          <Typography variant='body1'>
            {t(`filter.${report.progress.toLowerCase() as MeasureTranslationKeys}`)}
          </Typography>
        </TableCell>
        <TableCell align='center' style={{ padding: 0 }} id={'measure-report-critical'}>
          {report?.isCritical && (
            <ClassificationChipStyled
              label={t('measures.critical')}
              style={{
                backgroundColor: colors.blue,
                color: colors.white
              }}
            />
          )}
        </TableCell>
        <TableCell align='right' height={56} style={{ padding: '0 0 0 1rem' }} id={'measure-report-buttons'}>
          <ActionButtons
            onClickEdit={onClickEdit}
            onClickDelete={onClickDelete}
            onMouseOverEdit={() => handleOnMouseOver(report.id)}
          />
        </TableCell>
      </TableRow>
      {hasMeasures ? (
        <TableRow>
          <TableCell
            colSpan={12}
            padding='none'
            style={{
              borderBottom: 'none'
            }}
          >
            <Collapse in={open} timeout='auto' unmountOnExit>
              <Grid container style={{ backgroundColor: colors.gray5, paddingLeft: '2.6rem' }}>
                <MeasureTable measures={report.measures} />
              </Grid>
            </Collapse>
          </TableCell>
        </TableRow>
      ) : undefined}
    </>
  )
}

export default MeasureRow
