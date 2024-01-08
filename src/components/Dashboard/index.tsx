import { HTMLAttributes, lazy, Suspense, useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { useQueryClient } from '@tanstack/react-query'
import {
  type ContentOptions,
  createEmbeddingContext,
  type DashboardExperience,
  type EmbeddingContext,
  type FrameOptions
} from 'amazon-quicksight-embedding-sdk'
import { ROUTER } from 'routes/routing'
import MainHeader from 'components/Header/MainHeader'
import MainContainer from 'components/Layouts/MainContainer'
import { ParetoFlexDiv } from 'components/styled'
import ParetoProvider from 'contexts/paretoStore'
import { DASHBOARD_HEIGHT } from 'helper/constants'
import useQueryGetQuickSightUrl from 'hooks/services/useQueryGetQuickSightUrl'
import { NonEmptyString } from 'shared'

const ParetoDiagram = lazy(() => import('./ParetoDiagram'))

interface EmbeddingProps extends HTMLAttributes<HTMLDivElement> {
  dashboardURL: string | undefined
}

const Embedding = ({ dashboardURL, ...props }: EmbeddingProps) => {
  const [context, setContext] = useState<EmbeddingContext>()
  const [dashboard, setDashboard] = useState<DashboardExperience | undefined>(undefined)

  useEffect(() => {
    const createContext = async () => {
      const context = await createEmbeddingContext()
      setContext(context)
    }

    createContext()

    return () => {
      dashboard?.reset()
      setDashboard(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (context && !dashboard) {
      const frameOptions: FrameOptions = {
        url: NonEmptyString.parse(dashboardURL),
        container: '#dashboard-embedding',
        height: DASHBOARD_HEIGHT, // * parent element's height
        width: '100%'
      }

      const contentOptions: ContentOptions = {
        toolbarOptions: {
          export: false,
          undoRedo: false,
          reset: false
        }
      }

      const createDashBoard = async () => {
        const dashboard1 = await context.embedDashboard(frameOptions, contentOptions)
        setDashboard(dashboard1)
      }
      createDashBoard()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, dashboard])

  return <div id='dashboard-embedding' role='main' {...props} />
}

interface DashboardProps extends Omit<EmbeddingProps, 'dashboardURL'> {
  dashboardId: string | undefined
  showParetoDiagram?: boolean
}

const Dashboard = ({ dashboardId, showParetoDiagram = false, ...props }: DashboardProps) => {
  const queryClient = useQueryClient()
  const { data: dashboardURL, isPending } = useQueryGetQuickSightUrl({ dashboardId })

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['FetchQuickSightURL'] })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MainContainer>
      <MainHeader navigateTo={ROUTER.DASHBOARD} />
      {isPending ? (
        <ParetoFlexDiv style={{ position: 'absolute' }}>
          <CircularProgress color='primary' size={100} thickness={1} variant='indeterminate' />
        </ParetoFlexDiv>
      ) : (
        <>
          {dashboardURL && <Embedding dashboardURL={dashboardURL} {...props} />}
          {showParetoDiagram && (
            <Suspense>
              <ParetoProvider>
                <ParetoDiagram />
              </ParetoProvider>
            </Suspense>
          )}
        </>
      )}
    </MainContainer>
  )
}

export default Dashboard
