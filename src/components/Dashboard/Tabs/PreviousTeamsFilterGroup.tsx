import { type ChangeEvent, type PropsWithChildren, RefObject, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { sumBy } from 'remeda'
import { QUERY_PARAMS } from 'routes/routing'
import { Team } from 'types'
import DisruptionBadge from 'components/Badges/DisruptionBadge'
import SendIcon from 'components/Icons/SendIcon'
import { FlexGrid } from 'components/styled'
import useMediaQuery from 'hooks/useMediaQuery'
import usePreviousTeams from 'hooks/usePreviousTeams'
import useTeams from 'hooks/useTeams'
import DropDownAutocomplete, { DropDownOption } from 'lib/form/DropDownAutocomplete'
import { GetOptionLabel } from 'lib/form/types'
import { MOBILE_WIDTH } from './MyTeamFilterGroup'

interface FilterGroupProps extends PropsWithChildren {
  previousTeamsLabel: string
  count: number
  fromReportedDisruptions: boolean
}

const DesktopPreviousTeamsFilterGroup = ({
  previousTeamsLabel,
  count,
  children,
  fromReportedDisruptions
}: FilterGroupProps) => (
  <Grid container item xs={9} alignItems='center' style={{ marginLeft: '1rem' }}>
    <FlexGrid item style={{ marginRight: '0rem', width: MOBILE_WIDTH }}>
      <Typography variant='h4'>{previousTeamsLabel}</Typography>
      {!fromReportedDisruptions && <DisruptionBadge count={count} />}
    </FlexGrid>
    {children}
  </Grid>
)

const MobilePreviousTeamsFilterGroup = ({
  previousTeamsLabel,
  count,
  children,
  fromReportedDisruptions
}: FilterGroupProps) => (
  <>
    <FlexGrid item xs={12} style={{ marginLeft: '1rem', marginBottom: '1rem', marginRight: '0rem' }}>
      <Typography variant='h4'>{previousTeamsLabel}</Typography>
      {!fromReportedDisruptions && <DisruptionBadge count={count} />}
    </FlexGrid>
    {children}
  </>
)

interface PreviousTeamsFilterGroupProps {
  templateRefs?: RefObject<HTMLSpanElement>[]
  fromReportedDisruptions?: boolean
}

const PreviousTeamsFilterGroup = ({ templateRefs, fromReportedDisruptions = false }: PreviousTeamsFilterGroupProps) => {
  const { t } = useTranslation()
  const [isDesktopWidth] = useMediaQuery('lg')
  const [params, setParams] = useSearchParams()

  const { teams } = useTeams()
  const { previousTeams, selectedPreviousTeams, selectedItemsName, getSelectedPreviousTeams } = usePreviousTeams(teams)

  const totalDisruptions = sumBy(templateRefs || [], (_) => Number(_.current?.textContent || '0'))

  const Layout = useMemo(
    () => (isDesktopWidth ? DesktopPreviousTeamsFilterGroup : MobilePreviousTeamsFilterGroup),
    [isDesktopWidth]
  )

  const handleChangeDropdown = (event: ChangeEvent<HTMLInputElement>) => {
    const team = previousTeams.find((_) => _.id === event.target.value)
    if (team) {
      const isAlreadySelected = selectedPreviousTeams.some((_) => _.id === team.id)
      const currentSelectedTeams = getSelectedPreviousTeams(team, isAlreadySelected)
      params.set(QUERY_PARAMS.previousTeams, JSON.stringify(currentSelectedTeams))
      return setParams(params)
    }
    console.error(`Team with id ${event.target.value} does not exist`)
  }

  const handleLabel: GetOptionLabel<Team> = (team) => (typeof team === 'object' ? team.name : team)

  return (
    <Grid
      container
      justifyContent='flex-start'
      alignItems='center'
      style={{
        marginTop: fromReportedDisruptions ? '3.5rem' : undefined,
        marginBottom: '0.5rem'
      }}
    >
      <Layout
        previousTeamsLabel={t('disruptionReview.previousTeamsLabel')}
        count={totalDisruptions}
        fromReportedDisruptions={fromReportedDisruptions}
      >
        <Grid item>
          <DropDownAutocomplete
            options={previousTeams}
            multiple
            name='previous-teams'
            icon={<SendIcon width={24} height={24} style={{ transform: 'rotate(90deg)' }} />}
            selectedName={selectedItemsName}
            getOptionLabel={handleLabel}
            renderOption={(props, team) => (
              <DropDownOption
                type='checkbox'
                key={team.index}
                label={team.name}
                checked={selectedPreviousTeams.map((_) => _.id)?.includes(team?.id)}
                value={team.id}
                onChange={handleChangeDropdown}
                showDivider={previousTeams && team.index === 0 && previousTeams.length > 1}
                listProps={props}
              />
            )}
          />
        </Grid>
      </Layout>
    </Grid>
  )
}

export default PreviousTeamsFilterGroup
