import { useMemo } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { IconButton, Stack, TableCell, TableRow } from '@mui/material'
import { DisruptionWithTemplateData } from 'types'
import { Header } from 'components/Tables/SimpleTable'
import TextTableCells from 'components/Tables/TextTableCells'
import { useAuth } from 'contexts/authContext'
import { useIProcessState } from 'contexts/iProcessContext'
import { TeamsChoice } from 'hooks/services/useQueryDisruptionsByTime'
import usePreviousTeams from 'hooks/usePreviousTeams'
import useTeams from 'hooks/useTeams'
import { ActionButtons } from 'lib/ui/Buttons'
import { getTime } from 'shared'
import MyTeamFilterGroup from '../MyTeamFilterGroup'
import PreviousTeamsFilterGroup from '../PreviousTeamsFilterGroup'
import ReportedDisruptionsTable, { borderLineBox, ReportedDisruptionsTableRowProps } from './ReportedDisruptionsTable'

const getAssemblyLineTableHeaders = (
  lastHeader: Header<DisruptionWithTemplateData>
): Header<DisruptionWithTemplateData>[] => [
  { id: 'description', label: 'disruptionDescription' },
  { id: 'startTimeDate', label: 'dateTimeStart' },
  { id: 'duration', label: 'duration' },
  { id: 'lostVehicles', label: 'disruptionQuantity' },
  lastHeader
]

const BY_MY_TEAM_TABLE_HEADERS = getAssemblyLineTableHeaders({ id: 'cycleStationId', label: 'cycleStationShort' })

const BY_PREVIOUS_TEAMS_TABLE_HEADERS = getAssemblyLineTableHeaders({ id: 'originatorTeam', label: 'originator' })

const DEFAULT_PREV_TEAMS_SIZE = 1

const DisruptionsTableRow = ({
  disruption,
  cycleStations,
  style,
  onClickDelete,
  onClickEdit,
  onClickView
}: ReportedDisruptionsTableRowProps) => {
  const { id, description, cycleStationId, startTimeDate, duration, lostVehicles, originatorTeam } = disruption

  const start = getTime(startTimeDate)
  const cycleStationName = cycleStations.find((_) => _.id === cycleStationId)?.name
  const lastCellValue = originatorTeam?.id ? originatorTeam.name : cycleStationName
  const lastCellId = originatorTeam?.id ? `originatorTeam-${description}` : `cycleStation-${description}`

  return (
    <TableRow key={id}>
      <TextTableCells
        variant='body1'
        style={style}
        items={[
          { id: `disruption-review-description-${description}`, value: description },
          { id: `disruption-review-start-${description}`, value: start },
          { id: `disruption-review-duration-${description}`, value: duration },
          { id: `disruption-review-lostVehicles-${description}`, value: lostVehicles },
          { id: `disruption-review-${lastCellId}`, value: lastCellValue }
        ]}
      />
      <TableCell id={`disruption-review-actions-${description}`} align='right' padding='none' style={style}>
        <ActionButtons
          editButtonId={`disruption-button-edit-${description}`}
          deleteButtonId={`disruption-review-button-delete-${description}`}
          onClickDelete={() => onClickDelete(disruption)}
          onClickEdit={() => onClickEdit(disruption)}
        >
          <IconButton
            onClick={() => onClickView(disruption)}
            id={`disruption-button-show-details-${description}`}
            size='large'
          >
            <VisibilityIcon color='primary' />
          </IconButton>
        </ActionButtons>
      </TableCell>
    </TableRow>
  )
}

const AssemblyLineReportedDisruptionsTable = () => {
  const { selectedTeam, cycleStationSelected } = useIProcessState()
  const { authInfo } = useAuth()
  const { teams } = useTeams()
  const { previousTeams, selectedPreviousTeams } = usePreviousTeams(teams)

  const selectedPreviousTeamIds = useMemo(() => selectedPreviousTeams.map((_) => _.id), [selectedPreviousTeams])
  const showPreviousTeams = authInfo?.roles.includes('Manager') && previousTeams.length > DEFAULT_PREV_TEAMS_SIZE

  return (
    <Stack>
      <MyTeamFilterGroup showTeamsFilter />
      <div style={{ marginLeft: '1rem', marginRight: '1rem' }}>
        <ReportedDisruptionsTable
          headers={BY_MY_TEAM_TABLE_HEADERS}
          renderTableRow={DisruptionsTableRow}
          cycleStationId={cycleStationSelected?.id}
          // * Disruptions reported by and to my team
          reporter={{ by: TeamsChoice.SelectedTeam, id: selectedTeam?.id }}
          originator={{ by: TeamsChoice.NoTeam }}
          tableStyle={{
            marginTop: '1rem',
            marginBottom: '1rem',
            borderTop: borderLineBox.borderTop,
            borderBottom: borderLineBox.borderBottom
          }}
        />
      </div>
      {showPreviousTeams && (
        <>
          <PreviousTeamsFilterGroup fromReportedDisruptions />
          <div style={{ marginLeft: '1rem', marginRight: '1rem' }}>
            <ReportedDisruptionsTable
              headers={BY_PREVIOUS_TEAMS_TABLE_HEADERS}
              renderTableRow={DisruptionsTableRow}
              // * Disruptions reported by my team and originated by one of the previous teams
              reporter={{ by: TeamsChoice.SelectedTeam, id: selectedTeam?.id }}
              originator={{ by: TeamsChoice.PreviousTeams, ids: selectedPreviousTeamIds }}
              tableStyle={{
                marginTop: '1rem',
                borderTop: borderLineBox.borderTop,
                borderBottom: borderLineBox.borderBottom
              }}
            />
          </div>
        </>
      )}
    </Stack>
  )
}

export default AssemblyLineReportedDisruptionsTable
