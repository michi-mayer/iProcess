import { FC, lazy, PropsWithChildren, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { QUERY_PARAMS } from 'routes/routing'
import ErrorBoundary from 'components/Error/ErrorBoundary'
import ErrorFallback from 'components/Error/ErrorFallback'
import IProcessHeader from 'components/Header/IProcessHeader'
import NavbarContainer from 'components/Layouts/NavbarContainer'
import ProductionNavbar from 'components/Navbars/ProductionNavbar'
import OrderStatusBar from 'components/OrderStatusBar/OrderStatusBar'
import { AppGrid } from 'components/styled'
import { Shift, useIProcessState } from 'contexts/iProcessContext'

const DailyOverview = lazy(() => import('components/DailyOverview'))

interface WithShift {
  selectedshift: Shift
}

const ProductionGrid = styled(AppGrid)<WithShift>(({ selectedshift }) => ({
  height: selectedshift === Shift.dailyOverview ? 'calc(100vh - 100px)' : undefined
}))

const ShiftViewSelector: FC<PropsWithChildren<WithShift>> = ({ selectedshift, children }) =>
  selectedshift === Shift.dailyOverview ? (
    <Suspense>
      <DailyOverview />
    </Suspense>
  ) : (
    <>
      <OrderStatusBar />
      <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
    </>
  )

const ProductionContainer: FC<PropsWithChildren> = ({ children }) => {
  const [params] = useSearchParams()
  const unitId = params.get(QUERY_PARAMS.unitId)

  const { unitSelected, selectedShift, groupingSelected } = useIProcessState()

  return (
    <NavbarContainer
      navbarId='production-sidebar-container'
      id='iProcess-production'
      renderNavbar={() => <ProductionNavbar />}
      unitId={unitId}
    >
      <IProcessHeader />
      {!!groupingSelected && !!unitSelected && (
        <ProductionGrid container item xs={12} selectedshift={selectedShift}>
          <ShiftViewSelector selectedshift={selectedShift}>{children}</ShiftViewSelector>
        </ProductionGrid>
      )}
    </NavbarContainer>
  )
}

export default ProductionContainer
