import { PropsWithChildren, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { CycleStationsDropdown, CycleStationsDropdownProps } from 'components/CycleStationsDropdown'
import SearchDisruptionTemplates from 'components/Dashboard/Tabs/SearchDisruptionTemplates'
import { FlexGrid } from 'components/styled'
import { TeamsDropDown } from 'components/TeamsDropDown'
import useMediaQuery from 'hooks/useMediaQuery'
import useTeams from 'hooks/useTeams'

export const MOBILE_WIDTH = '174px' // ! this width is to match second template

interface ViewpointTeamLabelGroupProps extends PropsWithChildren {
  myTeamLabel: string
}

const DesktopMyTeamFilterGroup = ({ myTeamLabel, children }: ViewpointTeamLabelGroupProps) => (
  <Grid container item xs={9} alignItems='center'>
    <FlexGrid item style={{ marginLeft: '1rem', width: MOBILE_WIDTH }}>
      <Typography variant='h4'>{myTeamLabel}</Typography>
    </FlexGrid>
    {children}
  </Grid>
)

const MobileMyTeamFilterGroup = ({ myTeamLabel, children }: ViewpointTeamLabelGroupProps) => (
  <>
    <FlexGrid item xs={12} style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
      <Typography variant='h4'>{myTeamLabel}</Typography>
    </FlexGrid>
    <Grid container item xs={9}>
      {children}
    </Grid>
  </>
)

interface MyTeamFilterGroupProps extends CycleStationsDropdownProps {}

const MyTeamFilterGroup = ({
  showTooltipButton,
  showTeamsFilter,
  showSearchDisruptionsFilter = false
}: MyTeamFilterGroupProps) => {
  const { t } = useTranslation()
  const [isDesktopWidth] = useMediaQuery('lg')
  const { teams } = useTeams()

  const Layout = useMemo(() => (isDesktopWidth ? DesktopMyTeamFilterGroup : MobileMyTeamFilterGroup), [isDesktopWidth])

  return (
    <Grid container style={{ marginBottom: '0.5rem' }}>
      <Layout myTeamLabel={t('disruptionReview.myTeamLabel')}>
        {showTeamsFilter && (
          <Grid item>
            <TeamsDropDown teams={teams} isFilter />
          </Grid>
        )}
        <Grid item>
          <CycleStationsDropdown showTooltipButton={showTooltipButton} />
        </Grid>
      </Layout>
      {showSearchDisruptionsFilter && (
        <Grid item xs={3} style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'end' }}>
          <SearchDisruptionTemplates id='disruptions-search-autocomplete' />
        </Grid>
      )}
    </Grid>
  )
}

export default MyTeamFilterGroup
