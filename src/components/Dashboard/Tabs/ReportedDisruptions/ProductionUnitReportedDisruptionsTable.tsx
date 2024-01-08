import { useTranslation } from 'react-i18next'
import { Stack, TableCell, TableRow, Typography } from '@mui/material'
import { DisruptionWithTemplateData } from 'types'
import { CycleStationsDropdown } from 'components/CycleStationsDropdown'
import { Header } from 'components/Tables/SimpleTable'
import TextTableCells from 'components/Tables/TextTableCells'
import { useIProcessState } from 'contexts/iProcessContext'
import { ActionButtons } from 'lib/ui/Buttons'
import { getTime } from 'shared'
import RejectedTable from '../Quantities/RejectedTable'
import ReportedDisruptionsTable, {
  borderLineBox,
  ReportedDisruptionsTableRowProps,
  TableCardStyled
} from './ReportedDisruptionsTable'

const TABLE_HEADERS: Header<DisruptionWithTemplateData>[] = [
  { id: 'description', label: 'disruptionDescription' },
  { id: 'startTimeDate', label: 'timePeriod' },
  { id: 'duration', label: 'duration' },
  { id: 'measures', label: 'measure' },
  { id: 'cycleStationName', label: 'cycleStation' },
  { id: 'lostVehicles', label: 'disruptionQuantity' }
]

const DisruptionsTableRow = ({
  disruption,
  cycleStations,
  style,
  onClickEdit,
  onClickDelete
}: ReportedDisruptionsTableRowProps) => {
  const { cycleStationId, startTimeDate, endTimeDate, id, description, measures, duration, lostVehicles } = disruption

  const cycleStationName = cycleStations.find((_) => cycleStationId === _.id)?.name
  const period = `${getTime(startTimeDate)} - ${getTime(endTimeDate)}`

  return (
    <TableRow key={id}>
      <TextTableCells
        variant='body1'
        style={style}
        items={[
          { id: `disruption-review-description-${description}`, value: description },
          { id: `disruption-review-start-${description}`, value: period },
          { id: `disruption-review-duration-${description}`, value: duration },
          { id: `disruption-review-measure-${description}`, value: measures },
          { id: `disruption-review-cycleStation-${cycleStationId}`, value: cycleStationName },
          { id: `disruption-review-lostVehicles-${description}`, value: lostVehicles }
        ]}
      />
      <TableCell id={`disruption-review-edit-${description}`} align='right' padding='none' style={style}>
        <ActionButtons
          editButtonId={`disruption-button-edit-${description}`}
          deleteButtonId={`disruption-review-button-delete-${description}`}
          onClickDelete={() => onClickDelete(disruption)}
          onClickEdit={() => onClickEdit(disruption)}
        />
      </TableCell>
    </TableRow>
  )
}

const ProductionUnitReportedDisruptionsTable = () => {
  const { t } = useTranslation('iProcess')
  const { cycleStationSelected } = useIProcessState()

  return (
    <Stack>
      <Typography variant='h4' style={{ padding: '0 0 1rem 1rem' }}>
        {t('disruptionReview.disruptions')}
      </Typography>
      <CycleStationsDropdown />
      <TableCardStyled>
        <ReportedDisruptionsTable
          headers={TABLE_HEADERS}
          renderTableRow={DisruptionsTableRow}
          cycleStationId={cycleStationSelected?.id}
          tableStyle={{ ...borderLineBox, borderBottom: borderLineBox.borderBottom, flex: 1 }}
        />
      </TableCardStyled>
      <TableCardStyled>
        <Typography variant='h4' style={{ margin: '1rem 0' }}>
          {t('timeTabs.rejected')}
        </Typography>
        <RejectedTable firstColumnInfo='productName' containerStyle={{ ...borderLineBox, flex: 1 }} />
      </TableCardStyled>
    </Stack>
  )
}

export default ProductionUnitReportedDisruptionsTable
