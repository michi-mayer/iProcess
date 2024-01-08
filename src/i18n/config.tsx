import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import BrowserLanguageDetector from 'i18next-browser-languagedetector'
// Admin
import deAdmin from './de/admin.json'
// Dashboard
import deDashboard from './de/dashboard.json'
// iProcess
import deIProcess from './de/iProcess.json'
// Landing
import deLanding from './de/landing.json'
// Measures
import deMeasures from './de/measures.json'
// Tables
import deTables from './de/tables.json'
// Team Monitor
import deTeamMonitor from './de/team-monitor.json'
import enAdmin from './en/admin.json'
import enDashboard from './en/dashboard.json'
import enIProcess from './en/iProcess.json'
import enLanding from './en/landing.json'
import enMeasures from './en/measures.json'
import enTables from './en/tables.json'
import enTeamMonitor from './en/team-monitor.json'

export const resources = {
  en: {
    iProcess: enIProcess,
    admin: enAdmin,
    landing: enLanding,
    dashboard: enDashboard,
    measures: enMeasures,
    tables: enTables,
    teamMonitor: enTeamMonitor
  },
  de: {
    iProcess: deIProcess,
    admin: deAdmin,
    landing: deLanding,
    dashboard: deDashboard,
    measures: deMeasures,
    tables: deTables,
    teamMonitor: deTeamMonitor
  }
} as const

export const locales = [
  {
    code: 'de',
    name: 'Deutsch'
  },
  {
    code: 'en',
    name: 'English'
  }
] as const

export type LanguageOption = (typeof locales)[number]
export type Locale = LanguageOption['code']

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'iProcess'
    resources: {
      iProcess: typeof deIProcess
      admin: typeof deAdmin
      landing: typeof deLanding
      dashboard: typeof deDashboard
      measures: typeof deMeasures
      tables: typeof deTables
      teamMonitor: typeof deTeamMonitor
    }
  }
}

i18n
  .use(BrowserLanguageDetector)
  .use(initReactI18next)
  .init(
    {
      ns: ['iProcess', 'admin', 'landing', 'dashboard', 'measures', 'tables'],
      supportedLngs: ['de', 'en'],
      defaultNS: 'iProcess',
      fallbackLng: 'de',
      debug: false,
      resources,
      load: 'currentOnly',
      detection: {
        lookupLocalStorage: 'locale',
        caches: ['localStorage'],
        order: ['localStorage', 'navigator']
      }
    },
    (error, t) => {
      if (error) return console.error('something went wrong loading', error)
      t('key')
    }
  )

export { default } from 'i18next'
