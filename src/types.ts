import { z } from 'zod'
import {
  ClassificationPathSchema,
  DisruptionClassificationSchema,
  DisruptionResponseSchema,
  ParetoBarDatumSchema,
  TeamSchema,
  TemplateBaseSchema,
  TemplateBaseWithTeamInfoSchema,
  UnitBaseSchema
} from 'zodSchemas'
import { AttachmentInput, IssueInput, TeamsInput, UnitType } from 'API'
import { IReportMeasureState } from 'components/Measures/ReportMeasures'
import { fetchCycleStationsByUnit } from 'hooks/services/useQueryCycleStations'
import { Nullable } from 'shared'

type CSSUnit = 'px' | 'rem' | 'em' | '%'

export type CSSUnitSize = `${number}${CSSUnit}`

export interface WithGridSize {
  xs?: number
}

export interface TemplateDashboard {
  templateId: string
  description: string
  unitId: string
  unitShortName: string
  frequency: number
  totalDuration: string
  productNumber: string
  cycleStationName?: string
  firstOccurrence: string
  classifications: string[]
}

export interface Environment {
  VITE_APP_VERSION: string
  VITE_ACCESS_KEY_ID: string
  VITE_SECRET_ACCESS_KEY: string
  VITE_SHIFT_DASHBOARD_ID: string
  VITE_SHOP_FLOOR_DASHBOARD_ID: string
  VITE_LONG_TERM_DASHBOARD_ID: string
  VITE_MANAGEMENT_DASHBOARD_ID: string
  VITE_ISSUE_SPECIFICATION_DASHBOARD_ID: string
  VITE_ADMIN_EMAIL: string
  VITE_SHOW_MEASURE_MANAGEMENT: string
  VITE_AUTH_REDIRECT: string
  VITE_AUTH_AWS_REGION: string
  VITE_AUTH_OAUTH_DOMAIN: string
  VITE_AUTH_USER_POOL_ID: string
  VITE_AUTH_USER_POOL_WEB_CLIENT_ID: string
  VITE_AUTH_PROVIDER: string
  VITE_SHOW_DEVELOPER_LOGIN: string
  VITE_CLOUD_IDP_ADMIN: string
  VITE_CLOUD_IDP_MANAGER: string
  VITE_CLOUD_IDP_STANDARD: string
}

export type DashboardID = keyof Pick<
  Environment,
  | 'VITE_SHIFT_DASHBOARD_ID'
  | 'VITE_LONG_TERM_DASHBOARD_ID'
  | 'VITE_MANAGEMENT_DASHBOARD_ID'
  | 'VITE_SHOP_FLOOR_DASHBOARD_ID'
  | 'VITE_ISSUE_SPECIFICATION_DASHBOARD_ID'
>

export type ParetoBarDatum = z.infer<typeof ParetoBarDatumSchema>

export type ReportMeasure = TemplateDashboard & IReportMeasureState

export const isFile = (data: unknown): data is File =>
  typeof data === 'object' && data !== null && 'type' in data && typeof data.type === 'string'

interface PutResult {
  key: string
}

export const isPutResult = (data: unknown): data is PutResult =>
  typeof data === 'object' && data !== null && 'key' in data && typeof data.key === 'string'

export type MutateReportMeasure = Omit<ReportMeasure, 'deletedFiles' | 'unitShortName'>

export const isReportMeasure = (data: unknown): data is MutateReportMeasure =>
  typeof data === 'object' &&
  data !== null &&
  'templateId' in data &&
  typeof data.templateId === 'string' &&
  'description' in data &&
  typeof data.description === 'string' &&
  'frequency' in data &&
  typeof data.frequency === 'number'

export const isAssemblyLine = <T extends object & { type: UnitType }>(
  unitSelected: T | undefined
): unitSelected is T & { type: UnitType.assemblyLine } => {
  return unitSelected?.type === UnitType.assemblyLine
}

export const isProductionUnit = <T extends object & { type: UnitType }>(
  unitSelected: T | undefined
): unitSelected is T & { type: UnitType.productionUnit } => {
  return !isAssemblyLine(unitSelected)
}

export type Team = z.infer<typeof TeamSchema>
export type UnitBase = z.infer<typeof UnitBaseSchema>
export type TemplateBase = z.infer<typeof TemplateBaseSchema>
export type TemplateBaseWithOriginator = z.infer<typeof TemplateBaseWithTeamInfoSchema>
export type DisruptionClassifications = z.infer<typeof DisruptionClassificationSchema>
export type ClassificationPath = z.infer<typeof ClassificationPathSchema>[]

export interface Value<T = string | undefined> {
  id: string
  value: T
}

export interface RenderValue<T extends string | number = string | number> extends Value<T> {
  name: string
}

export interface Template extends TemplateBase {
  cycleStationId: string
  cycleStationName?: string
  originatorTeam?: Team
}

export interface Disruption extends Omit<Template, 'id' | 'description'> {
  partId?: string
  unitId?: string
  description?: string
  id?: string
  lostVehicles?: number
  startTimeDate?: string
  endTimeDate?: string
  duration?: string
  measures?: string
  templateId?: string
  startTimeDateUTC?: string
  endTimeDateUTC?: string
  timeZone?: string
  issues?: Nullable<IssueInput[]>
  attachments?: AttachmentInput[]
  team?: Team
  updatedAt?: string
  m100?: number
  isSolved: boolean
}

export const isDisruption = (item: Template | Disruption): item is Disruption => {
  return 'templateId' in item
}

export interface DisruptionWithTemplateData extends Disruption {
  description: string
  templateId: string
  startTimeDate: string
  updatedAt: string
}

export type DisruptionResponse = z.infer<typeof DisruptionResponseSchema>

export type CycleStation = Awaited<ReturnType<typeof fetchCycleStationsByUnit>>[0] & {
  teamId?: Nullable<string>
}
export type TeamAndCycleStations = Omit<TeamsInput, 'cycleStations'> & { unitId: string; cycleStations: CycleStation[] }

export type Role = 'Standard' | 'Manager' | 'Admin'
