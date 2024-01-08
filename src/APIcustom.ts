import { ClassificationPath, Team } from 'types'
import { AttachmentInput, Bool, CalculateDisruptionKPIsInput, MeasureReport, TargetCycleTimeInput } from 'API'
import {
  Classification,
  ExtendedProduct,
  ExtendedUnit,
  Shift,
  ShiftTimeRange,
  UnitBasicInfo
} from 'contexts/iProcessContext'
import { Must, WithID } from 'shared'

export interface ExtendedProductWithUnits
  extends Omit<ExtendedProduct, 'targetCycleTime' | 'targetCycleTimeAndUnitPart'> {
  selectedUnits?: UnitBasicInfo[]
  selectedSubDepartments?: string[]
  units?: (ExtendedUnit & WithID)[] | undefined
  unitsConfig?: TargetCycleTimeInput[]
  hasQualityIssueConfig?: Bool
}

export interface BaseUnit
  extends Pick<ExtendedUnit, 'createdAt' | 'groupingId' | 'manufacturer' | 'name' | 'shortName' | 'type'>,
    WithID {
  machineId?: string
}

export interface DisruptionClassification {
  selectedUnits?: UnitBasicInfo[]
  classification?: string | undefined
  id?: string
  units?: (ExtendedUnit & WithID)[]
  classificationPath?: Classification[]
  createdAt?: string
}

export interface DisruptionDialogForm extends Pick<DisruptionClassification, 'selectedUnits' | 'id'> {
  classificationPath: ClassificationPath
  categoryIndex: number
  reasonIndex: number
}

export interface ScheduleStateProps {
  selectedShift: Shift
  unitSelected: ExtendedUnit | undefined
  productSelected: ExtendedProductWithUnits
  timeZone: string
  shiftTimeRange: ShiftTimeRange | undefined
  selectedTeam?: Team
}

export interface Measure
  extends Must<Pick<MeasureReport, 'id' | 'description' | 'subDepartment' | 'status' | 'dueDate'>> {
  reportId?: string
  attachments?: AttachmentInput[]
}

export interface Cause {
  id: string
  cause: string
}

export type MustCalculateDisruptionKPIsInput = Must<CalculateDisruptionKPIsInput>
