import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import { Auth } from '@aws-amplify/auth'
import { AmplifyProvider, Authenticator } from '@aws-amplify/ui-react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Changelog from 'routes/landing/Changelog'
import { Login } from './components/Login'
import { authConfig, AuthProvider } from './contexts/authContext'
import { IProcessProvider } from './contexts/iProcessContext'
import { queryClient } from './react-query/queryClient'
import Overview from './routes/landing/Overview'
import { applications, ROUTER } from './routes/routing'
import { ShiftModelErrorBoundary } from 'components/Error/ShiftModelErrorBoundary'
import ProtectedRoute from 'components/ProtectedRoute'
import SideBarProvider from 'contexts/sidebarStore'
import './i18n/config'
import { amplifyUiTheme, theme as muiTheme } from './theme'
import './App.css'
import '@aws-amplify/ui-react/styles.css'
import './index.css'

const Production = lazy(() => import('./routes/production/Production'))
const TeamMonitor = lazy(() => import('./routes/team-monitor'))
const MeasuresApp = lazy(() => import('./routes/measures/MeasuresApp'))
const AdminApp = lazy(() => import('./routes/admin'))

const router = createBrowserRouter([
  {
    path: ROUTER.LANDING,
    async lazy() {
      const { default: Landing } = await import('./routes/index')
      return { Component: Landing }
    },
    children: [
      {
        path: ROUTER.LANDING,
        element: <Overview />
      },
      {
        path: ROUTER.LANDING_CHANGE_LOG,
        element: <Changelog />
      }
    ]
  },
  {
    path: ROUTER.PRODUCTION,
    element: (
      <ProtectedRoute allowedRole={applications[0].role}>
        <IProcessProvider>
          <SideBarProvider>
            <Suspense>
              <Production />
            </Suspense>
          </SideBarProvider>
        </IProcessProvider>
      </ProtectedRoute>
    )
  },
  {
    path: ROUTER.TEAM_MONITOR,
    element: (
      <ProtectedRoute allowedRole={applications[1].role}>
        <IProcessProvider>
          <SideBarProvider>
            <Suspense>
              <TeamMonitor />
            </Suspense>
          </SideBarProvider>
        </IProcessProvider>
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTER.GROUPING_ID_PARAM,
        children: [
          {
            path: ROUTER.UNIT_ID_PARAM,
            children: [
              {
                path: ROUTER.TEAM_ID_PARAM,
                async lazy() {
                  const { default: TeamMonitorOverview } = await import('./components/TeamMonitor/Overview')
                  return { Component: TeamMonitorOverview }
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: ROUTER.MEASURES,
    element: (
      <ProtectedRoute allowedRole={applications[2].role}>
        <Suspense>
          <MeasuresApp />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        async lazy() {
          const { default: ReportMeasuresOverview } = await import('./components/Measures/ReportMeasuresOverview')
          return { Component: ReportMeasuresOverview }
        }
      },
      {
        path: ROUTER.MEASURES_CREATE,
        async lazy() {
          const { default: MeasuresCreateEdit } = await import('./components/Measures/MeasuresCreateEdit')
          return { Component: MeasuresCreateEdit }
        }
      },
      {
        path: ROUTER.MEASURES_UPDATE_REPORTID,
        async lazy() {
          const { default: MeasuresCreateEdit } = await import('./components/Measures/MeasuresCreateEdit')
          return { Component: MeasuresCreateEdit }
        }
      },
      {
        path: '*',
        element: <Navigate to={ROUTER.MEASURES} replace />
      }
    ]
  },
  {
    path: ROUTER.ADMIN,
    element: (
      <ProtectedRoute allowedRole={applications[4].role}>
        <Suspense>
          <AdminApp />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTER.ADMIN_UNITS} replace />
      },
      {
        path: ROUTER.ADMIN_UNITS,
        async lazy() {
          const { default: UnitsSection } = await import('./routes/admin/units')
          return { Component: UnitsSection }
        }
      },
      {
        path: ROUTER.ADMIN_PRODUCTS,
        async lazy() {
          const { default: ProductsSection } = await import('./routes/admin/products')
          return { Component: ProductsSection }
        }
      },
      {
        path: ROUTER.ADMIN_DISRUPTION_CATEGORIES,
        async lazy() {
          const { default: DisruptionsSection } = await import('./routes/admin/disruption-categories')
          return { Component: DisruptionsSection }
        }
      },
      {
        path: ROUTER.ADMIN_GROUPINGS,
        async lazy() {
          const { default: GroupingsSection } = await import('./routes/admin/groupings')
          return { Component: GroupingsSection }
        }
      },
      {
        path: ROUTER.ADMIN_SHIFT_MODEL,
        async lazy() {
          const { default: ShiftModelsSection } = await import('./routes/admin/shift-models')
          return { Component: ShiftModelsSection }
        },
        children: [
          {
            path: ROUTER.ADMIN_CREATE_SHIFT_MODEL,
            async lazy() {
              const { default: ShiftModelForm } = await import('./components/Dialogs/Admin/ShiftModelForm')
              return { Component: ShiftModelForm }
            }
          },
          {
            path: ROUTER.ADMIN_UPDATE_SHIFT_MODEL,
            async lazy() {
              const { default: ShiftModelForm } = await import('./components/Dialogs/Admin/ShiftModelForm')
              return { Component: ShiftModelForm }
            },
            errorElement: <ShiftModelErrorBoundary />
          }
        ]
      }
    ]
  },
  {
    path: ROUTER.DASHBOARD,
    element: (
      <ProtectedRoute allowedRole={applications[3].role}>
        <Suspense>
          <Outlet />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTER.DASHBOARD,
        async lazy() {
          const { default: Overview } = await import('./routes/dashboard')
          return { Component: Overview }
        }
      },
      {
        path: ROUTER.SHIFT_DASHBOARD,
        async lazy() {
          const { default: Dashboard } = await import('./components/Dashboard')
          return { element: <Dashboard dashboardId={process.env.VITE_SHIFT_DASHBOARD_ID} /> }
        }
      },
      {
        path: ROUTER.SHOP_FLOOR_DASHBOARD,
        async lazy() {
          const { default: Dashboard } = await import('./components/Dashboard')
          return { element: <Dashboard dashboardId={process.env.VITE_SHOP_FLOOR_DASHBOARD_ID} /> }
        }
      },
      {
        path: ROUTER.LONG_TERM_DASHBOARD,
        async lazy() {
          const { default: Dashboard } = await import('./components/Dashboard')
          return { element: <Dashboard dashboardId={process.env.VITE_LONG_TERM_DASHBOARD_ID} showParetoDiagram /> }
        }
      },
      {
        path: ROUTER.MANAGEMENT_DASHBOARD,
        async lazy() {
          const { default: Dashboard } = await import('./components/Dashboard')
          return { element: <Dashboard dashboardId={process.env.VITE_MANAGEMENT_DASHBOARD_ID} /> }
        }
      },
      {
        path: ROUTER.ISSUE_SPECIFICATION_DASHBOARD,
        async lazy() {
          const { default: Dashboard } = await import('./components/Dashboard')
          return { element: <Dashboard dashboardId={process.env.VITE_ISSUE_SPECIFICATION_DASHBOARD_ID} /> }
        }
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to={ROUTER.LANDING} replace />
  }
])

const App = () => {
  Auth.configure(authConfig)

  return (
    <Authenticator components={Login} hideSignUp={true}>
      <QueryClientProvider client={queryClient}>
        <AmplifyProvider theme={amplifyUiTheme}>
          <ThemeProvider theme={muiTheme}>
            <AuthProvider>
              {/* React Router */}
              <RouterProvider router={router} />
            </AuthProvider>
          </ThemeProvider>
        </AmplifyProvider>
        <ReactQueryDevtools initialIsOpen={false} position='bottom' />
      </QueryClientProvider>
    </Authenticator>
  )
}

export default App
