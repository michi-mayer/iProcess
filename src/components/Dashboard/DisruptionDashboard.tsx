import { Box, Grid } from '@mui/material'
import DisruptionTabs, { DisruptionTemplatesStore } from './Tabs/DisruptionTabs'
import TimeTabs from 'components/TimeTabs/TimeTabs'
import createStore from 'contexts/createStore'
import { Shift, useIProcessState } from 'contexts/iProcessContext'
import DashboardContainer from './DashboardContainer'

const { Provider: DisruptionTemplatesProvider, useStore: useStoreTemplates } = createStore<DisruptionTemplatesStore>({
  initialState: { templates: [], previousTeamTemplates: [], searchInput: '', clickedOption: undefined }
})

export const useStoreDisruptionTemplates = useStoreTemplates

const TemplateDashboard = () => {
  const { selectedShift } = useIProcessState()

  return (
    <DashboardContainer>
      <Box style={{ height: '100%' }}>
        {selectedShift !== Shift.dailyOverview && (
          <Grid id='time-tabs-grid' container style={{ marginBottom: '1rem' }}>
            <TimeTabs />
          </Grid>
        )}
        <Grid id='dashboard-grid' container>
          <DisruptionTemplatesProvider>
            <DisruptionTabs />
          </DisruptionTemplatesProvider>
        </Grid>
      </Box>
    </DashboardContainer>
  )
}

export default TemplateDashboard
