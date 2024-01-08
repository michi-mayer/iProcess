import { Outlet } from 'react-router-dom'
import MainHeader from 'components/Header/MainHeader'
import MainContainer from 'components/Layouts/MainContainer'
import { Option } from 'components/Measures/ReportFilter'
import { OutletContainer } from 'components/styled'
import createStore from 'contexts/createStore'

// Context
const { Provider, useStore } = createStore<{ options: Option[]; searchInput: string }>({
  initialState: {
    options: [],
    searchInput: ''
  },
  useURLParams: true
})

export const useStoreReport = useStore

const MeasuresApp = () => {
  return (
    <MainContainer>
      <MainHeader />
      <OutletContainer item xs={12} style={{ height: 'calc(100vh - 4rem)' }}>
        <Provider>
          <Outlet />
        </Provider>
      </OutletContainer>
    </MainContainer>
  )
}

export default MeasuresApp
