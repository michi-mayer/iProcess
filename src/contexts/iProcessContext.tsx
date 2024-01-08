import { createContext, ReactNode, useContext, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { CycleStation, RenderValue, Team, Value } from 'types'
import {
  actualCount,
  Bool,
  Configuration,
  CreatePartInput,
  CreatePartUnitInput,
  CreateScheduleHourInput,
  CreateShiftModelInput,
  LambdaGroupingInput,
  M100RangeInput,
  UnitInput,
  UnitProblemClassification
} from 'API'
import { REMOVE_VALUE } from 'helper/constants'
import useMonitorState from 'hooks/useMonitorState'
import { Nullable, WithID } from 'shared'
import { ALL_CYCLE_STATIONS } from 'shared/constants'

export interface ExtendedScheduleHour extends Omit<CreateScheduleHourInput, 'downtime'> {
  hoursEnd?: string
  hoursStart?: string
  quota?: number | null
}

export interface ExtendedShiftModel extends CreateShiftModelInput {
  id?: string
  createdAt?: string
  scheduleHours: ExtendedScheduleHour[]
}

export interface Classification extends Value<string> {
  options?: Classification[]
}

export interface SpeedMode extends RenderValue<number> {}

export interface ExtendedUnit extends Omit<UnitInput, 'speedModes' | 'cycleStations' | 'id' | 'm100Range' | 'teams'> {
  id?: string
  classificationPath?: Classification[]
  unitDisruptionClassification?: UnitProblemClassification
  groupingId?: Nullable<string>
  groupingName?: string
  shiftModels?: ExtendedShiftModel[]
  createdAt?: string
  speedModeCollection?: SpeedMode[]
  m100Range?: M100RangeInput
  teams?: Team[]
}

export interface UnitBasicInfo extends Pick<UnitInput, 'shortName' | 'name' | 'type'>, WithID {}

export interface ExtendedGrouping extends Partial<Omit<LambdaGroupingInput, 'unitsIds' | 'subDepartmentIds'>> {
  id?: string
  name?: string
  units?: (ExtendedUnit & WithID)[]
  selectedUnits?: UnitBasicInfo[]
  selectedSubDepartments?: string[]
  createdAt?: string
}

export interface Department {
  id: string
}

export interface QualityIssueConfig {
  hasQualityIssueConfig?: Bool
  partImageKeyFront?: string
  partImageKeyBack?: string
  nioClassificationLocation?: Classification[]
  nioClassificationDamageType?: Classification[]
  nioClassificationErrorSource?: Classification[]
}

export const getQualityIssueConfig = ({ hasQualityIssueConfig, ...rest }: QualityIssueConfig) =>
  hasQualityIssueConfig === Bool.yes ? JSON.stringify(rest) : REMOVE_VALUE

export interface ExtendedProductUnit extends Partial<Omit<CreatePartUnitInput, 'targetCycleTime'>> {
  unit?: Partial<ExtendedUnit>[]
}

export interface ExtendedProduct
  extends Omit<Partial<CreatePartInput>, 'imageFront' | 'imageBack'>,
    QualityIssueConfig {
  productUnit?: ExtendedProductUnit[]
  targetCycleTimeAndUnitPart?: Map<string, number | undefined>
  targetCycleTime?: number
  createdAt?: string
}

export interface GetStartEndDateForShift {
  startDateTime: string
  endDateTime: string
}

export interface ExtendedScheduleSlot extends actualCount {
  dateTimeStart: string
  dateTimeEnd: string
  partByScheduleSlot: ExtendedProduct
  shiftModel: ExtendedShiftModel
  i: number
}

/** @deprecated use {@link Shift} from API */
export enum ShiftTranslator {
  morningShift = 0,
  afternoonShift = 1,
  nightShift = 2,
  dailyOverview = 3
}

/** @deprecated use {@link Shift} from API */
export enum Shift {
  morningShift,
  afternoonShift,
  nightShift,
  dailyOverview
}

export interface UnitConfiguration extends Omit<Configuration, '__typename'> {
  validFromUTC: string
  validUntilUTC: string
}

export type ConfiguratorRecord = Record<string, UnitConfiguration[]>
export type PreviousConfiguratorRecord = Record<string, UnitConfiguration | undefined>

export interface ShiftTimeRange {
  startTime: string
  endTime: string
  dateTimeStart: string
  dateTimeEnd: string
  dateTimeStartUTC: string
  dateTimeEndUTC: string
  workStartDateTimeUTC: string
  workEndDateTimeUTC: string
  workStartDateTime: string
  workEndDateTime: string
  morningShiftStart: moment.Moment
  afternoonShiftStart: moment.Moment
  nightShiftStart: moment.Moment
}

interface State {
  unitSelected: ExtendedUnit | undefined
  cycleStationSelected: CycleStation | undefined
  productSelected: ExtendedProduct
  replacerSelected: boolean
  currentShift: Shift
  selectedShift: Shift
  selectedTeam: Team | undefined
  currentDate: string
  currentTime: string
  selectedShiftTab: number
  currentShiftTab: number
  currentPauseTab: number
  ioCount: number | undefined
  nioCount: number | undefined
  groupingSelected: ExtendedGrouping | undefined
  timeZone: string
  shiftModelSelected: ExtendedShiftModel | undefined
  configurationByUnitId: ConfiguratorRecord
  previousShiftConfiguration: PreviousConfiguratorRecord
  currentShiftScheduleSlots: ExtendedScheduleSlot[] | undefined
  previousShiftScheduleSlots: ExtendedScheduleSlot[] | undefined
  shiftTimeRange: ShiftTimeRange | undefined
  isSorting: boolean
}

type Action =
  | { type: 'updateUnit'; updateUnitTrigger: boolean }
  | { type: 'unitSelected'; unitSelected: ExtendedUnit | undefined }
  | { type: 'cycleStationSelected'; cycleStationSelected: CycleStation | undefined }
  | { type: 'productSelected'; productSelected: ExtendedProduct }
  | { type: 'replacerSelected'; replacerSelected: boolean }
  | { type: 'currentShift'; currentShift: Shift }
  | { type: 'selectedShift'; selectedShift: Shift }
  | { type: 'selectedTeam'; selectedTeam: Team | undefined }
  | { type: 'currentDate'; currentDate: string }
  | { type: 'currentTime'; currentTime: string }
  | { type: 'selectedShiftTab'; selectedShiftTab: number }
  | { type: 'currentShiftTab'; currentShiftTab: number }
  | { type: 'currentPauseTab'; currentPauseTab: number }
  | { type: 'ioCount'; ioCount: number | undefined }
  | { type: 'nioCount'; nioCount: number | undefined }
  | { type: 'groupingSelected'; groupingSelected: ExtendedGrouping | undefined }
  | { type: 'timeZone'; timeZone: string }
  | { type: 'shiftModelSelected'; shiftModelSelected: ExtendedShiftModel | undefined }
  | { type: 'configurationByUnitId'; configurationByUnitId: ConfiguratorRecord }
  | { type: 'previousShiftConfiguration'; previousShiftConfiguration: PreviousConfiguratorRecord }
  | { type: 'reduxDevtools'; state: State }
  | { type: 'currentShiftScheduleSlots'; currentShiftScheduleSlots: ExtendedScheduleSlot[] | undefined }
  | { type: 'previousShiftScheduleSlots'; previousShiftScheduleSlots: ExtendedScheduleSlot[] | undefined }
  | { type: 'shiftTimeRange'; shiftTimeRange: ShiftTimeRange }
  | { type: 'isSorting'; isSorting: boolean }

export type Dispatch = (action: Action) => void

interface ScheduleProviderProps {
  children: ReactNode
}

const StateContext = createContext<State | undefined>(undefined)
const DispatchContext = createContext<Dispatch | undefined>(undefined)

const iProcessReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'unitSelected':
      return { ...state, [action.type]: action[action.type] }

    case 'cycleStationSelected':
      return { ...state, [action.type]: action[action.type] }

    case 'productSelected':
      return { ...state, [action.type]: action[action.type] }

    case 'replacerSelected':
      return { ...state, [action.type]: action[action.type] }

    case 'shiftModelSelected':
      return { ...state, [action.type]: action[action.type] }

    case 'selectedShift':
      return { ...state, [action.type]: action[action.type] }

    case 'selectedTeam':
      return { ...state, [action.type]: action[action.type] }

    case 'currentShift':
      return { ...state, [action.type]: action[action.type] }

    case 'currentDate':
      return { ...state, [action.type]: action[action.type] }

    case 'currentTime':
      return { ...state, [action.type]: action[action.type] }

    case 'selectedShiftTab':
      return { ...state, [action.type]: action[action.type] }

    case 'currentShiftTab':
      return { ...state, [action.type]: action[action.type] }

    case 'currentPauseTab':
      return { ...state, [action.type]: action[action.type] }

    case 'ioCount':
      return { ...state, [action.type]: action[action.type] }

    case 'nioCount':
      return { ...state, [action.type]: action[action.type] }

    case 'groupingSelected':
      return { ...state, [action.type]: action[action.type] }

    case 'timeZone':
      return { ...state, [action.type]: action[action.type] }

    case 'configurationByUnitId':
      return { ...state, [action.type]: action[action.type] }

    case 'previousShiftConfiguration':
      return { ...state, [action.type]: action[action.type] }

    case 'currentShiftScheduleSlots':
      return { ...state, [action.type]: action[action.type] }

    case 'previousShiftScheduleSlots':
      return { ...state, [action.type]: action[action.type] }

    case 'shiftTimeRange':
      return { ...state, [action.type]: action[action.type] }

    case 'isSorting':
      return { ...state, [action.type]: action[action.type] }

    case 'reduxDevtools': {
      return action.state
    }

    default:
      throw new Error('iProcess Context Action not accepted')
  }
}

