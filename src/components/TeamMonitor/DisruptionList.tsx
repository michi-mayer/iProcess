import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import moment from 'moment-timezone'
import { sortBy } from 'remeda'
import type { Disruption, DisruptionWithTemplateData, Team } from 'types'
import DisruptionBadge from 'components/Badges/DisruptionBadge'
import BlinkingDotIcon from 'components/Icons/BlinkingDotIcon'
import { OrderStatusBarContainer } from 'components/OrderStatusBar/OrderStatusBar'
import SimpleTable, { Header } from 'components/Tables/SimpleTable'
import TextTableCells from 'components/Tables/TextTableCells'
import { useIProcessState } from 'contexts/iProcessContext'
import { EMPTY_VALUE } from 'helper/constants'
import { isRecent } from 'helper/utils'
import { DURATION_FORMAT, UNIT_SPECIFIC_CYCLE_STATION } from 'shared'
import { colors } from 'theme'

const DURATION_IN_MS = moment.duration(10, 'seconds').asMilliseconds()

export const DiagramContainer = styled(OrderStatusBarContainer)({
  textAlign: 'left',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  borderRadius: '8px',
  alignItems: 'center',
  paddingTop: '2rem',
  paddingBottom: '3rem'
})

interface MarkedDisruption extends Disruption {
  isMarked?: boolean
}

const TABLE_HEAD: Header<MarkedDisruption>[] = [
  { id: 'description', label: 'disruption' },
  { id: 'startTimeDate', label: 'dateTimeStart' },
  { id: 'duration', label: 'totalDurationShort' },
  { id: 'cycleStationName', label: 'cycleStation' },
  { id: 'lostVehicles', label: 'quantity' },
  { id: 'm100', label: 'm100' },
  { id: 'isSolved', label: 'status' },
  { id: 'team', label: 'reporter' }
]

interface UseMostRecentDisruptionsProps {
  items: DisruptionWithTemplateData[]
}

const getUnixTime = (_: string) => new Date(_).getTime()

const useMostRecentDisruptions = ({ items }: UseMostRecentDisruptionsProps) => {
  const [list, setList] = useState<MarkedDisruption[]>([])

  const updateList = useCallback(() => {
    const now = moment()
    const listWithMarkers = items.map((_) => {
      const isMarked = isRecent(_.updatedAt, now)
      return { ..._, isMarked }
    })
    // * Set list and sort it by 'updatedAt' in reversed order (mind the minus '-' operator)
    setList(sortBy(listWithMarkers, (_) => -getUnixTime(_.updatedAt)))
  }, [items])

  useEffect(() => {
    updateList()

    const interval = setInterval(updateList, DURATION_IN_MS)
    return () => clearInterval(interval)
  }, [updateList])

  return { mostRecentDisruptions: list, markedCount: list.filter((_) => _.isMarked).length }
}

interface DisruptionTableRowProps {
  selectedTeam: Team | undefined
  disruption: MarkedDisruption
  index: number
  text: {
    solvedStatus: string
    notSolvedStatus: string
    myTeamName: string
  }
}

const DisruptionRow = ({ disruption, index, selectedTeam, text }: DisruptionTableRowProps) => {
  const { description, startTimeDate, duration, cycleStationName, lostVehicles, team, m100, isMarked, isSolved } =
    disruption

  const timePeriod = moment(startTimeDate).format(DURATION_FORMAT)
  const cycleStation =
    selectedTeam?.id === team?.id ? cycleStationName || UNIT_SPECIFIC_CYCLE_STATION.name : EMPTY_VALUE
  const m100Text = m100 || EMPTY_VALUE
  const teamName = selectedTeam?.id === team?.id ? text.myTeamName : team?.name ?? EMPTY_VALUE
  const status = isSolved ? text.solvedStatus : text.notSolvedStatus

  return (
    <TableRow id={`disruption-row-${index}`} key={index}>
      <TableCell align='left'>
        <Grid display='flex' style={{ alignItems: 'center', position: 'relative' }}>
          {isMarked && (
            <BlinkingDotIcon
              style={{
                background: `${colors.redError} 0% 0% no-repeat padding-box`,
                border: `1px solid ${colors.signalRed900}`,
                marginRight: '8px',
                position: 'absolute',
                left: '-16px'
              }}
            />
          )}
          <Typography variant='body2'>{description}</Typography>
        </Grid>
      </TableCell>
      <TextTableCells
        items={[
          { id: 'startTimeDate', value: timePeriod },
          { id: 'duration', value: duration },
          { id: 'cycleStationName', value: cycleStation },
          { id: 'quantity', value: lostVehicles },
          { id: 'm100', value: m100Text },
          { id: 'status', value: status },
          { id: 'team', value: teamName }
        ]}
        variant='body2'
      />
    </TableRow>
  )
}

interface DisruptionListProps {
  items: DisruptionWithTemplateData[]
}

const DisruptionList = ({ items }: DisruptionListProps) => {
  const { t } = useTranslation(['teamMonitor', 'iProcess'])
  const { selectedTeam } = useIProcessState()
  const { mostRecentDisruptions, markedCount } = useMostRecentDisruptions({ items })

  const transformedMostRecentDisruption = mostRecentDisruptions.map((_) => {
    _.cycleStationName =
      _.cycleStationName === UNIT_SPECIFIC_CYCLE_STATION.name
        ? t('iProcess:disruptionDialog.defaultCycleStationName')
        : _.cycleStationName

    return _
  })
  const text = {
    solvedStatus: t('iProcess:disruptionDialog.solved'),
    notSolvedStatus: t('iProcess:disruptionDialog.notSolved'),
    myTeamName: t('teamMonitor:overview.disruptionList.myTeam')
  }

  return (
    <DiagramContainer style={{ marginTop: '1rem' }}>
      <Grid container item alignItems={'center'}>
        <Typography variant='h4' paddingLeft='1rem'>
          {t('teamMonitor:overview.disruptionList.title')}
        </Typography>
        <DisruptionBadge count={markedCount} />
      </Grid>
      <div style={{ padding: '1rem' }}>
        <SimpleTable
          headers={TABLE_HEAD}
          data={transformedMostRecentDisruption}
          renderTableRow={(disruption, index) => DisruptionRow({ disruption, index, selectedTeam, text })}
          ariaLabel='disruption-list-table'
          tableStyle={{ width: '100%' }}
        />
      </div>
    </DiagramContainer>
  )
}

export default DisruptionList
