import { CSSProperties, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Disruption, Team, WithGridSize } from 'types'
import Chip from 'components/Chips/Chip'
import LabelWithHeader from 'components/Labels/LabelWithHeader'
import TeamLabel from 'components/Labels/TeamLabel'
import { useIProcessState } from 'contexts/iProcessContext'
import useCycleStations from 'hooks/useCycleStations'
import { Classifications, UNIT_SPECIFIC_CYCLE_STATION } from 'shared'

interface WithDisruption {
  disruption?: Disruption | undefined
}

interface CycleStationHeaderProps extends WithDisruption, WithGridSize {}

const CycleStationHeader = ({ xs, disruption }: CycleStationHeaderProps) => {
  const { t } = useTranslation()
  const cycleStationList = useCycleStations()
  const { cycleStationSelected } = useIProcessState()

  const cycleStation = cycleStationSelected?.id ? cycleStationSelected : UNIT_SPECIFIC_CYCLE_STATION

  const cycleStationName = useMemo(() => {
    const cycleStationId = disruption?.cycleStationId || cycleStation.id
    const cycleStationName = cycleStationList.find((_) => _.id === cycleStationId)?.name
    return cycleStationName || t('disruptionDialog.defaultCycleStationName')
  }, [cycleStation.id, cycleStationList, disruption?.cycleStationId, t])

  return (
    <>
      {cycleStationName && (
        <LabelWithHeader xs={xs} title={t('disruptionDialog.cycleStation')} content={cycleStationName} />
      )}
    </>
  )
}

interface ClassificationHeaderProps extends WithGridSize {
  classifications: Classifications
}

const ClassificationHeader = ({ xs, classifications }: ClassificationHeaderProps) => {
  const { t } = useTranslation()

  return (
    <Grid item xs={xs}>
      <Typography variant='h5'>{t('disruptionDialog.classification')}</Typography>
      <Chip label={classifications.category} selected={true} iconPosition='right' style={{ marginLeft: 0 }} />
      <Chip label={classifications.cause} selected={true} iconPosition='right' />
      {!!classifications.type && <Chip label={classifications.type} selected={true} iconPosition='right' />}
    </Grid>
  )
}

interface TeamsHeaderProps extends WithDisruption, WithGridSize {
  reporterTeam?: Team
}

const TeamsHeader = ({ xs, disruption, reporterTeam }: TeamsHeaderProps) => {
  const { t } = useTranslation()

  return (
    <Grid container item marginTop='0.5rem'>
      {disruption?.originatorTeam && (
        <Grid item xs={xs}>
          <TeamLabel title={t('disruptionDialog.originator')} isOriginator name={disruption?.originatorTeam.name} />
        </Grid>
      )}
      {reporterTeam?.name && (
        <Grid item xs={xs}>
          <TeamLabel title={t('disruptionDialog.reporter')} name={reporterTeam?.name} />
        </Grid>
      )}
    </Grid>
  )
}

interface DisruptionDialogHeaderProps extends WithDisruption {
  reporterTeam?: Team
  showTeamsInfo?: boolean
  showCycleStationInfo?: boolean
  classifications?: Classifications
  style?: CSSProperties
  xs: {
    unit: number
    product: number
    teams?: number
    cycleStation?: number
    classifications?: number
  }
}

const DisruptionDialogHeaderInfo = ({
  disruption,
  classifications,
  style,
  xs,
  reporterTeam = disruption?.team,
  showCycleStationInfo = false,
  showTeamsInfo = false
}: DisruptionDialogHeaderProps) => {
  const { t } = useTranslation()
  const { unitSelected, productSelected: partSelected } = useIProcessState()

  return (
    <Grid container item style={style}>
      {unitSelected && (
        <LabelWithHeader xs={xs.unit} title={t('disruptionDialog.leftMachine')} content={unitSelected.shortName} />
      )}
      {showCycleStationInfo && <CycleStationHeader disruption={disruption} xs={xs.cycleStation} />}
      {partSelected.name && (
        <LabelWithHeader xs={xs.product} title={t('disruptionDialog.leftProduct')} content={partSelected.name} />
      )}
      {classifications && <ClassificationHeader classifications={classifications} xs={xs.classifications} />}
      {showTeamsInfo && <TeamsHeader disruption={disruption} reporterTeam={reporterTeam} xs={xs.teams} />}
    </Grid>
  )
}

export default DisruptionDialogHeaderInfo
