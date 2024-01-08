import i18n from 'i18n/de/landing.json'
import type { Role } from 'types'

export const ROUTER = {
  LANDING: '/',
  PRODUCTION: '/production',
  ADMIN: '/admin',
  ADMIN_UNITS: 'units',
  ADMIN_PRODUCTS: 'products',
  ADMIN_DISRUPTION_CATEGORIES: 'disruption-categories',
  ADMIN_GROUPINGS: 'groupings',
  ADMIN_SHIFT_MODEL: 'shift-models',
  ADMIN_SHIFT_MODEL_PATH: '/admin/shift-models',
  ADMIN_CREATE_SHIFT_MODEL: 'create',
  ADMIN_CREATE_SHIFT_MODEL_PATH: '/admin/shift-models/create',
  ADMIN_UPDATE_SHIFT_MODEL: 'update/:shiftModelId',
  ADMIN_SHIFT_MODEL_UPDATE_PATH: '/admin/shift-models/update',
  REJECTED: '/rejected',
  TEAM_MONITOR: '/team-monitor',
  GROUPING_ID_PARAM: 'groupingId/:groupingId',
  UNIT_ID_PARAM: 'unitId/:unitId',
  TEAM_ID_PARAM: 'teamId/:teamId',
  MEASURES: '/measures',
  MEASURES_CREATE: 'create',
  MEASURES_UPDATE: '/measures/update',
  MEASURES_UPDATE_REPORTID: 'update/:reportId',
  DASHBOARD: '/dashboard',
  SHIFT_DASHBOARD: 'shift',
  SHOP_FLOOR_DASHBOARD: 'shop-floor',
  LONG_TERM_DASHBOARD: 'long-term',
  MANAGEMENT_DASHBOARD: 'management',
  ISSUE_SPECIFICATION_DASHBOARD: 'issue-specification',
  LANDING_FEEDBACK: '/feedback',
  LANDING_DATA_PRIVACY: '/data-privacy',
  LANDING_CHANGE_LOG: '/change-log',
  NOTE_TAKER: '/note-taker'
} as const

export const QUERY_PARAMS = {
  filter: 'filter',
  closed: 'closed',
  groupingId: 'groupingId',
  unitId: 'unitId',
  teamId: 'teamId',
  cycleStationId: 'cycleStationId',
  previousTeams: 'previousTeams'
} as const

export type Route = (typeof ROUTER)[keyof typeof ROUTER]
// eslint-disable-next-line unicorn/prevent-abbreviations
export type QueryParam = (typeof QUERY_PARAMS)[keyof typeof QUERY_PARAMS]

export type AppTitle = Exclude<keyof typeof i18n.applications, 'descriptions' | 'section' | 'open' | 'requestAccess'>

export type Description = keyof typeof i18n.applications.descriptions

export interface Application {
  title: AppTitle
  path: Route
  description: Description
  existsApp: boolean
  role: Role
}

// ! If you want to add a new app or a role, DO IT HERE!
export const applications: [Application, Application, Application, Application, Application] = [
  {
    title: 'production',
    path: ROUTER.PRODUCTION,
    description: 'productionDescription',
    existsApp: true,
    role: 'Standard'
  },
  {
    title: 'teamMonitor',
    path: ROUTER.TEAM_MONITOR,
    description: 'teamMonitorDescription',
    existsApp: true,
    role: 'Standard'
  },
  {
    title: 'measures',
    path: ROUTER.MEASURES,
    description: 'measuresDescription',
    existsApp: true,
    role: 'Manager'
  },
  {
    title: 'dashboard',
    path: ROUTER.DASHBOARD,
    description: 'dashboardDescription',
    existsApp: true,
    role: 'Manager'
  },
  {
    title: 'admin',
    path: ROUTER.ADMIN,
    description: 'adminDescription',
    existsApp: true,
    role: 'Admin'
  }
]

export const dashboards: [Application, Application, Application, Application, Application] = [
  {
    title: 'shiftDashboard',
    path: ROUTER.SHIFT_DASHBOARD,
    description: 'shiftDashboardDescription',
    existsApp: !!process.env.VITE_SHIFT_DASHBOARD_ID,
    role: 'Standard'
  },
  {
    title: 'shopFloorDashboard',
    path: ROUTER.SHOP_FLOOR_DASHBOARD,
    description: 'shopFloorDashboardDescription',
    existsApp: !!process.env.VITE_SHOP_FLOOR_DASHBOARD_ID,
    role: 'Manager'
  },
  {
    title: 'longTermDashboard',
    path: ROUTER.LONG_TERM_DASHBOARD,
    description: 'longTermDashboardDescription',
    existsApp: !!process.env.VITE_LONG_TERM_DASHBOARD_ID,
    role: 'Manager'
  },
  {
    title: 'managementDashboard',
    path: ROUTER.MANAGEMENT_DASHBOARD,
    description: 'managementDashboardDescription',
    existsApp: !!process.env.VITE_MANAGEMENT_DASHBOARD_ID,
    role: 'Standard'
  },
  {
    title: 'issueSpecificationDashboard',
    path: ROUTER.ISSUE_SPECIFICATION_DASHBOARD,
    description: 'issueSpecificationDashboardDescription',
    existsApp: !!process.env.VITE_ISSUE_SPECIFICATION_DASHBOARD_ID,
    role: 'Standard'
  }
]