const IProcessProvider = ({ children }: ScheduleProviderProps) => {
  const { t } = useTranslation('iProcess')
  const [state, dispatch] = useReducer(iProcessReducer, {
    unitSelected: undefined,
    cycleStationSelected: { ...ALL_CYCLE_STATIONS, name: t('disruptionReview.allDisruptions') },
    productSelected: {},
    replacerSelected: false,
    shiftModelSelected: undefined,
    currentShift: Shift.morningShift,
    selectedShift: Shift.morningShift,
    selectedTeam: undefined,
    currentDate: '01.01.2021',
    currentTime: '15:00',
    selectedShiftTab: -1,
    currentShiftTab: -1,
    currentPauseTab: -1,
    ioCount: undefined,
    nioCount: undefined,
    groupingSelected: undefined,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    configurationByUnitId: {},
    previousShiftConfiguration: {},
    currentShiftScheduleSlots: undefined,
    previousShiftScheduleSlots: undefined,
    shiftTimeRange: undefined,
    isSorting: false
  })

  useMonitorState('iProcess Context', state, dispatch)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  )
}

const useIProcessState = () => {
  const context = useContext(StateContext)
  if (context === undefined) {
    throw new Error('useIProcessState must be used within the IProcessProvider')
  }
  return context
}

const useIProcessDispatch = () => {
  const context = useContext(DispatchContext)
  if (context === undefined) {
    throw new Error('useIProcessDispatch must be used within the IProcessProvider')
  }
  return context
}

export { IProcessProvider, useIProcessState, useIProcessDispatch }
