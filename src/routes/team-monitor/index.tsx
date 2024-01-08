import { Outlet, useParams } from 'react-router'
import ErrorBoundary from 'components/Error/ErrorBoundary'
import ErrorFallback from 'components/Error/ErrorFallback'
import IProcessHeader from 'components/Header/IProcessHeader'
import NavbarContainer from 'components/Layouts/NavbarContainer'
import TeamMonitorNavbar from 'components/Navbars/TeamMonitorNavbar'
import { AppGrid } from 'components/styled'
import { useIProcessState } from 'contexts/iProcessContext'
import useTeams from 'hooks/useTeams'

const TeamMonitor = () => {
  const { unitId } = useParams()

  const { groupingSelected, unitSelected } = useIProcessState()
  const { teams } = useTeams()
  return (
    <NavbarContainer
      navbarId='team-monitor-sidebar-container'
      id='iProcess-team-monitor'
      renderNavbar={() => <TeamMonitorNavbar />}
      unitId={unitId}
    >
      {!!groupingSelected && !!unitSelected && (
        <AppGrid container item xs={12}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <IProcessHeader showDailyOverview={false} teams={teams} />
            <Outlet />
          </ErrorBoundary>
        </AppGrid>
      )}
    </NavbarContainer>
  )
}

export default TeamMonitor
