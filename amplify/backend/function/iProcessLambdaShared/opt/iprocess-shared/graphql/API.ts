/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type TimeRange = {
  startDateTime: string,
  endDateTime: string,
};

export type OEE = {
  __typename: "OEE",
  id: string,
  startTimeDateUTC: string,
  endTimeDateUTC: string,
  timeZone?: string | null,
  overall?: number | null,
  availability?: number | null,
  performance?: number | null,
  quality?: number | null,
  actualCountSum?: number | null,
  quotaSum?: number | null,
  netOperatingTimeInMinutes?: number | null,
  targetCycleTimeInMinutes?: number | null,
  disruptionDurationSum?: number | null,
  defectiveCountSum?: number | null,
  unitId: string,
  shiftType?: Shift | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  unit?: Unit | null,
};

export enum Shift {
  morningShift = "morningShift",
  afternoonShift = "afternoonShift",
  nightShift = "nightShift",
}


export type Unit = {
  __typename: "Unit",
  id: string,
  name: string,
  shortName: string,
  type: UnitType,
  manufacturer?: string | null,
  speedModes?: string | null,
  groupingId?: string | null,
  unitUserSettingId?: string | null,
  unitProblemClassificationId?: string | null,
  m100Range?: M100Range | null,
  machineId: string,
  createdAt: string,
  updatedAt: string,
  templates?: ModeldisruptionConnection | null,
  grouping?: Grouping | null,
  teams?: ModelTeamConnection | null,
  cycleStations?: ModelCycleStationConnection | null,
  unitProblemClassification?: UnitProblemClassification | null,
  unitUserSetting?: UnitUserSetting | null,
  parts?: ModelPartUnitConnection | null,
  shiftModels?: ModelShiftModelUnitConnection | null,
};

export enum UnitType {
  assemblyLine = "assemblyLine",
  productionUnit = "productionUnit",
}


export type M100Range = {
  __typename: "M100Range",
  min: number,
  max: number,
};

export type ModeldisruptionConnection = {
  __typename: "ModeldisruptionConnection",
  items:  Array<disruption | null >,
  nextToken?: string | null,
};

export type disruption = {
  __typename: "disruption",
  id: string,
  unitId: string,
  cycleStationId: string,
  teamId?: string | null,
  originatorId?: string | null,
  disLocation?: string | null,
  disLocationSpecification?: string | null,
  disLocationType?: string | null,
  description: string,
  startTimeDateUTC: string,
  endTimeDateUTC: string,
  timeZone?: string | null,
  duration?: string | null,
  measures?: string | null,
  partId?: string | null,
  template: Bool,
  templateId: string,
  deleted: Bool,
  shiftType?: Shift | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  lostVehicles?: number | null,
  issues?:  Array<Issue > | null,
  attachments?:  Array<Attachment > | null,
  m100?: number | null,
  index?: number | null,
  isSolved?: Bool | null,
  team?: Team | null,
  originatorTeam?: Team | null,
  cycleStation?: CycleStation | null,
  unit?: Unit | null,
};

export enum Bool {
  yes = "yes",
  no = "no",
}


export type Issue = {
  __typename: "Issue",
  id: string,
  name: string,
  index: number,
};

export type Attachment = {
  __typename: "Attachment",
  key: string,
  type: string,
  size: number,
  uploadedBy: string,
  createdAt: string,
};

export type Team = {
  __typename: "Team",
  id: string,
  name: string,
  unitId: string,
  index: number,
  createdAt: string,
  updatedAt: string,
  templates?: ModeldisruptionConnection | null,
  cycleStations?: ModelCycleStationConnection | null,
  unit?: Unit | null,
};

export type ModelCycleStationConnection = {
  __typename: "ModelCycleStationConnection",
  items:  Array<CycleStation | null >,
  nextToken?: string | null,
};

export type CycleStation = {
  __typename: "CycleStation",
  id: string,
  unitId: string,
  teamId?: string | null,
  name: string,
  isActive: Bool,
  index: number,
  createdAt: string,
  updatedAt: string,
  templates?: ModeldisruptionConnection | null,
  team?: Team | null,
  unit?: Unit | null,
};

export type Grouping = {
  __typename: "Grouping",
  id: string,
  groupingName: string,
  allowedDepartments?: Array< string > | null,
  createdAt: string,
  updatedAt: string,
  units?: ModelUnitConnection | null,
};

export type ModelUnitConnection = {
  __typename: "ModelUnitConnection",
  items:  Array<Unit | null >,
  nextToken?: string | null,
};

export type ModelTeamConnection = {
  __typename: "ModelTeamConnection",
  items:  Array<Team | null >,
  nextToken?: string | null,
};

export type UnitProblemClassification = {
  __typename: "UnitProblemClassification",
  id: string,
  classification?: string | null,
  createdAt: string,
  updatedAt: string,
  units?: ModelUnitConnection | null,
};

export type UnitUserSetting = {
  __typename: "UnitUserSetting",
  id: string,
  replacer?: Bool | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelPartUnitConnection = {
  __typename: "ModelPartUnitConnection",
  items:  Array<PartUnit | null >,
  nextToken?: string | null,
};

export type PartUnit = {
  __typename: "PartUnit",
  id: string,
  unitId: string,
  partId: string,
  targetCycleTime?: number | null,
  createdAt: string,
  updatedAt: string,
  unit?: Unit | null,
  part?: Part | null,
};

export type Part = {
  __typename: "Part",
  id: string,
  partNumber: string,
  name: string,
  qualityIssueConfig?: string | null,
  imageFront?: string | null,
  imageBack?: string | null,
  createdAt: string,
  updatedAt: string,
  units?: ModelPartUnitConnection | null,
};

export type ModelShiftModelUnitConnection = {
  __typename: "ModelShiftModelUnitConnection",
  items:  Array<ShiftModelUnit | null >,
  nextToken?: string | null,
};

export type ShiftModelUnit = {
  __typename: "ShiftModelUnit",
  id: string,
  unitId: string,
  shiftModelId: string,
  createdAt: string,
  updatedAt: string,
  unit?: Unit | null,
  shiftModel?: ShiftModel | null,
};

export type ShiftModel = {
  __typename: "ShiftModel",
  id: string,
  name: string,
  isActive: Bool,
  timeZone: string,
  createdAt: string,
  updatedAt: string,
  scheduleHours?: ModelScheduleHourConnection | null,
  units?: ModelShiftModelUnitConnection | null,
};

export type ModelScheduleHourConnection = {
  __typename: "ModelScheduleHourConnection",
  items:  Array<ScheduleHour | null >,
  nextToken?: string | null,
};

export type ScheduleHour = {
  __typename: "ScheduleHour",
  id: string,
  shiftType: Shift,
  type: Type,
  hoursStartUTC: string,
  hoursEndUTC: string,
  downtime?: string | null,
  timeZone: string,
  shiftModelId: string,
  i: number,
  createdAt: string,
  updatedAt: string,
};

export enum Type {
  Production = "Production",
  Pause = "Pause",
  ShiftChange = "ShiftChange",
  Inactive = "Inactive",
}


export type MeasureReportInput = {
  id?: string | null,
  description: string,
  templateId: string,
  notes?: string | null,
  firstOccurrence: string,
  productNumber: string,
  totalDuration: string,
  frequency: number,
  unitId: string,
  classifications: string,
  cycleStationName: string,
  isCritical: Bool,
  progress: Progress,
  attachments?: string | null,
  what?: string | null,
  when?: string | null,
  where?: string | null,
  causes?: string | null,
  measures: Array< MeasureInput >,
};

export enum Progress {
  Open = "Open",
  InProgress = "InProgress",
  Completed = "Completed",
}


export type MeasureInput = {
  id: string,
  reportId?: string | null,
  subDepartment: string,
  status: Status,
  dueDate: string,
  description: string,
  attachments?: string | null,
};

export enum Status {
  Described = "Described",
  Defined = "Defined",
  Planned = "Planned",
  Implemented = "Implemented",
  Solved = "Solved",
  Unsolved = "Unsolved",
}


export type DeleteInput = {
  id: string,
};

export type ProductInput = {
  id?: string | null,
  name: string,
  number: string,
  qualityIssueConfig?: string | null,
  unitsConfig: Array< TargetCycleTimeInput >,
};

export type TargetCycleTimeInput = {
  unitId: string,
  targetCycleTime: number,
};

export type UnitInput = {
  id?: string | null,
  name: string,
  shortName: string,
  type: UnitType,
  m100Range?: M100RangeInput | null,
  manufacturer?: string | null,
  speedModes?: string | null,
  teams: Array< TeamsInput >,
  cycleStations: Array< CycleStationInput >,
  machineId: string,
};

export type M100RangeInput = {
  min: number,
  max: number,
};

export type TeamsInput = {
  id: string,
  name: string,
  index: number,
  cycleStations: Array< CycleStationInput >,
};

export type CycleStationInput = {
  id: string,
  name: string,
  isActive: Bool,
  index: number,
};

export type ShiftModelInput = {
  id?: string | null,
  name: string,
  isActive: Bool,
  timeZone: string,
  unitIds: Array< string >,
  scheduleHours: Array< ScheduleHourInput >,
};

export type ScheduleHourInput = {
  id?: string | null,
  shiftType: Shift,
  type: Type,
  hoursStartUTC: string,
  hoursEndUTC: string,
  downtime?: string | null,
  timeZone: string,
  i: number,
};

export type DuplicateInput = {
  id: string,
};

export type TemplateInput = {
  id: string,
  index: number,
};

export type LambdaGroupingInput = {
  unitsIds: Array< string >,
  subDepartmentIds: Array< string >,
  id?: string | null,
  name: string,
};

export type UnitProblemClassificationInput = {
  id?: string | null,
  classification?: string | null,
  unitsIds?: Array< string | null > | null,
};

export type StartShiftInput = {
  unitId: string,
  partId: string,
  shiftModelId: string,
  shiftType: Shift,
  attendingShift: AttendingShift,
  timeRange: TimeRange,
  timeZone: string,
  shiftTarget?: number | null,
  cycleTime?: number | null,
  speedMode?: number | null,
};

export enum AttendingShift {
  Shift1 = "Shift1",
  Shift2 = "Shift2",
  Shift3 = "Shift3",
  Shift4 = "Shift4",
}


export type UpdateConfigurationsAndActualCountsInput = {
  unitId: string,
  shiftType: Shift,
  dateTimeStartUTC: string,
  dateTimeEndUTC: string,
  configurationIdsToDelete: Array< string >,
  configurations: Array< ConfigurationInput >,
};

export type ConfigurationInput = {
  validFrom?: string | null,
  validUntil?: string | null,
  partId?: string | null,
  shiftModelId?: string | null,
  shiftTarget?: number | null,
  cycleTime?: number | null,
  speedMode?: number | null,
  timeZone?: string | null,
  unitType?: UnitType | null,
};

export type CreateDisruptionInput = {
  id?: string | null,
  unitId: string,
  cycleStationId: string,
  teamId?: string | null,
  originatorId?: string | null,
  disLocation?: string | null,
  disLocationSpecification?: string | null,
  disLocationType?: string | null,
  description: string,
  startTimeDateUTC: string,
  endTimeDateUTC: string,
  timeZone?: string | null,
  duration?: string | null,
  measures?: string | null,
  partId?: string | null,
  template: Bool,
  templateId: string,
  deleted: Bool,
  shiftType?: Shift | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  lostVehicles?: number | null,
  issues?: Array< IssueInput > | null,
  attachments?: Array< AttachmentInput > | null,
  m100?: number | null,
  index?: number | null,
  isSolved?: Bool | null,
};

export type IssueInput = {
  id: string,
  name: string,
  index: number,
};

export type AttachmentInput = {
  key: string,
  type: string,
  size: number,
  uploadedBy: string,
  createdAt: string,
};

export type ModeldisruptionConditionInput = {
  unitId?: ModelIDInput | null,
  cycleStationId?: ModelIDInput | null,
  teamId?: ModelIDInput | null,
  originatorId?: ModelIDInput | null,
  disLocation?: ModelStringInput | null,
  disLocationSpecification?: ModelStringInput | null,
  disLocationType?: ModelStringInput | null,
  description?: ModelStringInput | null,
  startTimeDateUTC?: ModelStringInput | null,
  endTimeDateUTC?: ModelStringInput | null,
  timeZone?: ModelStringInput | null,
  duration?: ModelStringInput | null,
  measures?: ModelStringInput | null,
  partId?: ModelStringInput | null,
  template?: ModelBoolInput | null,
  templateId?: ModelIDInput | null,
  deleted?: ModelBoolInput | null,
  shiftType?: ModelShiftInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  lostVehicles?: ModelFloatInput | null,
  m100?: ModelFloatInput | null,
  index?: ModelFloatInput | null,
  isSolved?: ModelBoolInput | null,
  and?: Array< ModeldisruptionConditionInput | null > | null,
  or?: Array< ModeldisruptionConditionInput | null > | null,
  not?: ModeldisruptionConditionInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelBoolInput = {
  eq?: Bool | null,
  ne?: Bool | null,
};

export type ModelShiftInput = {
  eq?: Shift | null,
  ne?: Shift | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateDisruptionInput = {
  id: string,
  unitId?: string | null,
  cycleStationId?: string | null,
  teamId?: string | null,
  originatorId?: string | null,
  disLocation?: string | null,
  disLocationSpecification?: string | null,
  disLocationType?: string | null,
  description?: string | null,
  startTimeDateUTC?: string | null,
  endTimeDateUTC?: string | null,
  timeZone?: string | null,
  duration?: string | null,
  measures?: string | null,
  partId?: string | null,
  template?: Bool | null,
  templateId?: string | null,
  deleted?: Bool | null,
  shiftType?: Shift | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  lostVehicles?: number | null,
  issues?: Array< IssueInput > | null,
  attachments?: Array< AttachmentInput > | null,
  m100?: number | null,
  index?: number | null,
  isSolved?: Bool | null,
};

export type DeleteDisruptionInput = {
  id: string,
};

export type CreateMeasureReportInput = {
  id?: string | null,
  templateId?: string | null,
  subDepartment?: string | null,
  description: string,
  notes?: string | null,
  firstOccurrence?: string | null,
  productNumber?: string | null,
  totalDuration?: string | null,
  frequency?: number | null,
  unitId: string,
  classifications?: string | null,
  cycleStationName?: string | null,
  isCritical?: Bool | null,
  progress?: Progress | null,
  attachments?: string | null,
  what?: string | null,
  when?: string | null,
  where?: string | null,
  causes?: string | null,
  reportId: string,
  status?: Status | null,
  dueDate?: string | null,
};

export type ModelMeasureReportConditionInput = {
  templateId?: ModelIDInput | null,
  subDepartment?: ModelStringInput | null,
  description?: ModelStringInput | null,
  notes?: ModelStringInput | null,
  firstOccurrence?: ModelStringInput | null,
  productNumber?: ModelStringInput | null,
  totalDuration?: ModelStringInput | null,
  frequency?: ModelFloatInput | null,
  unitId?: ModelIDInput | null,
  classifications?: ModelStringInput | null,
  cycleStationName?: ModelStringInput | null,
  isCritical?: ModelBoolInput | null,
  progress?: ModelProgressInput | null,
  attachments?: ModelStringInput | null,
  what?: ModelStringInput | null,
  when?: ModelStringInput | null,
  where?: ModelStringInput | null,
  causes?: ModelStringInput | null,
  reportId?: ModelIDInput | null,
  status?: ModelStatusInput | null,
  dueDate?: ModelStringInput | null,
  and?: Array< ModelMeasureReportConditionInput | null > | null,
  or?: Array< ModelMeasureReportConditionInput | null > | null,
  not?: ModelMeasureReportConditionInput | null,
};

export type ModelProgressInput = {
  eq?: Progress | null,
  ne?: Progress | null,
};

export type ModelStatusInput = {
  eq?: Status | null,
  ne?: Status | null,
};

export type MeasureReport = {
  __typename: "MeasureReport",
  id: string,
  templateId?: string | null,
  subDepartment?: string | null,
  description: string,
  notes?: string | null,
  firstOccurrence?: string | null,
  productNumber?: string | null,
  totalDuration?: string | null,
  frequency?: number | null,
  unitId: string,
  classifications?: string | null,
  cycleStationName?: string | null,
  isCritical?: Bool | null,
  progress?: Progress | null,
  attachments?: string | null,
  what?: string | null,
  when?: string | null,
  where?: string | null,
  causes?: string | null,
  reportId: string,
  status?: Status | null,
  dueDate?: string | null,
  createdAt: string,
  updatedAt: string,
  unit?: Unit | null,
};

export type UpdateMeasureReportInput = {
  id: string,
  templateId?: string | null,
  subDepartment?: string | null,
  description?: string | null,
  notes?: string | null,
  firstOccurrence?: string | null,
  productNumber?: string | null,
  totalDuration?: string | null,
  frequency?: number | null,
  unitId?: string | null,
  classifications?: string | null,
  cycleStationName?: string | null,
  isCritical?: Bool | null,
  progress?: Progress | null,
  attachments?: string | null,
  what?: string | null,
  when?: string | null,
  where?: string | null,
  causes?: string | null,
  reportId?: string | null,
  status?: Status | null,
  dueDate?: string | null,
};

export type DeleteMeasureReportInput = {
  id: string,
};

export type CreateGroupingInput = {
  id?: string | null,
  groupingName: string,
  allowedDepartments?: Array< string > | null,
};

export type ModelGroupingConditionInput = {
  groupingName?: ModelStringInput | null,
  allowedDepartments?: ModelIDInput | null,
  and?: Array< ModelGroupingConditionInput | null > | null,
  or?: Array< ModelGroupingConditionInput | null > | null,
  not?: ModelGroupingConditionInput | null,
};

export type UpdateGroupingInput = {
  id: string,
  groupingName?: string | null,
  allowedDepartments?: Array< string > | null,
};

export type DeleteGroupingInput = {
  id: string,
};

export type CreateTeamInput = {
  id?: string | null,
  name: string,
  unitId: string,
  index: number,
};

export type ModelTeamConditionInput = {
  name?: ModelStringInput | null,
  unitId?: ModelIDInput | null,
  index?: ModelFloatInput | null,
  and?: Array< ModelTeamConditionInput | null > | null,
  or?: Array< ModelTeamConditionInput | null > | null,
  not?: ModelTeamConditionInput | null,
};

export type UpdateTeamInput = {
  id: string,
  name?: string | null,
  unitId?: string | null,
  index?: number | null,
};

export type DeleteTeamInput = {
  id: string,
};

export type CreateCycleStationInput = {
  id?: string | null,
  unitId: string,
  teamId?: string | null,
  name: string,
  isActive: Bool,
  index: number,
};

export type ModelCycleStationConditionInput = {
  unitId?: ModelIDInput | null,
  teamId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  isActive?: ModelBoolInput | null,
  index?: ModelFloatInput | null,
  and?: Array< ModelCycleStationConditionInput | null > | null,
  or?: Array< ModelCycleStationConditionInput | null > | null,
  not?: ModelCycleStationConditionInput | null,
};

export type UpdateCycleStationInput = {
  id: string,
  unitId?: string | null,
  teamId?: string | null,
  name?: string | null,
  isActive?: Bool | null,
  index?: number | null,
};

export type DeleteCycleStationInput = {
  id: string,
};

export type CreateUnitInput = {
  id?: string | null,
  name: string,
  shortName: string,
  type: UnitType,
  manufacturer?: string | null,
  speedModes?: string | null,
  groupingId?: string | null,
  unitUserSettingId?: string | null,
  unitProblemClassificationId?: string | null,
  m100Range?: M100RangeInput | null,
  machineId: string,
};

export type ModelUnitConditionInput = {
  name?: ModelStringInput | null,
  shortName?: ModelStringInput | null,
  type?: ModelUnitTypeInput | null,
  manufacturer?: ModelStringInput | null,
  speedModes?: ModelStringInput | null,
  groupingId?: ModelIDInput | null,
  unitUserSettingId?: ModelIDInput | null,
  unitProblemClassificationId?: ModelIDInput | null,
  machineId?: ModelIDInput | null,
  and?: Array< ModelUnitConditionInput | null > | null,
  or?: Array< ModelUnitConditionInput | null > | null,
  not?: ModelUnitConditionInput | null,
};

export type ModelUnitTypeInput = {
  eq?: UnitType | null,
  ne?: UnitType | null,
};

export type UpdateUnitInput = {
  id: string,
  name?: string | null,
  shortName?: string | null,
  type?: UnitType | null,
  manufacturer?: string | null,
  speedModes?: string | null,
  groupingId?: string | null,
  unitUserSettingId?: string | null,
  unitProblemClassificationId?: string | null,
  m100Range?: M100RangeInput | null,
  machineId?: string | null,
};

export type DeleteUnitInput = {
  id: string,
};

export type CreateUnitProblemClassificationInput = {
  id?: string | null,
  classification?: string | null,
};

export type ModelUnitProblemClassificationConditionInput = {
  classification?: ModelStringInput | null,
  and?: Array< ModelUnitProblemClassificationConditionInput | null > | null,
  or?: Array< ModelUnitProblemClassificationConditionInput | null > | null,
  not?: ModelUnitProblemClassificationConditionInput | null,
};

export type UpdateUnitProblemClassificationInput = {
  id: string,
  classification?: string | null,
};

export type DeleteUnitProblemClassificationInput = {
  id: string,
};

export type CreateUnitUserSettingInput = {
  id?: string | null,
  replacer?: Bool | null,
};

export type ModelUnitUserSettingConditionInput = {
  replacer?: ModelBoolInput | null,
  and?: Array< ModelUnitUserSettingConditionInput | null > | null,
  or?: Array< ModelUnitUserSettingConditionInput | null > | null,
  not?: ModelUnitUserSettingConditionInput | null,
};

export type UpdateUnitUserSettingInput = {
  id: string,
  replacer?: Bool | null,
};

export type DeleteUnitUserSettingInput = {
  id: string,
};

export type CreatePartUnitInput = {
  id?: string | null,
  unitId: string,
  partId: string,
  targetCycleTime?: number | null,
};

export type ModelPartUnitConditionInput = {
  unitId?: ModelIDInput | null,
  partId?: ModelIDInput | null,
  targetCycleTime?: ModelFloatInput | null,
  and?: Array< ModelPartUnitConditionInput | null > | null,
  or?: Array< ModelPartUnitConditionInput | null > | null,
  not?: ModelPartUnitConditionInput | null,
};

export type UpdatePartUnitInput = {
  id: string,
  unitId?: string | null,
  partId?: string | null,
  targetCycleTime?: number | null,
};

export type DeletePartUnitInput = {
  id: string,
};

export type CreatePartInput = {
  id?: string | null,
  partNumber: string,
  name: string,
  qualityIssueConfig?: string | null,
  imageFront?: string | null,
  imageBack?: string | null,
};

export type ModelPartConditionInput = {
  partNumber?: ModelStringInput | null,
  name?: ModelStringInput | null,
  qualityIssueConfig?: ModelStringInput | null,
  imageFront?: ModelStringInput | null,
  imageBack?: ModelStringInput | null,
  and?: Array< ModelPartConditionInput | null > | null,
  or?: Array< ModelPartConditionInput | null > | null,
  not?: ModelPartConditionInput | null,
};

export type UpdatePartInput = {
  id: string,
  partNumber?: string | null,
  name?: string | null,
  qualityIssueConfig?: string | null,
  imageFront?: string | null,
  imageBack?: string | null,
};

export type DeletePartInput = {
  id: string,
};

export type CreateActualCountInput = {
  id?: string | null,
  dateTimeStartUTC: string,
  dateTimeEndUTC: string,
  downtime?: string | null,
  timeZone: string,
  shift: Shift,
  shiftModelId: string,
  initialActualCount?: number | null,
  actualCount?: number | null,
  vehicleNumber?: VehicleNumberInput | null,
  quota: number,
  defective?: number | null,
  partId: string,
  unitId: string,
  configurationId: string,
  deleted: Bool,
  type: Type,
  split?: SplitPosition | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type VehicleNumberInput = {
  from?: number | null,
  until?: number | null,
};

export enum SplitPosition {
  First = "First",
  Last = "Last",
  Middle = "Middle",
}


export type ModelactualCountConditionInput = {
  dateTimeStartUTC?: ModelStringInput | null,
  dateTimeEndUTC?: ModelStringInput | null,
  downtime?: ModelStringInput | null,
  timeZone?: ModelStringInput | null,
  shift?: ModelShiftInput | null,
  shiftModelId?: ModelIDInput | null,
  initialActualCount?: ModelFloatInput | null,
  actualCount?: ModelFloatInput | null,
  quota?: ModelFloatInput | null,
  defective?: ModelFloatInput | null,
  partId?: ModelIDInput | null,
  unitId?: ModelIDInput | null,
  configurationId?: ModelIDInput | null,
  deleted?: ModelBoolInput | null,
  type?: ModelTypeInput | null,
  split?: ModelSplitPositionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelactualCountConditionInput | null > | null,
  or?: Array< ModelactualCountConditionInput | null > | null,
  not?: ModelactualCountConditionInput | null,
};

export type ModelTypeInput = {
  eq?: Type | null,
  ne?: Type | null,
};

export type ModelSplitPositionInput = {
  eq?: SplitPosition | null,
  ne?: SplitPosition | null,
};

export type actualCount = {
  __typename: "actualCount",
  id: string,
  dateTimeStartUTC: string,
  dateTimeEndUTC: string,
  downtime?: string | null,
  timeZone: string,
  shift: Shift,
  shiftModelId: string,
  initialActualCount?: number | null,
  actualCount?: number | null,
  vehicleNumber?: VehicleNumber | null,
  quota: number,
  defective?: number | null,
  partId: string,
  unitId: string,
  configurationId: string,
  deleted: Bool,
  type: Type,
  split?: SplitPosition | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  unit?: Unit | null,
  part?: Part | null,
  configuration?: Configuration | null,
};

export type VehicleNumber = {
  __typename: "VehicleNumber",
  from?: number | null,
  until?: number | null,
};

export type Configuration = {
  __typename: "Configuration",
  id: string,
  target?: number | null,
  shiftTarget: number,
  attendingShift?: AttendingShift | null,
  validFrom: string,
  validUntil: string,
  timeZone: string,
  speedMode?: number | null,
  cycleTime: number,
  partId: string,
  unitId: string,
  shiftModelId: string,
  createdAt: string,
  updatedAt: string,
  shiftModel?: ShiftModel | null,
};

export type UpdateActualCountInput = {
  id: string,
  dateTimeStartUTC?: string | null,
  dateTimeEndUTC?: string | null,
  downtime?: string | null,
  timeZone?: string | null,
  shift?: Shift | null,
  shiftModelId?: string | null,
  initialActualCount?: number | null,
  actualCount?: number | null,
  vehicleNumber?: VehicleNumberInput | null,
  quota?: number | null,
  defective?: number | null,
  partId?: string | null,
  unitId?: string | null,
  configurationId?: string | null,
  deleted?: Bool | null,
  type?: Type | null,
  split?: SplitPosition | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteActualCountInput = {
  id: string,
};

export type CreateDefectiveInput = {
  id?: string | null,
  dateTime?: string | null,
  dateTimeUTC?: string | null,
  timeZone?: string | null,
  shift: Shift,
  partId: string,
  unitId: string,
  defectiveGrid?: string | null,
  defectiveType?: string | null,
  defectiveCause?: string | null,
  defectiveLocation?: string | null,
  count?: number | null,
  deleted: Bool,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelDefectiveConditionInput = {
  dateTime?: ModelStringInput | null,
  dateTimeUTC?: ModelStringInput | null,
  timeZone?: ModelStringInput | null,
  shift?: ModelShiftInput | null,
  partId?: ModelIDInput | null,
  unitId?: ModelIDInput | null,
  defectiveGrid?: ModelStringInput | null,
  defectiveType?: ModelStringInput | null,
  defectiveCause?: ModelStringInput | null,
  defectiveLocation?: ModelStringInput | null,
  count?: ModelFloatInput | null,
  deleted?: ModelBoolInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelDefectiveConditionInput | null > | null,
  or?: Array< ModelDefectiveConditionInput | null > | null,
  not?: ModelDefectiveConditionInput | null,
};

export type Defective = {
  __typename: "Defective",
  id: string,
  dateTime?: string | null,
  dateTimeUTC?: string | null,
  timeZone?: string | null,
  shift: Shift,
  partId: string,
  unitId: string,
  defectiveGrid?: string | null,
  defectiveType?: string | null,
  defectiveCause?: string | null,
  defectiveLocation?: string | null,
  count?: number | null,
  deleted: Bool,
  createdAt?: string | null,
  updatedAt?: string | null,
  unit?: Unit | null,
  part?: Part | null,
};

export type UpdateDefectiveInput = {
  id: string,
  dateTime?: string | null,
  dateTimeUTC?: string | null,
  timeZone?: string | null,
  shift?: Shift | null,
  partId?: string | null,
  unitId?: string | null,
  defectiveGrid?: string | null,
  defectiveType?: string | null,
  defectiveCause?: string | null,
  defectiveLocation?: string | null,
  count?: number | null,
  deleted?: Bool | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteDefectiveInput = {
  id: string,
};

export type CreateOEEInput = {
  id?: string | null,
  startTimeDateUTC: string,
  endTimeDateUTC: string,
  timeZone?: string | null,
  overall?: number | null,
  availability?: number | null,
  performance?: number | null,
  quality?: number | null,
  actualCountSum?: number | null,
  quotaSum?: number | null,
  netOperatingTimeInMinutes?: number | null,
  targetCycleTimeInMinutes?: number | null,
  disruptionDurationSum?: number | null,
  defectiveCountSum?: number | null,
  unitId: string,
  shiftType?: Shift | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelOEEConditionInput = {
  startTimeDateUTC?: ModelStringInput | null,
  endTimeDateUTC?: ModelStringInput | null,
  timeZone?: ModelStringInput | null,
  overall?: ModelFloatInput | null,
  availability?: ModelFloatInput | null,
  performance?: ModelFloatInput | null,
  quality?: ModelFloatInput | null,
  actualCountSum?: ModelFloatInput | null,
  quotaSum?: ModelFloatInput | null,
  netOperatingTimeInMinutes?: ModelFloatInput | null,
  targetCycleTimeInMinutes?: ModelFloatInput | null,
  disruptionDurationSum?: ModelFloatInput | null,
  defectiveCountSum?: ModelFloatInput | null,
  unitId?: ModelIDInput | null,
  shiftType?: ModelShiftInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelOEEConditionInput | null > | null,
  or?: Array< ModelOEEConditionInput | null > | null,
  not?: ModelOEEConditionInput | null,
};

export type UpdateOEEInput = {
  id: string,
  startTimeDateUTC?: string | null,
  endTimeDateUTC?: string | null,
  timeZone?: string | null,
  overall?: number | null,
  availability?: number | null,
  performance?: number | null,
  quality?: number | null,
  actualCountSum?: number | null,
  quotaSum?: number | null,
  netOperatingTimeInMinutes?: number | null,
  targetCycleTimeInMinutes?: number | null,
  disruptionDurationSum?: number | null,
  defectiveCountSum?: number | null,
  unitId?: string | null,
  shiftType?: Shift | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteOEEInput = {
  id: string,
};

export type CreateScheduleHourInput = {
  id?: string | null,
  shiftType: Shift,
  type: Type,
  hoursStartUTC: string,
  hoursEndUTC: string,
  downtime?: string | null,
  timeZone: string,
  shiftModelId: string,
  i: number,
};

export type ModelScheduleHourConditionInput = {
  shiftType?: ModelShiftInput | null,
  type?: ModelTypeInput | null,
  hoursStartUTC?: ModelStringInput | null,
  hoursEndUTC?: ModelStringInput | null,
  downtime?: ModelStringInput | null,
  timeZone?: ModelStringInput | null,
  shiftModelId?: ModelIDInput | null,
  i?: ModelFloatInput | null,
  and?: Array< ModelScheduleHourConditionInput | null > | null,
  or?: Array< ModelScheduleHourConditionInput | null > | null,
  not?: ModelScheduleHourConditionInput | null,
};

export type UpdateScheduleHourInput = {
  id: string,
  shiftType?: Shift | null,
  type?: Type | null,
  hoursStartUTC?: string | null,
  hoursEndUTC?: string | null,
  downtime?: string | null,
  timeZone?: string | null,
  shiftModelId?: string | null,
  i?: number | null,
};

export type DeleteScheduleHourInput = {
  id: string,
};

export type CreateShiftModelInput = {
  id?: string | null,
  name: string,
  isActive: Bool,
  timeZone: string,
};

export type ModelShiftModelConditionInput = {
  name?: ModelStringInput | null,
  isActive?: ModelBoolInput | null,
  timeZone?: ModelStringInput | null,
  and?: Array< ModelShiftModelConditionInput | null > | null,
  or?: Array< ModelShiftModelConditionInput | null > | null,
  not?: ModelShiftModelConditionInput | null,
};

export type UpdateShiftModelInput = {
  id: string,
  name?: string | null,
  isActive?: Bool | null,
  timeZone?: string | null,
};

export type DeleteShiftModelInput = {
  id: string,
};

export type CreateShiftModelUnitInput = {
  id?: string | null,
  unitId: string,
  shiftModelId: string,
};

export type ModelShiftModelUnitConditionInput = {
  unitId?: ModelIDInput | null,
  shiftModelId?: ModelIDInput | null,
  and?: Array< ModelShiftModelUnitConditionInput | null > | null,
  or?: Array< ModelShiftModelUnitConditionInput | null > | null,
  not?: ModelShiftModelUnitConditionInput | null,
};

export type UpdateShiftModelUnitInput = {
  id: string,
  unitId?: string | null,
  shiftModelId?: string | null,
};

export type DeleteShiftModelUnitInput = {
  id: string,
};

export type CreateConfigurationInput = {
  id?: string | null,
  target?: number | null,
  shiftTarget: number,
  attendingShift?: AttendingShift | null,
  validFrom: string,
  validUntil: string,
  timeZone: string,
  speedMode?: number | null,
  cycleTime: number,
  partId: string,
  unitId: string,
  shiftModelId: string,
};

export type ModelConfigurationConditionInput = {
  target?: ModelFloatInput | null,
  shiftTarget?: ModelFloatInput | null,
  attendingShift?: ModelAttendingShiftInput | null,
  validFrom?: ModelStringInput | null,
  validUntil?: ModelStringInput | null,
  timeZone?: ModelStringInput | null,
  speedMode?: ModelFloatInput | null,
  cycleTime?: ModelFloatInput | null,
  partId?: ModelIDInput | null,
  unitId?: ModelIDInput | null,
  shiftModelId?: ModelIDInput | null,
  and?: Array< ModelConfigurationConditionInput | null > | null,
  or?: Array< ModelConfigurationConditionInput | null > | null,
  not?: ModelConfigurationConditionInput | null,
};

export type ModelAttendingShiftInput = {
  eq?: AttendingShift | null,
  ne?: AttendingShift | null,
};

export type UpdateConfigurationInput = {
  id: string,
  target?: number | null,
  shiftTarget?: number | null,
  attendingShift?: AttendingShift | null,
  validFrom?: string | null,
  validUntil?: string | null,
  timeZone?: string | null,
  speedMode?: number | null,
  cycleTime?: number | null,
  partId?: string | null,
  unitId?: string | null,
  shiftModelId?: string | null,
};

export type DeleteConfigurationInput = {
  id: string,
};

export type CalculateDisruptionKPIsInput = {
  startDate: string,
  endDate: string,
  shifts?: Array< Shift > | null,
  unitIds: Array< string >,
  disruptionCategories: Array< string >,
  disruptionDescriptions: Array< string >,
  disruptionTypes: Array< string >,
};

export type GetQuickSightURLInput = {
  initialDashboardId: string,
};

export type ListCognitoUsersInput = {
  attributes: Array< string >,
};

export type ModeldisruptionFilterInput = {
  id?: ModelIDInput | null,
  unitId?: ModelIDInput | null,
  cycleStationId?: ModelIDInput | null,
  teamId?: ModelIDInput | null,
  originatorId?: ModelIDInput | null,
  disLocation?: ModelStringInput | null,
  disLocationSpecification?: ModelStringInput | null,
  disLocationType?: ModelStringInput | null,
  description?: ModelStringInput | null,
  startTimeDateUTC?: ModelStringInput | null,
  endTimeDateUTC?: ModelStringInput | null,
  timeZone?: ModelStringInput | null,
  duration?: ModelStringInput | null,
  measures?: ModelStringInput | null,
  partId?: ModelStringInput | null,
  template?: ModelBoolInput | null,
  templateId?: ModelIDInput | null,
  deleted?: ModelBoolInput | null,
  shiftType?: ModelShiftInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  lostVehicles?: ModelFloatInput | null,
  m100?: ModelFloatInput | null,
  index?: ModelFloatInput | null,
  isSolved?: ModelBoolInput | null,
  and?: Array< ModeldisruptionFilterInput | null > | null,
  or?: Array< ModeldisruptionFilterInput | null > | null,
  not?: ModeldisruptionFilterInput | null,
};

export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModeldisruptionDisruptionByUnitIdCompositeKeyConditionInput = {
  eq?: ModeldisruptionDisruptionByUnitIdCompositeKeyInput | null,
  le?: ModeldisruptionDisruptionByUnitIdCompositeKeyInput | null,
  lt?: ModeldisruptionDisruptionByUnitIdCompositeKeyInput | null,
  ge?: ModeldisruptionDisruptionByUnitIdCompositeKeyInput | null,
  gt?: ModeldisruptionDisruptionByUnitIdCompositeKeyInput | null,
  between?: Array< ModeldisruptionDisruptionByUnitIdCompositeKeyInput | null > | null,
  beginsWith?: ModeldisruptionDisruptionByUnitIdCompositeKeyInput | null,
};

export type ModeldisruptionDisruptionByUnitIdCompositeKeyInput = {
  deleted?: Bool | null,
  template?: Bool | null,
};

export type ModelMeasureReportFilterInput = {
  id?: ModelIDInput | null,
  templateId?: ModelIDInput | null,
  subDepartment?: ModelStringInput | null,
  description?: ModelStringInput | null,
  notes?: ModelStringInput | null,
  firstOccurrence?: ModelStringInput | null,
  productNumber?: ModelStringInput | null,
  totalDuration?: ModelStringInput | null,
  frequency?: ModelFloatInput | null,
  unitId?: ModelIDInput | null,
  classifications?: ModelStringInput | null,
  cycleStationName?: ModelStringInput | null,
  isCritical?: ModelBoolInput | null,
  progress?: ModelProgressInput | null,
  attachments?: ModelStringInput | null,
  what?: ModelStringInput | null,
  when?: ModelStringInput | null,
  where?: ModelStringInput | null,
  causes?: ModelStringInput | null,
  reportId?: ModelIDInput | null,
  status?: ModelStatusInput | null,
  dueDate?: ModelStringInput | null,
  and?: Array< ModelMeasureReportFilterInput | null > | null,
  or?: Array< ModelMeasureReportFilterInput | null > | null,
  not?: ModelMeasureReportFilterInput | null,
};

export type ModelMeasureReportConnection = {
  __typename: "ModelMeasureReportConnection",
  items:  Array<MeasureReport | null >,
  nextToken?: string | null,
};

export type ModelGroupingFilterInput = {
  id?: ModelIDInput | null,
  groupingName?: ModelStringInput | null,
  allowedDepartments?: ModelIDInput | null,
  and?: Array< ModelGroupingFilterInput | null > | null,
  or?: Array< ModelGroupingFilterInput | null > | null,
  not?: ModelGroupingFilterInput | null,
};

export type ModelGroupingConnection = {
  __typename: "ModelGroupingConnection",
  items:  Array<Grouping | null >,
  nextToken?: string | null,
};

export type ModelTeamFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  unitId?: ModelIDInput | null,
  index?: ModelFloatInput | null,
  and?: Array< ModelTeamFilterInput | null > | null,
  or?: Array< ModelTeamFilterInput | null > | null,
  not?: ModelTeamFilterInput | null,
};

export type ModelCycleStationFilterInput = {
  id?: ModelIDInput | null,
  unitId?: ModelIDInput | null,
  teamId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  isActive?: ModelBoolInput | null,
  index?: ModelFloatInput | null,
  and?: Array< ModelCycleStationFilterInput | null > | null,
  or?: Array< ModelCycleStationFilterInput | null > | null,
  not?: ModelCycleStationFilterInput | null,
};

export type ModelUnitFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  shortName?: ModelStringInput | null,
  type?: ModelUnitTypeInput | null,
  manufacturer?: ModelStringInput | null,
  speedModes?: ModelStringInput | null,
  groupingId?: ModelIDInput | null,
  unitUserSettingId?: ModelIDInput | null,
  unitProblemClassificationId?: ModelIDInput | null,
  machineId?: ModelIDInput | null,
  and?: Array< ModelUnitFilterInput | null > | null,
  or?: Array< ModelUnitFilterInput | null > | null,
  not?: ModelUnitFilterInput | null,
};

export type ModelUnitProblemClassificationFilterInput = {
  id?: ModelIDInput | null,
  classification?: ModelStringInput | null,
  and?: Array< ModelUnitProblemClassificationFilterInput | null > | null,
  or?: Array< ModelUnitProblemClassificationFilterInput | null > | null,
  not?: ModelUnitProblemClassificationFilterInput | null,
};

export type ModelUnitProblemClassificationConnection = {
  __typename: "ModelUnitProblemClassificationConnection",
  items:  Array<UnitProblemClassification | null >,
  nextToken?: string | null,
};

export type ModelUnitUserSettingFilterInput = {
  id?: ModelIDInput | null,
  replacer?: ModelBoolInput | null,
  and?: Array< ModelUnitUserSettingFilterInput | null > | null,
  or?: Array< ModelUnitUserSettingFilterInput | null > | null,
  not?: ModelUnitUserSettingFilterInput | null,
};

export type ModelUnitUserSettingConnection = {
  __typename: "ModelUnitUserSettingConnection",
  items:  Array<UnitUserSetting | null >,
  nextToken?: string | null,
};

export type ModelPartUnitFilterInput = {
  id?: ModelIDInput | null,
  unitId?: ModelIDInput | null,
  partId?: ModelIDInput | null,
  targetCycleTime?: ModelFloatInput | null,
  and?: Array< ModelPartUnitFilterInput | null > | null,
  or?: Array< ModelPartUnitFilterInput | null > | null,
  not?: ModelPartUnitFilterInput | null,
};

export type ModelPartFilterInput = {
  id?: ModelIDInput | null,
  partNumber?: ModelStringInput | null,
  name?: ModelStringInput | null,
  qualityIssueConfig?: ModelStringInput | null,
  imageFront?: ModelStringInput | null,
  imageBack?: ModelStringInput | null,
  and?: Array< ModelPartFilterInput | null > | null,
  or?: Array< ModelPartFilterInput | null > | null,
  not?: ModelPartFilterInput | null,
};

export type ModelPartConnection = {
  __typename: "ModelPartConnection",
  items:  Array<Part | null >,
  nextToken?: string | null,
};

export type ModelactualCountFilterInput = {
  id?: ModelIDInput | null,
  dateTimeStartUTC?: ModelStringInput | null,
  dateTimeEndUTC?: ModelStringInput | null,
  downtime?: ModelStringInput | null,
  timeZone?: ModelStringInput | null,
  shift?: ModelShiftInput | null,
  shiftModelId?: ModelIDInput | null,
  initialActualCount?: ModelFloatInput | null,
  actualCount?: ModelFloatInput | null,
  quota?: ModelFloatInput | null,
  defective?: ModelFloatInput | null,
  partId?: ModelIDInput | null,
  unitId?: ModelIDInput | null,
  configurationId?: ModelIDInput | null,
  deleted?: ModelBoolInput | null,
  type?: ModelTypeInput | null,
  split?: ModelSplitPositionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelactualCountFilterInput | null > | null,
  or?: Array< ModelactualCountFilterInput | null > | null,
  not?: ModelactualCountFilterInput | null,
};

export type ModelactualCountConnection = {
  __typename: "ModelactualCountConnection",
  items:  Array<actualCount | null >,
  nextToken?: string | null,
};

export type ModelDefectiveFilterInput = {
  id?: ModelIDInput | null,
  dateTime?: ModelStringInput | null,
  dateTimeUTC?: ModelStringInput | null,
  timeZone?: ModelStringInput | null,
  shift?: ModelShiftInput | null,
  partId?: ModelIDInput | null,
  unitId?: ModelIDInput | null,
  defectiveGrid?: ModelStringInput | null,
  defectiveType?: ModelStringInput | null,
  defectiveCause?: ModelStringInput | null,
  defectiveLocation?: ModelStringInput | null,
  count?: ModelFloatInput | null,
  deleted?: ModelBoolInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelDefectiveFilterInput | null > | null,
  or?: Array< ModelDefectiveFilterInput | null > | null,
  not?: ModelDefectiveFilterInput | null,
};

export type ModelDefectiveConnection = {
  __typename: "ModelDefectiveConnection",
  items:  Array<Defective | null >,
  nextToken?: string | null,
};

export type ModelOEEFilterInput = {
  id?: ModelIDInput | null,
  startTimeDateUTC?: ModelStringInput | null,
  endTimeDateUTC?: ModelStringInput | null,
  timeZone?: ModelStringInput | null,
  overall?: ModelFloatInput | null,
  availability?: ModelFloatInput | null,
  performance?: ModelFloatInput | null,
  quality?: ModelFloatInput | null,
  actualCountSum?: ModelFloatInput | null,
  quotaSum?: ModelFloatInput | null,
  netOperatingTimeInMinutes?: ModelFloatInput | null,
  targetCycleTimeInMinutes?: ModelFloatInput | null,
  disruptionDurationSum?: ModelFloatInput | null,
  defectiveCountSum?: ModelFloatInput | null,
  unitId?: ModelIDInput | null,
  shiftType?: ModelShiftInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelOEEFilterInput | null > | null,
  or?: Array< ModelOEEFilterInput | null > | null,
  not?: ModelOEEFilterInput | null,
};

export type ModelOEEConnection = {
  __typename: "ModelOEEConnection",
  items:  Array<OEE | null >,
  nextToken?: string | null,
};

export type ModelOEEListOEEsByUnitIdAndTimeDateUTCCompositeKeyConditionInput = {
  eq?: ModelOEEListOEEsByUnitIdAndTimeDateUTCCompositeKeyInput | null,
  le?: ModelOEEListOEEsByUnitIdAndTimeDateUTCCompositeKeyInput | null,
  lt?: ModelOEEListOEEsByUnitIdAndTimeDateUTCCompositeKeyInput | null,
  ge?: ModelOEEListOEEsByUnitIdAndTimeDateUTCCompositeKeyInput | null,
  gt?: ModelOEEListOEEsByUnitIdAndTimeDateUTCCompositeKeyInput | null,
  between?: Array< ModelOEEListOEEsByUnitIdAndTimeDateUTCCompositeKeyInput | null > | null,
  beginsWith?: ModelOEEListOEEsByUnitIdAndTimeDateUTCCompositeKeyInput | null,
};

export type ModelOEEListOEEsByUnitIdAndTimeDateUTCCompositeKeyInput = {
  startTimeDateUTC?: string | null,
  endTimeDateUTC?: string | null,
};

export type ModelScheduleHourFilterInput = {
  id?: ModelIDInput | null,
  shiftType?: ModelShiftInput | null,
  type?: ModelTypeInput | null,
  hoursStartUTC?: ModelStringInput | null,
  hoursEndUTC?: ModelStringInput | null,
  downtime?: ModelStringInput | null,
  timeZone?: ModelStringInput | null,
  shiftModelId?: ModelIDInput | null,
  i?: ModelFloatInput | null,
  and?: Array< ModelScheduleHourFilterInput | null > | null,
  or?: Array< ModelScheduleHourFilterInput | null > | null,
  not?: ModelScheduleHourFilterInput | null,
};

export type ModelShiftModelFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  isActive?: ModelBoolInput | null,
  timeZone?: ModelStringInput | null,
  and?: Array< ModelShiftModelFilterInput | null > | null,
  or?: Array< ModelShiftModelFilterInput | null > | null,
  not?: ModelShiftModelFilterInput | null,
};

export type ModelShiftModelConnection = {
  __typename: "ModelShiftModelConnection",
  items:  Array<ShiftModel | null >,
  nextToken?: string | null,
};

export type ModelShiftModelUnitFilterInput = {
  id?: ModelIDInput | null,
  unitId?: ModelIDInput | null,
  shiftModelId?: ModelIDInput | null,
  and?: Array< ModelShiftModelUnitFilterInput | null > | null,
  or?: Array< ModelShiftModelUnitFilterInput | null > | null,
  not?: ModelShiftModelUnitFilterInput | null,
};

export type ModelConfigurationFilterInput = {
  id?: ModelIDInput | null,
  target?: ModelFloatInput | null,
  shiftTarget?: ModelFloatInput | null,
  attendingShift?: ModelAttendingShiftInput | null,
  validFrom?: ModelStringInput | null,
  validUntil?: ModelStringInput | null,
  timeZone?: ModelStringInput | null,
  speedMode?: ModelFloatInput | null,
  cycleTime?: ModelFloatInput | null,
  partId?: ModelIDInput | null,
  unitId?: ModelIDInput | null,
  shiftModelId?: ModelIDInput | null,
  and?: Array< ModelConfigurationFilterInput | null > | null,
  or?: Array< ModelConfigurationFilterInput | null > | null,
  not?: ModelConfigurationFilterInput | null,
};

export type ModelConfigurationConnection = {
  __typename: "ModelConfigurationConnection",
  items:  Array<Configuration | null >,
  nextToken?: string | null,
};

export type CalculateShiftTargetInput = {
  shiftModelId: string,
  cycleTime: number,
  shiftType: Shift,
  speedMode?: number | null,
};

export type CalculateOEEMutationVariables = {
  input?: TimeRange | null,
};

export type CalculateOEEMutation = {
  calculateOEE?:  Array< {
    __typename: "OEE",
    id: string,
    startTimeDateUTC: string,
    endTimeDateUTC: string,
    timeZone?: string | null,
    overall?: number | null,
    availability?: number | null,
    performance?: number | null,
    quality?: number | null,
    actualCountSum?: number | null,
    quotaSum?: number | null,
    netOperatingTimeInMinutes?: number | null,
    targetCycleTimeInMinutes?: number | null,
    disruptionDurationSum?: number | null,
    defectiveCountSum?: number | null,
    unitId: string,
    shiftType?: Shift | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } > | null,
};

export type MutateMeasureReportMutationVariables = {
  put?: MeasureReportInput | null,
  delete?: DeleteInput | null,
};

export type MutateMeasureReportMutation = {
  mutateMeasureReport?: string | null,
};

export type MutateProductMutationVariables = {
  put?: ProductInput | null,
  delete?: DeleteInput | null,
};

export type MutateProductMutation = {
  mutateProduct?: string | null,
};

export type MutateUnitMutationVariables = {
  put?: UnitInput | null,
  delete?: DeleteInput | null,
};

export type MutateUnitMutation = {
  mutateUnit?: string | null,
};

export type MutateShiftModelMutationVariables = {
  put?: ShiftModelInput | null,
  duplicate?: DuplicateInput | null,
  delete?: DeleteInput | null,
};

export type MutateShiftModelMutation = {
  mutateShiftModel?: string | null,
};

export type MutateTemplatesMutationVariables = {
  put: Array< TemplateInput >,
};

export type MutateTemplatesMutation = {
  mutateTemplates?: string | null,
};

export type CreateGroupingCustomMutationVariables = {
  put?: LambdaGroupingInput | null,
};

export type CreateGroupingCustomMutation = {
  createGroupingCustom?: string | null,
};

export type UpdateGroupingCustomMutationVariables = {
  put?: LambdaGroupingInput | null,
};

export type UpdateGroupingCustomMutation = {
  updateGroupingCustom?: string | null,
};

export type DeleteGroupingCustomMutationVariables = {
  delete: DeleteInput,
};

export type DeleteGroupingCustomMutation = {
  deleteGroupingCustom?: string | null,
};

export type CreateUnitProblemClassificationCustomMutationVariables = {
  input?: UnitProblemClassificationInput | null,
};

export type CreateUnitProblemClassificationCustomMutation = {
  createUnitProblemClassificationCustom?: string | null,
};

export type DeleteUnitProblemClassificationCustomMutationVariables = {
  id?: string | null,
};

export type DeleteUnitProblemClassificationCustomMutation = {
  deleteUnitProblemClassificationCustom?: string | null,
};

export type UpdateUnitProblemClassificationCustomMutationVariables = {
  input?: UnitProblemClassificationInput | null,
};

export type UpdateUnitProblemClassificationCustomMutation = {
  updateUnitProblemClassificationCustom?: string | null,
};

export type StartShiftMutationVariables = {
  input: StartShiftInput,
};

export type StartShiftMutation = {
  startShift?: string | null,
};

export type DeleteConfigurationCustomMutationVariables = {
  id?: string | null,
};

export type DeleteConfigurationCustomMutation = {
  deleteConfigurationCustom?: string | null,
};

export type UpdateConfigurationsAndActualCountsMutationVariables = {
  input?: UpdateConfigurationsAndActualCountsInput | null,
};

export type UpdateConfigurationsAndActualCountsMutation = {
  updateConfigurationsAndActualCounts?: string | null,
};

export type CreateDisruptionMutationVariables = {
  input: CreateDisruptionInput,
  condition?: ModeldisruptionConditionInput | null,
};

export type CreateDisruptionMutation = {
  createDisruption?:  {
    __typename: "disruption",
    id: string,
    unitId: string,
    cycleStationId: string,
    teamId?: string | null,
    originatorId?: string | null,
    disLocation?: string | null,
    disLocationSpecification?: string | null,
    disLocationType?: string | null,
    description: string,
    startTimeDateUTC: string,
    endTimeDateUTC: string,
    timeZone?: string | null,
    duration?: string | null,
    measures?: string | null,
    partId?: string | null,
    template: Bool,
    templateId: string,
    deleted: Bool,
    shiftType?: Shift | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    lostVehicles?: number | null,
    issues?:  Array< {
      __typename: "Issue",
      id: string,
      name: string,
      index: number,
    } > | null,
    attachments?:  Array< {
      __typename: "Attachment",
      key: string,
      type: string,
      size: number,
      uploadedBy: string,
      createdAt: string,
    } > | null,
    m100?: number | null,
    index?: number | null,
    isSolved?: Bool | null,
    team?:  {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    originatorTeam?:  {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    cycleStation?:  {
      __typename: "CycleStation",
      id: string,
      unitId: string,
      teamId?: string | null,
      name: string,
      isActive: Bool,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type UpdateDisruptionMutationVariables = {
  input: UpdateDisruptionInput,
  condition?: ModeldisruptionConditionInput | null,
};

export type UpdateDisruptionMutation = {
  updateDisruption?:  {
    __typename: "disruption",
    id: string,
    unitId: string,
    cycleStationId: string,
    teamId?: string | null,
    originatorId?: string | null,
    disLocation?: string | null,
    disLocationSpecification?: string | null,
    disLocationType?: string | null,
    description: string,
    startTimeDateUTC: string,
    endTimeDateUTC: string,
    timeZone?: string | null,
    duration?: string | null,
    measures?: string | null,
    partId?: string | null,
    template: Bool,
    templateId: string,
    deleted: Bool,
    shiftType?: Shift | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    lostVehicles?: number | null,
    issues?:  Array< {
      __typename: "Issue",
      id: string,
      name: string,
      index: number,
    } > | null,
    attachments?:  Array< {
      __typename: "Attachment",
      key: string,
      type: string,
      size: number,
      uploadedBy: string,
      createdAt: string,
    } > | null,
    m100?: number | null,
    index?: number | null,
    isSolved?: Bool | null,
    team?:  {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    originatorTeam?:  {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    cycleStation?:  {
      __typename: "CycleStation",
      id: string,
      unitId: string,
      teamId?: string | null,
      name: string,
      isActive: Bool,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type DeleteDisruptionMutationVariables = {
  input: DeleteDisruptionInput,
  condition?: ModeldisruptionConditionInput | null,
};

export type DeleteDisruptionMutation = {
  deleteDisruption?:  {
    __typename: "disruption",
    id: string,
    unitId: string,
    cycleStationId: string,
    teamId?: string | null,
    originatorId?: string | null,
    disLocation?: string | null,
    disLocationSpecification?: string | null,
    disLocationType?: string | null,
    description: string,
    startTimeDateUTC: string,
    endTimeDateUTC: string,
    timeZone?: string | null,
    duration?: string | null,
    measures?: string | null,
    partId?: string | null,
    template: Bool,
    templateId: string,
    deleted: Bool,
    shiftType?: Shift | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    lostVehicles?: number | null,
    issues?:  Array< {
      __typename: "Issue",
      id: string,
      name: string,
      index: number,
    } > | null,
    attachments?:  Array< {
      __typename: "Attachment",
      key: string,
      type: string,
      size: number,
      uploadedBy: string,
      createdAt: string,
    } > | null,
    m100?: number | null,
    index?: number | null,
    isSolved?: Bool | null,
    team?:  {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    originatorTeam?:  {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    cycleStation?:  {
      __typename: "CycleStation",
      id: string,
      unitId: string,
      teamId?: string | null,
      name: string,
      isActive: Bool,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type CreateMeasureReportMutationVariables = {
  input: CreateMeasureReportInput,
  condition?: ModelMeasureReportConditionInput | null,
};

export type CreateMeasureReportMutation = {
  createMeasureReport?:  {
    __typename: "MeasureReport",
    id: string,
    templateId?: string | null,
    subDepartment?: string | null,
    description: string,
    notes?: string | null,
    firstOccurrence?: string | null,
    productNumber?: string | null,
    totalDuration?: string | null,
    frequency?: number | null,
    unitId: string,
    classifications?: string | null,
    cycleStationName?: string | null,
    isCritical?: Bool | null,
    progress?: Progress | null,
    attachments?: string | null,
    what?: string | null,
    when?: string | null,
    where?: string | null,
    causes?: string | null,
    reportId: string,
    status?: Status | null,
    dueDate?: string | null,
    createdAt: string,
    updatedAt: string,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type UpdateMeasureReportMutationVariables = {
  input: UpdateMeasureReportInput,
  condition?: ModelMeasureReportConditionInput | null,
};

export type UpdateMeasureReportMutation = {
  updateMeasureReport?:  {
    __typename: "MeasureReport",
    id: string,
    templateId?: string | null,
    subDepartment?: string | null,
    description: string,
    notes?: string | null,
    firstOccurrence?: string | null,
    productNumber?: string | null,
    totalDuration?: string | null,
    frequency?: number | null,
    unitId: string,
    classifications?: string | null,
    cycleStationName?: string | null,
    isCritical?: Bool | null,
    progress?: Progress | null,
    attachments?: string | null,
    what?: string | null,
    when?: string | null,
    where?: string | null,
    causes?: string | null,
    reportId: string,
    status?: Status | null,
    dueDate?: string | null,
    createdAt: string,
    updatedAt: string,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type DeleteMeasureReportMutationVariables = {
  input: DeleteMeasureReportInput,
  condition?: ModelMeasureReportConditionInput | null,
};

export type DeleteMeasureReportMutation = {
  deleteMeasureReport?:  {
    __typename: "MeasureReport",
    id: string,
    templateId?: string | null,
    subDepartment?: string | null,
    description: string,
    notes?: string | null,
    firstOccurrence?: string | null,
    productNumber?: string | null,
    totalDuration?: string | null,
    frequency?: number | null,
    unitId: string,
    classifications?: string | null,
    cycleStationName?: string | null,
    isCritical?: Bool | null,
    progress?: Progress | null,
    attachments?: string | null,
    what?: string | null,
    when?: string | null,
    where?: string | null,
    causes?: string | null,
    reportId: string,
    status?: Status | null,
    dueDate?: string | null,
    createdAt: string,
    updatedAt: string,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type CreateGroupingMutationVariables = {
  input: CreateGroupingInput,
  condition?: ModelGroupingConditionInput | null,
};

export type CreateGroupingMutation = {
  createGrouping?:  {
    __typename: "Grouping",
    id: string,
    groupingName: string,
    allowedDepartments?: Array< string > | null,
    createdAt: string,
    updatedAt: string,
    units?:  {
      __typename: "ModelUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type UpdateGroupingMutationVariables = {
  input: UpdateGroupingInput,
  condition?: ModelGroupingConditionInput | null,
};

export type UpdateGroupingMutation = {
  updateGrouping?:  {
    __typename: "Grouping",
    id: string,
    groupingName: string,
    allowedDepartments?: Array< string > | null,
    createdAt: string,
    updatedAt: string,
    units?:  {
      __typename: "ModelUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type DeleteGroupingMutationVariables = {
  input: DeleteGroupingInput,
  condition?: ModelGroupingConditionInput | null,
};

export type DeleteGroupingMutation = {
  deleteGrouping?:  {
    __typename: "Grouping",
    id: string,
    groupingName: string,
    allowedDepartments?: Array< string > | null,
    createdAt: string,
    updatedAt: string,
    units?:  {
      __typename: "ModelUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type CreateTeamMutationVariables = {
  input: CreateTeamInput,
  condition?: ModelTeamConditionInput | null,
};

export type CreateTeamMutation = {
  createTeam?:  {
    __typename: "Team",
    id: string,
    name: string,
    unitId: string,
    index: number,
    createdAt: string,
    updatedAt: string,
    templates?:  {
      __typename: "ModeldisruptionConnection",
      nextToken?: string | null,
    } | null,
    cycleStations?:  {
      __typename: "ModelCycleStationConnection",
      nextToken?: string | null,
    } | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type UpdateTeamMutationVariables = {
  input: UpdateTeamInput,
  condition?: ModelTeamConditionInput | null,
};

export type UpdateTeamMutation = {
  updateTeam?:  {
    __typename: "Team",
    id: string,
    name: string,
    unitId: string,
    index: number,
    createdAt: string,
    updatedAt: string,
    templates?:  {
      __typename: "ModeldisruptionConnection",
      nextToken?: string | null,
    } | null,
    cycleStations?:  {
      __typename: "ModelCycleStationConnection",
      nextToken?: string | null,
    } | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type DeleteTeamMutationVariables = {
  input: DeleteTeamInput,
  condition?: ModelTeamConditionInput | null,
};

export type DeleteTeamMutation = {
  deleteTeam?:  {
    __typename: "Team",
    id: string,
    name: string,
    unitId: string,
    index: number,
    createdAt: string,
    updatedAt: string,
    templates?:  {
      __typename: "ModeldisruptionConnection",
      nextToken?: string | null,
    } | null,
    cycleStations?:  {
      __typename: "ModelCycleStationConnection",
      nextToken?: string | null,
    } | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type CreateCycleStationMutationVariables = {
  input: CreateCycleStationInput,
  condition?: ModelCycleStationConditionInput | null,
};

export type CreateCycleStationMutation = {
  createCycleStation?:  {
    __typename: "CycleStation",
    id: string,
    unitId: string,
    teamId?: string | null,
    name: string,
    isActive: Bool,
    index: number,
    createdAt: string,
    updatedAt: string,
    templates?:  {
      __typename: "ModeldisruptionConnection",
      nextToken?: string | null,
    } | null,
    team?:  {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type UpdateCycleStationMutationVariables = {
  input: UpdateCycleStationInput,
  condition?: ModelCycleStationConditionInput | null,
};

export type UpdateCycleStationMutation = {
  updateCycleStation?:  {
    __typename: "CycleStation",
    id: string,
    unitId: string,
    teamId?: string | null,
    name: string,
    isActive: Bool,
    index: number,
    createdAt: string,
    updatedAt: string,
    templates?:  {
      __typename: "ModeldisruptionConnection",
      nextToken?: string | null,
    } | null,
    team?:  {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type DeleteCycleStationMutationVariables = {
  input: DeleteCycleStationInput,
  condition?: ModelCycleStationConditionInput | null,
};

export type DeleteCycleStationMutation = {
  deleteCycleStation?:  {
    __typename: "CycleStation",
    id: string,
    unitId: string,
    teamId?: string | null,
    name: string,
    isActive: Bool,
    index: number,
    createdAt: string,
    updatedAt: string,
    templates?:  {
      __typename: "ModeldisruptionConnection",
      nextToken?: string | null,
    } | null,
    team?:  {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type CreateUnitMutationVariables = {
  input: CreateUnitInput,
  condition?: ModelUnitConditionInput | null,
};

export type CreateUnitMutation = {
  createUnit?:  {
    __typename: "Unit",
    id: string,
    name: string,
    shortName: string,
    type: UnitType,
    manufacturer?: string | null,
    speedModes?: string | null,
    groupingId?: string | null,
    unitUserSettingId?: string | null,
    unitProblemClassificationId?: string | null,
    m100Range?:  {
      __typename: "M100Range",
      min: number,
      max: number,
    } | null,
    machineId: string,
    createdAt: string,
    updatedAt: string,
    templates?:  {
      __typename: "ModeldisruptionConnection",
      nextToken?: string | null,
    } | null,
    grouping?:  {
      __typename: "Grouping",
      id: string,
      groupingName: string,
      allowedDepartments?: Array< string > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    teams?:  {
      __typename: "ModelTeamConnection",
      nextToken?: string | null,
    } | null,
    cycleStations?:  {
      __typename: "ModelCycleStationConnection",
      nextToken?: string | null,
    } | null,
    unitProblemClassification?:  {
      __typename: "UnitProblemClassification",
      id: string,
      classification?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    unitUserSetting?:  {
      __typename: "UnitUserSetting",
      id: string,
      replacer?: Bool | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    parts?:  {
      __typename: "ModelPartUnitConnection",
      nextToken?: string | null,
    } | null,
    shiftModels?:  {
      __typename: "ModelShiftModelUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type UpdateUnitMutationVariables = {
  input: UpdateUnitInput,
  condition?: ModelUnitConditionInput | null,
};

export type UpdateUnitMutation = {
  updateUnit?:  {
    __typename: "Unit",
    id: string,
    name: string,
    shortName: string,
    type: UnitType,
    manufacturer?: string | null,
    speedModes?: string | null,
    groupingId?: string | null,
    unitUserSettingId?: string | null,
    unitProblemClassificationId?: string | null,
    m100Range?:  {
      __typename: "M100Range",
      min: number,
      max: number,
    } | null,
    machineId: string,
    createdAt: string,
    updatedAt: string,
    templates?:  {
      __typename: "ModeldisruptionConnection",
      nextToken?: string | null,
    } | null,
    grouping?:  {
      __typename: "Grouping",
      id: string,
      groupingName: string,
      allowedDepartments?: Array< string > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    teams?:  {
      __typename: "ModelTeamConnection",
      nextToken?: string | null,
    } | null,
    cycleStations?:  {
      __typename: "ModelCycleStationConnection",
      nextToken?: string | null,
    } | null,
    unitProblemClassification?:  {
      __typename: "UnitProblemClassification",
      id: string,
      classification?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    unitUserSetting?:  {
      __typename: "UnitUserSetting",
      id: string,
      replacer?: Bool | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    parts?:  {
      __typename: "ModelPartUnitConnection",
      nextToken?: string | null,
    } | null,
    shiftModels?:  {
      __typename: "ModelShiftModelUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type DeleteUnitMutationVariables = {
  input: DeleteUnitInput,
  condition?: ModelUnitConditionInput | null,
};

export type DeleteUnitMutation = {
  deleteUnit?:  {
    __typename: "Unit",
    id: string,
    name: string,
    shortName: string,
    type: UnitType,
    manufacturer?: string | null,
    speedModes?: string | null,
    groupingId?: string | null,
    unitUserSettingId?: string | null,
    unitProblemClassificationId?: string | null,
    m100Range?:  {
      __typename: "M100Range",
      min: number,
      max: number,
    } | null,
    machineId: string,
    createdAt: string,
    updatedAt: string,
    templates?:  {
      __typename: "ModeldisruptionConnection",
      nextToken?: string | null,
    } | null,
    grouping?:  {
      __typename: "Grouping",
      id: string,
      groupingName: string,
      allowedDepartments?: Array< string > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    teams?:  {
      __typename: "ModelTeamConnection",
      nextToken?: string | null,
    } | null,
    cycleStations?:  {
      __typename: "ModelCycleStationConnection",
      nextToken?: string | null,
    } | null,
    unitProblemClassification?:  {
      __typename: "UnitProblemClassification",
      id: string,
      classification?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    unitUserSetting?:  {
      __typename: "UnitUserSetting",
      id: string,
      replacer?: Bool | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    parts?:  {
      __typename: "ModelPartUnitConnection",
      nextToken?: string | null,
    } | null,
    shiftModels?:  {
      __typename: "ModelShiftModelUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type CreateUnitProblemClassificationMutationVariables = {
  input: CreateUnitProblemClassificationInput,
  condition?: ModelUnitProblemClassificationConditionInput | null,
};

export type CreateUnitProblemClassificationMutation = {
  createUnitProblemClassification?:  {
    __typename: "UnitProblemClassification",
    id: string,
    classification?: string | null,
    createdAt: string,
    updatedAt: string,
    units?:  {
      __typename: "ModelUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type UpdateUnitProblemClassificationMutationVariables = {
  input: UpdateUnitProblemClassificationInput,
  condition?: ModelUnitProblemClassificationConditionInput | null,
};

export type UpdateUnitProblemClassificationMutation = {
  updateUnitProblemClassification?:  {
    __typename: "UnitProblemClassification",
    id: string,
    classification?: string | null,
    createdAt: string,
    updatedAt: string,
    units?:  {
      __typename: "ModelUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type DeleteUnitProblemClassificationMutationVariables = {
  input: DeleteUnitProblemClassificationInput,
  condition?: ModelUnitProblemClassificationConditionInput | null,
};

export type DeleteUnitProblemClassificationMutation = {
  deleteUnitProblemClassification?:  {
    __typename: "UnitProblemClassification",
    id: string,
    classification?: string | null,
    createdAt: string,
    updatedAt: string,
    units?:  {
      __typename: "ModelUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type CreateUnitUserSettingMutationVariables = {
  input: CreateUnitUserSettingInput,
  condition?: ModelUnitUserSettingConditionInput | null,
};

export type CreateUnitUserSettingMutation = {
  createUnitUserSetting?:  {
    __typename: "UnitUserSetting",
    id: string,
    replacer?: Bool | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUnitUserSettingMutationVariables = {
  input: UpdateUnitUserSettingInput,
  condition?: ModelUnitUserSettingConditionInput | null,
};

export type UpdateUnitUserSettingMutation = {
  updateUnitUserSetting?:  {
    __typename: "UnitUserSetting",
    id: string,
    replacer?: Bool | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUnitUserSettingMutationVariables = {
  input: DeleteUnitUserSettingInput,
  condition?: ModelUnitUserSettingConditionInput | null,
};

export type DeleteUnitUserSettingMutation = {
  deleteUnitUserSetting?:  {
    __typename: "UnitUserSetting",
    id: string,
    replacer?: Bool | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreatePartUnitMutationVariables = {
  input: CreatePartUnitInput,
  condition?: ModelPartUnitConditionInput | null,
};

export type CreatePartUnitMutation = {
  createPartUnit?:  {
    __typename: "PartUnit",
    id: string,
    unitId: string,
    partId: string,
    targetCycleTime?: number | null,
    createdAt: string,
    updatedAt: string,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    part?:  {
      __typename: "Part",
      id: string,
      partNumber: string,
      name: string,
      qualityIssueConfig?: string | null,
      imageFront?: string | null,
      imageBack?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type UpdatePartUnitMutationVariables = {
  input: UpdatePartUnitInput,
  condition?: ModelPartUnitConditionInput | null,
};

export type UpdatePartUnitMutation = {
  updatePartUnit?:  {
    __typename: "PartUnit",
    id: string,
    unitId: string,
    partId: string,
    targetCycleTime?: number | null,
    createdAt: string,
    updatedAt: string,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    part?:  {
      __typename: "Part",
      id: string,
      partNumber: string,
      name: string,
      qualityIssueConfig?: string | null,
      imageFront?: string | null,
      imageBack?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type DeletePartUnitMutationVariables = {
  input: DeletePartUnitInput,
  condition?: ModelPartUnitConditionInput | null,
};

export type DeletePartUnitMutation = {
  deletePartUnit?:  {
    __typename: "PartUnit",
    id: string,
    unitId: string,
    partId: string,
    targetCycleTime?: number | null,
    createdAt: string,
    updatedAt: string,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    part?:  {
      __typename: "Part",
      id: string,
      partNumber: string,
      name: string,
      qualityIssueConfig?: string | null,
      imageFront?: string | null,
      imageBack?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type CreatePartMutationVariables = {
  input: CreatePartInput,
  condition?: ModelPartConditionInput | null,
};

export type CreatePartMutation = {
  createPart?:  {
    __typename: "Part",
    id: string,
    partNumber: string,
    name: string,
    qualityIssueConfig?: string | null,
    imageFront?: string | null,
    imageBack?: string | null,
    createdAt: string,
    updatedAt: string,
    units?:  {
      __typename: "ModelPartUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type UpdatePartMutationVariables = {
  input: UpdatePartInput,
  condition?: ModelPartConditionInput | null,
};

export type UpdatePartMutation = {
  updatePart?:  {
    __typename: "Part",
    id: string,
    partNumber: string,
    name: string,
    qualityIssueConfig?: string | null,
    imageFront?: string | null,
    imageBack?: string | null,
    createdAt: string,
    updatedAt: string,
    units?:  {
      __typename: "ModelPartUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type DeletePartMutationVariables = {
  input: DeletePartInput,
  condition?: ModelPartConditionInput | null,
};

export type DeletePartMutation = {
  deletePart?:  {
    __typename: "Part",
    id: string,
    partNumber: string,
    name: string,
    qualityIssueConfig?: string | null,
    imageFront?: string | null,
    imageBack?: string | null,
    createdAt: string,
    updatedAt: string,
    units?:  {
      __typename: "ModelPartUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type CreateActualCountMutationVariables = {
  input: CreateActualCountInput,
  condition?: ModelactualCountConditionInput | null,
};

export type CreateActualCountMutation = {
  createActualCount?:  {
    __typename: "actualCount",
    id: string,
    dateTimeStartUTC: string,
    dateTimeEndUTC: string,
    downtime?: string | null,
    timeZone: string,
    shift: Shift,
    shiftModelId: string,
    initialActualCount?: number | null,
    actualCount?: number | null,
    vehicleNumber?:  {
      __typename: "VehicleNumber",
      from?: number | null,
      until?: number | null,
    } | null,
    quota: number,
    defective?: number | null,
    partId: string,
    unitId: string,
    configurationId: string,
    deleted: Bool,
    type: Type,
    split?: SplitPosition | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    part?:  {
      __typename: "Part",
      id: string,
      partNumber: string,
      name: string,
      qualityIssueConfig?: string | null,
      imageFront?: string | null,
      imageBack?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    configuration?:  {
      __typename: "Configuration",
      id: string,
      target?: number | null,
      shiftTarget: number,
      attendingShift?: AttendingShift | null,
      validFrom: string,
      validUntil: string,
      timeZone: string,
      speedMode?: number | null,
      cycleTime: number,
      partId: string,
      unitId: string,
      shiftModelId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type UpdateActualCountMutationVariables = {
  input: UpdateActualCountInput,
  condition?: ModelactualCountConditionInput | null,
};

export type UpdateActualCountMutation = {
  updateActualCount?:  {
    __typename: "actualCount",
    id: string,
    dateTimeStartUTC: string,
    dateTimeEndUTC: string,
    downtime?: string | null,
    timeZone: string,
    shift: Shift,
    shiftModelId: string,
    initialActualCount?: number | null,
    actualCount?: number | null,
    vehicleNumber?:  {
      __typename: "VehicleNumber",
      from?: number | null,
      until?: number | null,
    } | null,
    quota: number,
    defective?: number | null,
    partId: string,
    unitId: string,
    configurationId: string,
    deleted: Bool,
    type: Type,
    split?: SplitPosition | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    part?:  {
      __typename: "Part",
      id: string,
      partNumber: string,
      name: string,
      qualityIssueConfig?: string | null,
      imageFront?: string | null,
      imageBack?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    configuration?:  {
      __typename: "Configuration",
      id: string,
      target?: number | null,
      shiftTarget: number,
      attendingShift?: AttendingShift | null,
      validFrom: string,
      validUntil: string,
      timeZone: string,
      speedMode?: number | null,
      cycleTime: number,
      partId: string,
      unitId: string,
      shiftModelId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type DeleteActualCountMutationVariables = {
  input: DeleteActualCountInput,
  condition?: ModelactualCountConditionInput | null,
};

export type DeleteActualCountMutation = {
  deleteActualCount?:  {
    __typename: "actualCount",
    id: string,
    dateTimeStartUTC: string,
    dateTimeEndUTC: string,
    downtime?: string | null,
    timeZone: string,
    shift: Shift,
    shiftModelId: string,
    initialActualCount?: number | null,
    actualCount?: number | null,
    vehicleNumber?:  {
      __typename: "VehicleNumber",
      from?: number | null,
      until?: number | null,
    } | null,
    quota: number,
    defective?: number | null,
    partId: string,
    unitId: string,
    configurationId: string,
    deleted: Bool,
    type: Type,
    split?: SplitPosition | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    part?:  {
      __typename: "Part",
      id: string,
      partNumber: string,
      name: string,
      qualityIssueConfig?: string | null,
      imageFront?: string | null,
      imageBack?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    configuration?:  {
      __typename: "Configuration",
      id: string,
      target?: number | null,
      shiftTarget: number,
      attendingShift?: AttendingShift | null,
      validFrom: string,
      validUntil: string,
      timeZone: string,
      speedMode?: number | null,
      cycleTime: number,
      partId: string,
      unitId: string,
      shiftModelId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type CreateDefectiveMutationVariables = {
  input: CreateDefectiveInput,
  condition?: ModelDefectiveConditionInput | null,
};

export type CreateDefectiveMutation = {
  createDefective?:  {
    __typename: "Defective",
    id: string,
    dateTime?: string | null,
    dateTimeUTC?: string | null,
    timeZone?: string | null,
    shift: Shift,
    partId: string,
    unitId: string,
    defectiveGrid?: string | null,
    defectiveType?: string | null,
    defectiveCause?: string | null,
    defectiveLocation?: string | null,
    count?: number | null,
    deleted: Bool,
    createdAt?: string | null,
    updatedAt?: string | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    part?:  {
      __typename: "Part",
      id: string,
      partNumber: string,
      name: string,
      qualityIssueConfig?: string | null,
      imageFront?: string | null,
      imageBack?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type UpdateDefectiveMutationVariables = {
  input: UpdateDefectiveInput,
  condition?: ModelDefectiveConditionInput | null,
};

export type UpdateDefectiveMutation = {
  updateDefective?:  {
    __typename: "Defective",
    id: string,
    dateTime?: string | null,
    dateTimeUTC?: string | null,
    timeZone?: string | null,
    shift: Shift,
    partId: string,
    unitId: string,
    defectiveGrid?: string | null,
    defectiveType?: string | null,
    defectiveCause?: string | null,
    defectiveLocation?: string | null,
    count?: number | null,
    deleted: Bool,
    createdAt?: string | null,
    updatedAt?: string | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    part?:  {
      __typename: "Part",
      id: string,
      partNumber: string,
      name: string,
      qualityIssueConfig?: string | null,
      imageFront?: string | null,
      imageBack?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type DeleteDefectiveMutationVariables = {
  input: DeleteDefectiveInput,
  condition?: ModelDefectiveConditionInput | null,
};

export type DeleteDefectiveMutation = {
  deleteDefective?:  {
    __typename: "Defective",
    id: string,
    dateTime?: string | null,
    dateTimeUTC?: string | null,
    timeZone?: string | null,
    shift: Shift,
    partId: string,
    unitId: string,
    defectiveGrid?: string | null,
    defectiveType?: string | null,
    defectiveCause?: string | null,
    defectiveLocation?: string | null,
    count?: number | null,
    deleted: Bool,
    createdAt?: string | null,
    updatedAt?: string | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    part?:  {
      __typename: "Part",
      id: string,
      partNumber: string,
      name: string,
      qualityIssueConfig?: string | null,
      imageFront?: string | null,
      imageBack?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type CreateOEEMutationVariables = {
  input: CreateOEEInput,
  condition?: ModelOEEConditionInput | null,
};

export type CreateOEEMutation = {
  createOEE?:  {
    __typename: "OEE",
    id: string,
    startTimeDateUTC: string,
    endTimeDateUTC: string,
    timeZone?: string | null,
    overall?: number | null,
    availability?: number | null,
    performance?: number | null,
    quality?: number | null,
    actualCountSum?: number | null,
    quotaSum?: number | null,
    netOperatingTimeInMinutes?: number | null,
    targetCycleTimeInMinutes?: number | null,
    disruptionDurationSum?: number | null,
    defectiveCountSum?: number | null,
    unitId: string,
    shiftType?: Shift | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type UpdateOEEMutationVariables = {
  input: UpdateOEEInput,
  condition?: ModelOEEConditionInput | null,
};

export type UpdateOEEMutation = {
  updateOEE?:  {
    __typename: "OEE",
    id: string,
    startTimeDateUTC: string,
    endTimeDateUTC: string,
    timeZone?: string | null,
    overall?: number | null,
    availability?: number | null,
    performance?: number | null,
    quality?: number | null,
    actualCountSum?: number | null,
    quotaSum?: number | null,
    netOperatingTimeInMinutes?: number | null,
    targetCycleTimeInMinutes?: number | null,
    disruptionDurationSum?: number | null,
    defectiveCountSum?: number | null,
    unitId: string,
    shiftType?: Shift | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type DeleteOEEMutationVariables = {
  input: DeleteOEEInput,
  condition?: ModelOEEConditionInput | null,
};

export type DeleteOEEMutation = {
  deleteOEE?:  {
    __typename: "OEE",
    id: string,
    startTimeDateUTC: string,
    endTimeDateUTC: string,
    timeZone?: string | null,
    overall?: number | null,
    availability?: number | null,
    performance?: number | null,
    quality?: number | null,
    actualCountSum?: number | null,
    quotaSum?: number | null,
    netOperatingTimeInMinutes?: number | null,
    targetCycleTimeInMinutes?: number | null,
    disruptionDurationSum?: number | null,
    defectiveCountSum?: number | null,
    unitId: string,
    shiftType?: Shift | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type CreateScheduleHourMutationVariables = {
  input: CreateScheduleHourInput,
  condition?: ModelScheduleHourConditionInput | null,
};

export type CreateScheduleHourMutation = {
  createScheduleHour?:  {
    __typename: "ScheduleHour",
    id: string,
    shiftType: Shift,
    type: Type,
    hoursStartUTC: string,
    hoursEndUTC: string,
    downtime?: string | null,
    timeZone: string,
    shiftModelId: string,
    i: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateScheduleHourMutationVariables = {
  input: UpdateScheduleHourInput,
  condition?: ModelScheduleHourConditionInput | null,
};

export type UpdateScheduleHourMutation = {
  updateScheduleHour?:  {
    __typename: "ScheduleHour",
    id: string,
    shiftType: Shift,
    type: Type,
    hoursStartUTC: string,
    hoursEndUTC: string,
    downtime?: string | null,
    timeZone: string,
    shiftModelId: string,
    i: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteScheduleHourMutationVariables = {
  input: DeleteScheduleHourInput,
  condition?: ModelScheduleHourConditionInput | null,
};

export type DeleteScheduleHourMutation = {
  deleteScheduleHour?:  {
    __typename: "ScheduleHour",
    id: string,
    shiftType: Shift,
    type: Type,
    hoursStartUTC: string,
    hoursEndUTC: string,
    downtime?: string | null,
    timeZone: string,
    shiftModelId: string,
    i: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateShiftModelMutationVariables = {
  input: CreateShiftModelInput,
  condition?: ModelShiftModelConditionInput | null,
};

export type CreateShiftModelMutation = {
  createShiftModel?:  {
    __typename: "ShiftModel",
    id: string,
    name: string,
    isActive: Bool,
    timeZone: string,
    createdAt: string,
    updatedAt: string,
    scheduleHours?:  {
      __typename: "ModelScheduleHourConnection",
      nextToken?: string | null,
    } | null,
    units?:  {
      __typename: "ModelShiftModelUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type UpdateShiftModelMutationVariables = {
  input: UpdateShiftModelInput,
  condition?: ModelShiftModelConditionInput | null,
};

export type UpdateShiftModelMutation = {
  updateShiftModel?:  {
    __typename: "ShiftModel",
    id: string,
    name: string,
    isActive: Bool,
    timeZone: string,
    createdAt: string,
    updatedAt: string,
    scheduleHours?:  {
      __typename: "ModelScheduleHourConnection",
      nextToken?: string | null,
    } | null,
    units?:  {
      __typename: "ModelShiftModelUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type DeleteShiftModelMutationVariables = {
  input: DeleteShiftModelInput,
  condition?: ModelShiftModelConditionInput | null,
};

export type DeleteShiftModelMutation = {
  deleteShiftModel?:  {
    __typename: "ShiftModel",
    id: string,
    name: string,
    isActive: Bool,
    timeZone: string,
    createdAt: string,
    updatedAt: string,
    scheduleHours?:  {
      __typename: "ModelScheduleHourConnection",
      nextToken?: string | null,
    } | null,
    units?:  {
      __typename: "ModelShiftModelUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type CreateShiftModelUnitMutationVariables = {
  input: CreateShiftModelUnitInput,
  condition?: ModelShiftModelUnitConditionInput | null,
};

export type CreateShiftModelUnitMutation = {
  createShiftModelUnit?:  {
    __typename: "ShiftModelUnit",
    id: string,
    unitId: string,
    shiftModelId: string,
    createdAt: string,
    updatedAt: string,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    shiftModel?:  {
      __typename: "ShiftModel",
      id: string,
      name: string,
      isActive: Bool,
      timeZone: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type UpdateShiftModelUnitMutationVariables = {
  input: UpdateShiftModelUnitInput,
  condition?: ModelShiftModelUnitConditionInput | null,
};

export type UpdateShiftModelUnitMutation = {
  updateShiftModelUnit?:  {
    __typename: "ShiftModelUnit",
    id: string,
    unitId: string,
    shiftModelId: string,
    createdAt: string,
    updatedAt: string,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    shiftModel?:  {
      __typename: "ShiftModel",
      id: string,
      name: string,
      isActive: Bool,
      timeZone: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type DeleteShiftModelUnitMutationVariables = {
  input: DeleteShiftModelUnitInput,
  condition?: ModelShiftModelUnitConditionInput | null,
};

export type DeleteShiftModelUnitMutation = {
  deleteShiftModelUnit?:  {
    __typename: "ShiftModelUnit",
    id: string,
    unitId: string,
    shiftModelId: string,
    createdAt: string,
    updatedAt: string,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    shiftModel?:  {
      __typename: "ShiftModel",
      id: string,
      name: string,
      isActive: Bool,
      timeZone: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type CreateConfigurationMutationVariables = {
  input: CreateConfigurationInput,
  condition?: ModelConfigurationConditionInput | null,
};

export type CreateConfigurationMutation = {
  createConfiguration?:  {
    __typename: "Configuration",
    id: string,
    target?: number | null,
    shiftTarget: number,
    attendingShift?: AttendingShift | null,
    validFrom: string,
    validUntil: string,
    timeZone: string,
    speedMode?: number | null,
    cycleTime: number,
    partId: string,
    unitId: string,
    shiftModelId: string,
    createdAt: string,
    updatedAt: string,
    shiftModel?:  {
      __typename: "ShiftModel",
      id: string,
      name: string,
      isActive: Bool,
      timeZone: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type UpdateConfigurationMutationVariables = {
  input: UpdateConfigurationInput,
  condition?: ModelConfigurationConditionInput | null,
};

export type UpdateConfigurationMutation = {
  updateConfiguration?:  {
    __typename: "Configuration",
    id: string,
    target?: number | null,
    shiftTarget: number,
    attendingShift?: AttendingShift | null,
    validFrom: string,
    validUntil: string,
    timeZone: string,
    speedMode?: number | null,
    cycleTime: number,
    partId: string,
    unitId: string,
    shiftModelId: string,
    createdAt: string,
    updatedAt: string,
    shiftModel?:  {
      __typename: "ShiftModel",
      id: string,
      name: string,
      isActive: Bool,
      timeZone: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type DeleteConfigurationMutationVariables = {
  input: DeleteConfigurationInput,
  condition?: ModelConfigurationConditionInput | null,
};

export type DeleteConfigurationMutation = {
  deleteConfiguration?:  {
    __typename: "Configuration",
    id: string,
    target?: number | null,
    shiftTarget: number,
    attendingShift?: AttendingShift | null,
    validFrom: string,
    validUntil: string,
    timeZone: string,
    speedMode?: number | null,
    cycleTime: number,
    partId: string,
    unitId: string,
    shiftModelId: string,
    createdAt: string,
    updatedAt: string,
    shiftModel?:  {
      __typename: "ShiftModel",
      id: string,
      name: string,
      isActive: Bool,
      timeZone: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type CreateActualCountCustomMutationVariables = {
  input: CreateActualCountInput,
  condition?: ModelactualCountConditionInput | null,
};

export type CreateActualCountCustomMutation = {
  createActualCount?:  {
    __typename: "actualCount",
    id: string,
  } | null,
};

export type UpdateActualCountCustomMutationVariables = {
  input: UpdateActualCountInput,
  condition?: ModelactualCountConditionInput | null,
};

export type UpdateActualCountCustomMutation = {
  updateActualCount?:  {
    __typename: "actualCount",
    id: string,
  } | null,
};

export type DeleteActualCountCustomMutationVariables = {
  input: DeleteActualCountInput,
  condition?: ModelactualCountConditionInput | null,
};

export type DeleteActualCountCustomMutation = {
  deleteActualCount?:  {
    __typename: "actualCount",
    id: string,
  } | null,
};

export type CreateDefectiveCustomMutationVariables = {
  input: CreateDefectiveInput,
  condition?: ModelDefectiveConditionInput | null,
};

export type CreateDefectiveCustomMutation = {
  createDefective?:  {
    __typename: "Defective",
    id: string,
  } | null,
};

export type UpdateDefectiveCustomMutationVariables = {
  input: UpdateDefectiveInput,
  condition?: ModelDefectiveConditionInput | null,
};

export type UpdateDefectiveCustomMutation = {
  updateDefective?:  {
    __typename: "Defective",
    id: string,
  } | null,
};

export type DeleteDefectiveCustomMutationVariables = {
  input: DeleteDefectiveInput,
  condition?: ModelDefectiveConditionInput | null,
};

export type DeleteDefectiveCustomMutation = {
  deleteDefective?:  {
    __typename: "Defective",
    id: string,
  } | null,
};

export type CreateOEECustomMutationVariables = {
  input: CreateOEEInput,
  condition?: ModelOEEConditionInput | null,
};

export type CreateOEECustomMutation = {
  createOEE?:  {
    __typename: "OEE",
    id: string,
    startTimeDateUTC: string,
    endTimeDateUTC: string,
    timeZone?: string | null,
    overall?: number | null,
    availability?: number | null,
    performance?: number | null,
    quality?: number | null,
    actualCountSum?: number | null,
    quotaSum?: number | null,
    netOperatingTimeInMinutes?: number | null,
    targetCycleTimeInMinutes?: number | null,
    disruptionDurationSum?: number | null,
    defectiveCountSum?: number | null,
    shiftType?: Shift | null,
    unitId: string,
    unit?:  {
      __typename: "Unit",
      name: string,
    } | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type UpdateOEECustomMutationVariables = {
  input: UpdateOEEInput,
  condition?: ModelOEEConditionInput | null,
};

export type UpdateOEECustomMutation = {
  updateOEE?:  {
    __typename: "OEE",
    id: string,
    startTimeDateUTC: string,
    endTimeDateUTC: string,
    timeZone?: string | null,
    overall?: number | null,
    availability?: number | null,
    performance?: number | null,
    quality?: number | null,
    actualCountSum?: number | null,
    quotaSum?: number | null,
    netOperatingTimeInMinutes?: number | null,
    targetCycleTimeInMinutes?: number | null,
    disruptionDurationSum?: number | null,
    defectiveCountSum?: number | null,
    shiftType?: Shift | null,
    unitId: string,
    unit?:  {
      __typename: "Unit",
      name: string,
    } | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type DeleteOEECustomMutationVariables = {
  input: DeleteOEEInput,
  condition?: ModelOEEConditionInput | null,
};

export type DeleteOEECustomMutation = {
  deleteOEE?:  {
    __typename: "OEE",
    id: string,
  } | null,
};

export type CalculateDisruptionKPIsQueryVariables = {
  input?: CalculateDisruptionKPIsInput | null,
};

export type CalculateDisruptionKPIsQuery = {
  calculateDisruptionKPIs?: string | null,
};

export type GetQuickSightURLQueryVariables = {
  input: GetQuickSightURLInput,
};

export type GetQuickSightURLQuery = {
  getQuickSightURL?: string | null,
};

export type GetAvailableMachinesQueryVariables = {
};

export type GetAvailableMachinesQuery = {
  getAvailableMachines?: Array< string | null > | null,
};

export type ListCognitoUsersQueryVariables = {
  input?: ListCognitoUsersInput | null,
};

export type ListCognitoUsersQuery = {
  listCognitoUsers?: string | null,
};

export type GetDisruptionQueryVariables = {
  id: string,
};

export type GetDisruptionQuery = {
  getDisruption?:  {
    __typename: "disruption",
    id: string,
    unitId: string,
    cycleStationId: string,
    teamId?: string | null,
    originatorId?: string | null,
    disLocation?: string | null,
    disLocationSpecification?: string | null,
    disLocationType?: string | null,
    description: string,
    startTimeDateUTC: string,
    endTimeDateUTC: string,
    timeZone?: string | null,
    duration?: string | null,
    measures?: string | null,
    partId?: string | null,
    template: Bool,
    templateId: string,
    deleted: Bool,
    shiftType?: Shift | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    lostVehicles?: number | null,
    issues?:  Array< {
      __typename: "Issue",
      id: string,
      name: string,
      index: number,
    } > | null,
    attachments?:  Array< {
      __typename: "Attachment",
      key: string,
      type: string,
      size: number,
      uploadedBy: string,
      createdAt: string,
    } > | null,
    m100?: number | null,
    index?: number | null,
    isSolved?: Bool | null,
    team?:  {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    originatorTeam?:  {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    cycleStation?:  {
      __typename: "CycleStation",
      id: string,
      unitId: string,
      teamId?: string | null,
      name: string,
      isActive: Bool,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type ListDisruptionsQueryVariables = {
  filter?: ModeldisruptionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDisruptionsQuery = {
  listDisruptions?:  {
    __typename: "ModeldisruptionConnection",
    items:  Array< {
      __typename: "disruption",
      id: string,
      unitId: string,
      cycleStationId: string,
      teamId?: string | null,
      originatorId?: string | null,
      disLocation?: string | null,
      disLocationSpecification?: string | null,
      disLocationType?: string | null,
      description: string,
      startTimeDateUTC: string,
      endTimeDateUTC: string,
      timeZone?: string | null,
      duration?: string | null,
      measures?: string | null,
      partId?: string | null,
      template: Bool,
      templateId: string,
      deleted: Bool,
      shiftType?: Shift | null,
      createdAt?: string | null,
      updatedAt?: string | null,
      lostVehicles?: number | null,
      m100?: number | null,
      index?: number | null,
      isSolved?: Bool | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type DisruptionsByDeletedAndUpdatedAtQueryVariables = {
  deleted?: Bool | null,
  updatedAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModeldisruptionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type DisruptionsByDeletedAndUpdatedAtQuery = {
  disruptionsByDeletedAndUpdatedAt?:  {
    __typename: "ModeldisruptionConnection",
    items:  Array< {
      __typename: "disruption",
      id: string,
      unitId: string,
      cycleStationId: string,
      teamId?: string | null,
      originatorId?: string | null,
      disLocation?: string | null,
      disLocationSpecification?: string | null,
      disLocationType?: string | null,
      description: string,
      startTimeDateUTC: string,
      endTimeDateUTC: string,
      timeZone?: string | null,
      duration?: string | null,
      measures?: string | null,
      partId?: string | null,
      template: Bool,
      templateId: string,
      deleted: Bool,
      shiftType?: Shift | null,
      createdAt?: string | null,
      updatedAt?: string | null,
      lostVehicles?: number | null,
      m100?: number | null,
      index?: number | null,
      isSolved?: Bool | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type DisruptionsByUnitIdQueryVariables = {
  unitId?: string | null,
  deletedTemplate?: ModeldisruptionDisruptionByUnitIdCompositeKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModeldisruptionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type DisruptionsByUnitIdQuery = {
  disruptionsByUnitId?:  {
    __typename: "ModeldisruptionConnection",
    items:  Array< {
      __typename: "disruption",
      id: string,
      unitId: string,
      cycleStationId: string,
      teamId?: string | null,
      originatorId?: string | null,
      disLocation?: string | null,
      disLocationSpecification?: string | null,
      disLocationType?: string | null,
      description: string,
      startTimeDateUTC: string,
      endTimeDateUTC: string,
      timeZone?: string | null,
      duration?: string | null,
      measures?: string | null,
      partId?: string | null,
      template: Bool,
      templateId: string,
      deleted: Bool,
      shiftType?: Shift | null,
      createdAt?: string | null,
      updatedAt?: string | null,
      lostVehicles?: number | null,
      m100?: number | null,
      index?: number | null,
      isSolved?: Bool | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListTemplatesByUnitQueryVariables = {
  unitId?: string | null,
  template?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModeldisruptionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTemplatesByUnitQuery = {
  listTemplatesByUnit?:  {
    __typename: "ModeldisruptionConnection",
    items:  Array< {
      __typename: "disruption",
      id: string,
      unitId: string,
      cycleStationId: string,
      teamId?: string | null,
      originatorId?: string | null,
      disLocation?: string | null,
      disLocationSpecification?: string | null,
      disLocationType?: string | null,
      description: string,
      startTimeDateUTC: string,
      endTimeDateUTC: string,
      timeZone?: string | null,
      duration?: string | null,
      measures?: string | null,
      partId?: string | null,
      template: Bool,
      templateId: string,
      deleted: Bool,
      shiftType?: Shift | null,
      createdAt?: string | null,
      updatedAt?: string | null,
      lostVehicles?: number | null,
      m100?: number | null,
      index?: number | null,
      isSolved?: Bool | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type DisruptionByUnitIdAndStartTimeDateUTCQueryVariables = {
  unitId?: string | null,
  startTimeDateUTC?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModeldisruptionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type DisruptionByUnitIdAndStartTimeDateUTCQuery = {
  disruptionByUnitIdAndStartTimeDateUTC?:  {
    __typename: "ModeldisruptionConnection",
    items:  Array< {
      __typename: "disruption",
      id: string,
      unitId: string,
      cycleStationId: string,
      teamId?: string | null,
      originatorId?: string | null,
      disLocation?: string | null,
      disLocationSpecification?: string | null,
      disLocationType?: string | null,
      description: string,
      startTimeDateUTC: string,
      endTimeDateUTC: string,
      timeZone?: string | null,
      duration?: string | null,
      measures?: string | null,
      partId?: string | null,
      template: Bool,
      templateId: string,
      deleted: Bool,
      shiftType?: Shift | null,
      createdAt?: string | null,
      updatedAt?: string | null,
      lostVehicles?: number | null,
      m100?: number | null,
      index?: number | null,
      isSolved?: Bool | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type DisruptionByTemplateIdAndStartTimeDateUTCQueryVariables = {
  templateId?: string | null,
  startTimeDateUTC?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModeldisruptionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type DisruptionByTemplateIdAndStartTimeDateUTCQuery = {
  disruptionByTemplateIdAndStartTimeDateUTC?:  {
    __typename: "ModeldisruptionConnection",
    items:  Array< {
      __typename: "disruption",
      id: string,
      unitId: string,
      cycleStationId: string,
      teamId?: string | null,
      originatorId?: string | null,
      disLocation?: string | null,
      disLocationSpecification?: string | null,
      disLocationType?: string | null,
      description: string,
      startTimeDateUTC: string,
      endTimeDateUTC: string,
      timeZone?: string | null,
      duration?: string | null,
      measures?: string | null,
      partId?: string | null,
      template: Bool,
      templateId: string,
      deleted: Bool,
      shiftType?: Shift | null,
      createdAt?: string | null,
      updatedAt?: string | null,
      lostVehicles?: number | null,
      m100?: number | null,
      index?: number | null,
      isSolved?: Bool | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMeasureReportQueryVariables = {
  id: string,
};

export type GetMeasureReportQuery = {
  getMeasureReport?:  {
    __typename: "MeasureReport",
    id: string,
    templateId?: string | null,
    subDepartment?: string | null,
    description: string,
    notes?: string | null,
    firstOccurrence?: string | null,
    productNumber?: string | null,
    totalDuration?: string | null,
    frequency?: number | null,
    unitId: string,
    classifications?: string | null,
    cycleStationName?: string | null,
    isCritical?: Bool | null,
    progress?: Progress | null,
    attachments?: string | null,
    what?: string | null,
    when?: string | null,
    where?: string | null,
    causes?: string | null,
    reportId: string,
    status?: Status | null,
    dueDate?: string | null,
    createdAt: string,
    updatedAt: string,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type ListMeasureReportsQueryVariables = {
  filter?: ModelMeasureReportFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMeasureReportsQuery = {
  listMeasureReports?:  {
    __typename: "ModelMeasureReportConnection",
    items:  Array< {
      __typename: "MeasureReport",
      id: string,
      templateId?: string | null,
      subDepartment?: string | null,
      description: string,
      notes?: string | null,
      firstOccurrence?: string | null,
      productNumber?: string | null,
      totalDuration?: string | null,
      frequency?: number | null,
      unitId: string,
      classifications?: string | null,
      cycleStationName?: string | null,
      isCritical?: Bool | null,
      progress?: Progress | null,
      attachments?: string | null,
      what?: string | null,
      when?: string | null,
      where?: string | null,
      causes?: string | null,
      reportId: string,
      status?: Status | null,
      dueDate?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListMeasuresQueryVariables = {
  reportId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMeasureReportFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMeasuresQuery = {
  listMeasures?:  {
    __typename: "ModelMeasureReportConnection",
    items:  Array< {
      __typename: "MeasureReport",
      id: string,
      templateId?: string | null,
      subDepartment?: string | null,
      description: string,
      notes?: string | null,
      firstOccurrence?: string | null,
      productNumber?: string | null,
      totalDuration?: string | null,
      frequency?: number | null,
      unitId: string,
      classifications?: string | null,
      cycleStationName?: string | null,
      isCritical?: Bool | null,
      progress?: Progress | null,
      attachments?: string | null,
      what?: string | null,
      when?: string | null,
      where?: string | null,
      causes?: string | null,
      reportId: string,
      status?: Status | null,
      dueDate?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetGroupingQueryVariables = {
  id: string,
};

export type GetGroupingQuery = {
  getGrouping?:  {
    __typename: "Grouping",
    id: string,
    groupingName: string,
    allowedDepartments?: Array< string > | null,
    createdAt: string,
    updatedAt: string,
    units?:  {
      __typename: "ModelUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type ListGroupingsQueryVariables = {
  filter?: ModelGroupingFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGroupingsQuery = {
  listGroupings?:  {
    __typename: "ModelGroupingConnection",
    items:  Array< {
      __typename: "Grouping",
      id: string,
      groupingName: string,
      allowedDepartments?: Array< string > | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTeamQueryVariables = {
  id: string,
};

export type GetTeamQuery = {
  getTeam?:  {
    __typename: "Team",
    id: string,
    name: string,
    unitId: string,
    index: number,
    createdAt: string,
    updatedAt: string,
    templates?:  {
      __typename: "ModeldisruptionConnection",
      nextToken?: string | null,
    } | null,
    cycleStations?:  {
      __typename: "ModelCycleStationConnection",
      nextToken?: string | null,
    } | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type ListTeamsQueryVariables = {
  filter?: ModelTeamFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTeamsQuery = {
  listTeams?:  {
    __typename: "ModelTeamConnection",
    items:  Array< {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type TeamsByUnitQueryVariables = {
  unitId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTeamFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type TeamsByUnitQuery = {
  teamsByUnit?:  {
    __typename: "ModelTeamConnection",
    items:  Array< {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetCycleStationQueryVariables = {
  id: string,
};

export type GetCycleStationQuery = {
  getCycleStation?:  {
    __typename: "CycleStation",
    id: string,
    unitId: string,
    teamId?: string | null,
    name: string,
    isActive: Bool,
    index: number,
    createdAt: string,
    updatedAt: string,
    templates?:  {
      __typename: "ModeldisruptionConnection",
      nextToken?: string | null,
    } | null,
    team?:  {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type ListCycleStationsQueryVariables = {
  filter?: ModelCycleStationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCycleStationsQuery = {
  listCycleStations?:  {
    __typename: "ModelCycleStationConnection",
    items:  Array< {
      __typename: "CycleStation",
      id: string,
      unitId: string,
      teamId?: string | null,
      name: string,
      isActive: Bool,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CycleStationsByUnitQueryVariables = {
  unitId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelCycleStationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type CycleStationsByUnitQuery = {
  cycleStationsByUnit?:  {
    __typename: "ModelCycleStationConnection",
    items:  Array< {
      __typename: "CycleStation",
      id: string,
      unitId: string,
      teamId?: string | null,
      name: string,
      isActive: Bool,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CycleStationsByTeamQueryVariables = {
  teamId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelCycleStationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type CycleStationsByTeamQuery = {
  cycleStationsByTeam?:  {
    __typename: "ModelCycleStationConnection",
    items:  Array< {
      __typename: "CycleStation",
      id: string,
      unitId: string,
      teamId?: string | null,
      name: string,
      isActive: Bool,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ActiveCycleStationsByUnitQueryVariables = {
  unitId?: string | null,
  isActive?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelCycleStationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ActiveCycleStationsByUnitQuery = {
  activeCycleStationsByUnit?:  {
    __typename: "ModelCycleStationConnection",
    items:  Array< {
      __typename: "CycleStation",
      id: string,
      unitId: string,
      teamId?: string | null,
      name: string,
      isActive: Bool,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ActiveCycleStationsByTeamQueryVariables = {
  teamId?: string | null,
  isActive?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelCycleStationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ActiveCycleStationsByTeamQuery = {
  activeCycleStationsByTeam?:  {
    __typename: "ModelCycleStationConnection",
    items:  Array< {
      __typename: "CycleStation",
      id: string,
      unitId: string,
      teamId?: string | null,
      name: string,
      isActive: Bool,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUnitQueryVariables = {
  id: string,
};

export type GetUnitQuery = {
  getUnit?:  {
    __typename: "Unit",
    id: string,
    name: string,
    shortName: string,
    type: UnitType,
    manufacturer?: string | null,
    speedModes?: string | null,
    groupingId?: string | null,
    unitUserSettingId?: string | null,
    unitProblemClassificationId?: string | null,
    m100Range?:  {
      __typename: "M100Range",
      min: number,
      max: number,
    } | null,
    machineId: string,
    createdAt: string,
    updatedAt: string,
    templates?:  {
      __typename: "ModeldisruptionConnection",
      nextToken?: string | null,
    } | null,
    grouping?:  {
      __typename: "Grouping",
      id: string,
      groupingName: string,
      allowedDepartments?: Array< string > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    teams?:  {
      __typename: "ModelTeamConnection",
      nextToken?: string | null,
    } | null,
    cycleStations?:  {
      __typename: "ModelCycleStationConnection",
      nextToken?: string | null,
    } | null,
    unitProblemClassification?:  {
      __typename: "UnitProblemClassification",
      id: string,
      classification?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    unitUserSetting?:  {
      __typename: "UnitUserSetting",
      id: string,
      replacer?: Bool | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    parts?:  {
      __typename: "ModelPartUnitConnection",
      nextToken?: string | null,
    } | null,
    shiftModels?:  {
      __typename: "ModelShiftModelUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type ListUnitsQueryVariables = {
  filter?: ModelUnitFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUnitsQuery = {
  listUnits?:  {
    __typename: "ModelUnitConnection",
    items:  Array< {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UnitsByGroupingQueryVariables = {
  groupingId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUnitFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UnitsByGroupingQuery = {
  unitsByGrouping?:  {
    __typename: "ModelUnitConnection",
    items:  Array< {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UnitByMachineIdQueryVariables = {
  machineId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUnitFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UnitByMachineIdQuery = {
  unitByMachineId?:  {
    __typename: "ModelUnitConnection",
    items:  Array< {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUnitProblemClassificationQueryVariables = {
  id: string,
};

export type GetUnitProblemClassificationQuery = {
  getUnitProblemClassification?:  {
    __typename: "UnitProblemClassification",
    id: string,
    classification?: string | null,
    createdAt: string,
    updatedAt: string,
    units?:  {
      __typename: "ModelUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type ListUnitProblemClassificationsQueryVariables = {
  filter?: ModelUnitProblemClassificationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUnitProblemClassificationsQuery = {
  listUnitProblemClassifications?:  {
    __typename: "ModelUnitProblemClassificationConnection",
    items:  Array< {
      __typename: "UnitProblemClassification",
      id: string,
      classification?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUnitUserSettingQueryVariables = {
  id: string,
};

export type GetUnitUserSettingQuery = {
  getUnitUserSetting?:  {
    __typename: "UnitUserSetting",
    id: string,
    replacer?: Bool | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUnitUserSettingsQueryVariables = {
  filter?: ModelUnitUserSettingFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUnitUserSettingsQuery = {
  listUnitUserSettings?:  {
    __typename: "ModelUnitUserSettingConnection",
    items:  Array< {
      __typename: "UnitUserSetting",
      id: string,
      replacer?: Bool | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPartUnitQueryVariables = {
  id: string,
};

export type GetPartUnitQuery = {
  getPartUnit?:  {
    __typename: "PartUnit",
    id: string,
    unitId: string,
    partId: string,
    targetCycleTime?: number | null,
    createdAt: string,
    updatedAt: string,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    part?:  {
      __typename: "Part",
      id: string,
      partNumber: string,
      name: string,
      qualityIssueConfig?: string | null,
      imageFront?: string | null,
      imageBack?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type ListPartUnitsQueryVariables = {
  filter?: ModelPartUnitFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPartUnitsQuery = {
  listPartUnits?:  {
    __typename: "ModelPartUnitConnection",
    items:  Array< {
      __typename: "PartUnit",
      id: string,
      unitId: string,
      partId: string,
      targetCycleTime?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPartQueryVariables = {
  id: string,
};

export type GetPartQuery = {
  getPart?:  {
    __typename: "Part",
    id: string,
    partNumber: string,
    name: string,
    qualityIssueConfig?: string | null,
    imageFront?: string | null,
    imageBack?: string | null,
    createdAt: string,
    updatedAt: string,
    units?:  {
      __typename: "ModelPartUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type ListPartsQueryVariables = {
  filter?: ModelPartFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPartsQuery = {
  listParts?:  {
    __typename: "ModelPartConnection",
    items:  Array< {
      __typename: "Part",
      id: string,
      partNumber: string,
      name: string,
      qualityIssueConfig?: string | null,
      imageFront?: string | null,
      imageBack?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetActualCountQueryVariables = {
  id: string,
};

export type GetActualCountQuery = {
  getActualCount?:  {
    __typename: "actualCount",
    id: string,
    dateTimeStartUTC: string,
    dateTimeEndUTC: string,
    downtime?: string | null,
    timeZone: string,
    shift: Shift,
    shiftModelId: string,
    initialActualCount?: number | null,
    actualCount?: number | null,
    vehicleNumber?:  {
      __typename: "VehicleNumber",
      from?: number | null,
      until?: number | null,
    } | null,
    quota: number,
    defective?: number | null,
    partId: string,
    unitId: string,
    configurationId: string,
    deleted: Bool,
    type: Type,
    split?: SplitPosition | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    part?:  {
      __typename: "Part",
      id: string,
      partNumber: string,
      name: string,
      qualityIssueConfig?: string | null,
      imageFront?: string | null,
      imageBack?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    configuration?:  {
      __typename: "Configuration",
      id: string,
      target?: number | null,
      shiftTarget: number,
      attendingShift?: AttendingShift | null,
      validFrom: string,
      validUntil: string,
      timeZone: string,
      speedMode?: number | null,
      cycleTime: number,
      partId: string,
      unitId: string,
      shiftModelId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type ListActualCountsQueryVariables = {
  filter?: ModelactualCountFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListActualCountsQuery = {
  listActualCounts?:  {
    __typename: "ModelactualCountConnection",
    items:  Array< {
      __typename: "actualCount",
      id: string,
      dateTimeStartUTC: string,
      dateTimeEndUTC: string,
      downtime?: string | null,
      timeZone: string,
      shift: Shift,
      shiftModelId: string,
      initialActualCount?: number | null,
      actualCount?: number | null,
      quota: number,
      defective?: number | null,
      partId: string,
      unitId: string,
      configurationId: string,
      deleted: Bool,
      type: Type,
      split?: SplitPosition | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type TimeSlotByDeletedAndUpdatedAtQueryVariables = {
  deleted?: Bool | null,
  updatedAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelactualCountFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type TimeSlotByDeletedAndUpdatedAtQuery = {
  timeSlotByDeletedAndUpdatedAt?:  {
    __typename: "ModelactualCountConnection",
    items:  Array< {
      __typename: "actualCount",
      id: string,
      dateTimeStartUTC: string,
      dateTimeEndUTC: string,
      downtime?: string | null,
      timeZone: string,
      shift: Shift,
      shiftModelId: string,
      initialActualCount?: number | null,
      actualCount?: number | null,
      quota: number,
      defective?: number | null,
      partId: string,
      unitId: string,
      configurationId: string,
      deleted: Bool,
      type: Type,
      split?: SplitPosition | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ScheduleSlotByUnitAndDateTimeStartQueryVariables = {
  unitId?: string | null,
  dateTimeStartUTC?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelactualCountFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ScheduleSlotByUnitAndDateTimeStartQuery = {
  scheduleSlotByUnitAndDateTimeStart?:  {
    __typename: "ModelactualCountConnection",
    items:  Array< {
      __typename: "actualCount",
      id: string,
      dateTimeStartUTC: string,
      dateTimeEndUTC: string,
      downtime?: string | null,
      timeZone: string,
      shift: Shift,
      shiftModelId: string,
      initialActualCount?: number | null,
      actualCount?: number | null,
      quota: number,
      defective?: number | null,
      partId: string,
      unitId: string,
      configurationId: string,
      deleted: Bool,
      type: Type,
      split?: SplitPosition | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ScheduleSlotByUnitAndDateTimeEndQueryVariables = {
  unitId?: string | null,
  dateTimeEndUTC?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelactualCountFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ScheduleSlotByUnitAndDateTimeEndQuery = {
  scheduleSlotByUnitAndDateTimeEnd?:  {
    __typename: "ModelactualCountConnection",
    items:  Array< {
      __typename: "actualCount",
      id: string,
      dateTimeStartUTC: string,
      dateTimeEndUTC: string,
      downtime?: string | null,
      timeZone: string,
      shift: Shift,
      shiftModelId: string,
      initialActualCount?: number | null,
      actualCount?: number | null,
      quota: number,
      defective?: number | null,
      partId: string,
      unitId: string,
      configurationId: string,
      deleted: Bool,
      type: Type,
      split?: SplitPosition | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetDefectiveQueryVariables = {
  id: string,
};

export type GetDefectiveQuery = {
  getDefective?:  {
    __typename: "Defective",
    id: string,
    dateTime?: string | null,
    dateTimeUTC?: string | null,
    timeZone?: string | null,
    shift: Shift,
    partId: string,
    unitId: string,
    defectiveGrid?: string | null,
    defectiveType?: string | null,
    defectiveCause?: string | null,
    defectiveLocation?: string | null,
    count?: number | null,
    deleted: Bool,
    createdAt?: string | null,
    updatedAt?: string | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    part?:  {
      __typename: "Part",
      id: string,
      partNumber: string,
      name: string,
      qualityIssueConfig?: string | null,
      imageFront?: string | null,
      imageBack?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type ListDefectivesQueryVariables = {
  filter?: ModelDefectiveFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDefectivesQuery = {
  listDefectives?:  {
    __typename: "ModelDefectiveConnection",
    items:  Array< {
      __typename: "Defective",
      id: string,
      dateTime?: string | null,
      dateTimeUTC?: string | null,
      timeZone?: string | null,
      shift: Shift,
      partId: string,
      unitId: string,
      defectiveGrid?: string | null,
      defectiveType?: string | null,
      defectiveCause?: string | null,
      defectiveLocation?: string | null,
      count?: number | null,
      deleted: Bool,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type DefectivesByDeletedAndUpdatedAtQueryVariables = {
  deleted?: Bool | null,
  updatedAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelDefectiveFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type DefectivesByDeletedAndUpdatedAtQuery = {
  defectivesByDeletedAndUpdatedAt?:  {
    __typename: "ModelDefectiveConnection",
    items:  Array< {
      __typename: "Defective",
      id: string,
      dateTime?: string | null,
      dateTimeUTC?: string | null,
      timeZone?: string | null,
      shift: Shift,
      partId: string,
      unitId: string,
      defectiveGrid?: string | null,
      defectiveType?: string | null,
      defectiveCause?: string | null,
      defectiveLocation?: string | null,
      count?: number | null,
      deleted: Bool,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type DefectiveByUnitIdAndDateTimeUTCQueryVariables = {
  unitId?: string | null,
  dateTimeUTC?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelDefectiveFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type DefectiveByUnitIdAndDateTimeUTCQuery = {
  defectiveByUnitIdAndDateTimeUTC?:  {
    __typename: "ModelDefectiveConnection",
    items:  Array< {
      __typename: "Defective",
      id: string,
      dateTime?: string | null,
      dateTimeUTC?: string | null,
      timeZone?: string | null,
      shift: Shift,
      partId: string,
      unitId: string,
      defectiveGrid?: string | null,
      defectiveType?: string | null,
      defectiveCause?: string | null,
      defectiveLocation?: string | null,
      count?: number | null,
      deleted: Bool,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetOEEQueryVariables = {
  id: string,
};

export type GetOEEQuery = {
  getOEE?:  {
    __typename: "OEE",
    id: string,
    startTimeDateUTC: string,
    endTimeDateUTC: string,
    timeZone?: string | null,
    overall?: number | null,
    availability?: number | null,
    performance?: number | null,
    quality?: number | null,
    actualCountSum?: number | null,
    quotaSum?: number | null,
    netOperatingTimeInMinutes?: number | null,
    targetCycleTimeInMinutes?: number | null,
    disruptionDurationSum?: number | null,
    defectiveCountSum?: number | null,
    unitId: string,
    shiftType?: Shift | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type ListOEEsQueryVariables = {
  filter?: ModelOEEFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListOEEsQuery = {
  listOEEs?:  {
    __typename: "ModelOEEConnection",
    items:  Array< {
      __typename: "OEE",
      id: string,
      startTimeDateUTC: string,
      endTimeDateUTC: string,
      timeZone?: string | null,
      overall?: number | null,
      availability?: number | null,
      performance?: number | null,
      quality?: number | null,
      actualCountSum?: number | null,
      quotaSum?: number | null,
      netOperatingTimeInMinutes?: number | null,
      targetCycleTimeInMinutes?: number | null,
      disruptionDurationSum?: number | null,
      defectiveCountSum?: number | null,
      unitId: string,
      shiftType?: Shift | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListOEEsByUnitIdAndTimeDateUTCQueryVariables = {
  unitId?: string | null,
  startTimeDateUTCEndTimeDateUTC?: ModelOEEListOEEsByUnitIdAndTimeDateUTCCompositeKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelOEEFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListOEEsByUnitIdAndTimeDateUTCQuery = {
  listOEEsByUnitIdAndTimeDateUTC?:  {
    __typename: "ModelOEEConnection",
    items:  Array< {
      __typename: "OEE",
      id: string,
      startTimeDateUTC: string,
      endTimeDateUTC: string,
      timeZone?: string | null,
      overall?: number | null,
      availability?: number | null,
      performance?: number | null,
      quality?: number | null,
      actualCountSum?: number | null,
      quotaSum?: number | null,
      netOperatingTimeInMinutes?: number | null,
      targetCycleTimeInMinutes?: number | null,
      disruptionDurationSum?: number | null,
      defectiveCountSum?: number | null,
      unitId: string,
      shiftType?: Shift | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetScheduleHourQueryVariables = {
  id: string,
};

export type GetScheduleHourQuery = {
  getScheduleHour?:  {
    __typename: "ScheduleHour",
    id: string,
    shiftType: Shift,
    type: Type,
    hoursStartUTC: string,
    hoursEndUTC: string,
    downtime?: string | null,
    timeZone: string,
    shiftModelId: string,
    i: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListScheduleHoursQueryVariables = {
  filter?: ModelScheduleHourFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListScheduleHoursQuery = {
  listScheduleHours?:  {
    __typename: "ModelScheduleHourConnection",
    items:  Array< {
      __typename: "ScheduleHour",
      id: string,
      shiftType: Shift,
      type: Type,
      hoursStartUTC: string,
      hoursEndUTC: string,
      downtime?: string | null,
      timeZone: string,
      shiftModelId: string,
      i: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListScheduleHoursByShiftModelIdQueryVariables = {
  shiftModelId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelScheduleHourFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListScheduleHoursByShiftModelIdQuery = {
  listScheduleHoursByShiftModelId?:  {
    __typename: "ModelScheduleHourConnection",
    items:  Array< {
      __typename: "ScheduleHour",
      id: string,
      shiftType: Shift,
      type: Type,
      hoursStartUTC: string,
      hoursEndUTC: string,
      downtime?: string | null,
      timeZone: string,
      shiftModelId: string,
      i: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetShiftModelQueryVariables = {
  id: string,
};

export type GetShiftModelQuery = {
  getShiftModel?:  {
    __typename: "ShiftModel",
    id: string,
    name: string,
    isActive: Bool,
    timeZone: string,
    createdAt: string,
    updatedAt: string,
    scheduleHours?:  {
      __typename: "ModelScheduleHourConnection",
      nextToken?: string | null,
    } | null,
    units?:  {
      __typename: "ModelShiftModelUnitConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type ListShiftModelsQueryVariables = {
  filter?: ModelShiftModelFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListShiftModelsQuery = {
  listShiftModels?:  {
    __typename: "ModelShiftModelConnection",
    items:  Array< {
      __typename: "ShiftModel",
      id: string,
      name: string,
      isActive: Bool,
      timeZone: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetShiftModelUnitQueryVariables = {
  id: string,
};

export type GetShiftModelUnitQuery = {
  getShiftModelUnit?:  {
    __typename: "ShiftModelUnit",
    id: string,
    unitId: string,
    shiftModelId: string,
    createdAt: string,
    updatedAt: string,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    shiftModel?:  {
      __typename: "ShiftModel",
      id: string,
      name: string,
      isActive: Bool,
      timeZone: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type ListShiftModelUnitsQueryVariables = {
  filter?: ModelShiftModelUnitFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListShiftModelUnitsQuery = {
  listShiftModelUnits?:  {
    __typename: "ModelShiftModelUnitConnection",
    items:  Array< {
      __typename: "ShiftModelUnit",
      id: string,
      unitId: string,
      shiftModelId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetConfigurationQueryVariables = {
  id: string,
};

export type GetConfigurationQuery = {
  getConfiguration?:  {
    __typename: "Configuration",
    id: string,
    target?: number | null,
    shiftTarget: number,
    attendingShift?: AttendingShift | null,
    validFrom: string,
    validUntil: string,
    timeZone: string,
    speedMode?: number | null,
    cycleTime: number,
    partId: string,
    unitId: string,
    shiftModelId: string,
    createdAt: string,
    updatedAt: string,
    shiftModel?:  {
      __typename: "ShiftModel",
      id: string,
      name: string,
      isActive: Bool,
      timeZone: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type ListConfigurationsQueryVariables = {
  filter?: ModelConfigurationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListConfigurationsQuery = {
  listConfigurations?:  {
    __typename: "ModelConfigurationConnection",
    items:  Array< {
      __typename: "Configuration",
      id: string,
      target?: number | null,
      shiftTarget: number,
      attendingShift?: AttendingShift | null,
      validFrom: string,
      validUntil: string,
      timeZone: string,
      speedMode?: number | null,
      cycleTime: number,
      partId: string,
      unitId: string,
      shiftModelId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ConfigurationByUnitAndValidFromQueryVariables = {
  unitId?: string | null,
  validFrom?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelConfigurationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ConfigurationByUnitAndValidFromQuery = {
  configurationByUnitAndValidFrom?:  {
    __typename: "ModelConfigurationConnection",
    items:  Array< {
      __typename: "Configuration",
      id: string,
      target?: number | null,
      shiftTarget: number,
      attendingShift?: AttendingShift | null,
      validFrom: string,
      validUntil: string,
      timeZone: string,
      speedMode?: number | null,
      cycleTime: number,
      partId: string,
      unitId: string,
      shiftModelId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CalculateShiftTargetCustomQueryVariables = {
  input?: CalculateShiftTargetInput | null,
};

export type CalculateShiftTargetCustomQuery = {
  calculateShiftTargetCustom?: number | null,
};

export type DisruptionsByTemplateQueryVariables = {
  templateId: string,
  startTimeDateUTC?: ModelStringKeyConditionInput | null,
  endTimeDateUTC?: ModelStringInput | null,
  unitId: string,
  deleted?: Bool | null,
  limit?: number | null,
};

export type DisruptionsByTemplateQuery = {
  disruptionByTemplateIdAndStartTimeDateUTC?:  {
    __typename: "ModeldisruptionConnection",
    items:  Array< {
      __typename: "disruption",
      id: string,
      description: string,
      templateId: string,
      team?:  {
        __typename: "Team",
        id: string,
      } | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetCycleStationNameQueryVariables = {
  id: string,
};

export type GetCycleStationNameQuery = {
  getUnit?:  {
    __typename: "Unit",
    name: string,
  } | null,
};

export type GetGroupingWithUnitsQueryVariables = {
  id: string,
};

export type GetGroupingWithUnitsQuery = {
  getGrouping?:  {
    __typename: "Grouping",
    id: string,
    groupingName: string,
    allowedDepartments?: Array< string > | null,
    createdAt: string,
    updatedAt: string,
    units?:  {
      __typename: "ModelUnitConnection",
      items:  Array< {
        __typename: "Unit",
        id: string,
        name: string,
        shortName: string,
        type: UnitType,
        manufacturer?: string | null,
        speedModes?: string | null,
        groupingId?: string | null,
        unitUserSettingId?: string | null,
        unitProblemClassificationId?: string | null,
        machineId: string,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
  } | null,
};

export type GetProductWithUnitsQueryVariables = {
  id: string,
};

export type GetProductWithUnitsQuery = {
  getPart?:  {
    __typename: "Part",
    id: string,
    partNumber: string,
    name: string,
    qualityIssueConfig?: string | null,
    imageFront?: string | null,
    imageBack?: string | null,
    createdAt: string,
    updatedAt: string,
    units?:  {
      __typename: "ModelPartUnitConnection",
      items:  Array< {
        __typename: "PartUnit",
        id: string,
        unitId: string,
        partId: string,
        targetCycleTime?: number | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
  } | null,
};

export type GetShiftModelWithScheduleHoursAndUnitsQueryVariables = {
  id: string,
};

export type GetShiftModelWithScheduleHoursAndUnitsQuery = {
  getShiftModel?:  {
    __typename: "ShiftModel",
    id: string,
    name: string,
    isActive: Bool,
    timeZone: string,
    createdAt: string,
    updatedAt: string,
    scheduleHours?:  {
      __typename: "ModelScheduleHourConnection",
      items:  Array< {
        __typename: "ScheduleHour",
        id: string,
        shiftType: Shift,
        type: Type,
        hoursStartUTC: string,
        hoursEndUTC: string,
        downtime?: string | null,
        timeZone: string,
        shiftModelId: string,
        i: number,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    units?:  {
      __typename: "ModelShiftModelUnitConnection",
      items:  Array< {
        __typename: "ShiftModelUnit",
        id: string,
        unitId: string,
        shiftModelId: string,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
  } | null,
};

export type GetCompleteUnitQueryVariables = {
  id: string,
};

export type GetCompleteUnitQuery = {
  getUnit?:  {
    __typename: "Unit",
    id: string,
    name: string,
    shortName: string,
    type: UnitType,
    manufacturer?: string | null,
    speedModes?: string | null,
    groupingId?: string | null,
    unitUserSettingId?: string | null,
    unitProblemClassificationId?: string | null,
    m100Range?:  {
      __typename: "M100Range",
      min: number,
      max: number,
    } | null,
    machineId: string,
    createdAt: string,
    updatedAt: string,
    templates?:  {
      __typename: "ModeldisruptionConnection",
      items:  Array< {
        __typename: "disruption",
        id: string,
        unitId: string,
        cycleStationId: string,
        teamId?: string | null,
        originatorId?: string | null,
        disLocation?: string | null,
        disLocationSpecification?: string | null,
        disLocationType?: string | null,
        description: string,
        startTimeDateUTC: string,
        endTimeDateUTC: string,
        timeZone?: string | null,
        duration?: string | null,
        measures?: string | null,
        partId?: string | null,
        template: Bool,
        templateId: string,
        deleted: Bool,
        shiftType?: Shift | null,
        createdAt?: string | null,
        updatedAt?: string | null,
        lostVehicles?: number | null,
        m100?: number | null,
        index?: number | null,
        isSolved?: Bool | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    grouping?:  {
      __typename: "Grouping",
      id: string,
      groupingName: string,
      allowedDepartments?: Array< string > | null,
      createdAt: string,
      updatedAt: string,
      units?:  {
        __typename: "ModelUnitConnection",
        nextToken?: string | null,
      } | null,
    } | null,
    teams?:  {
      __typename: "ModelTeamConnection",
      items:  Array< {
        __typename: "Team",
        id: string,
        name: string,
        unitId: string,
        index: number,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    cycleStations?:  {
      __typename: "ModelCycleStationConnection",
      items:  Array< {
        __typename: "CycleStation",
        id: string,
        unitId: string,
        teamId?: string | null,
        name: string,
        isActive: Bool,
        index: number,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    unitProblemClassification?:  {
      __typename: "UnitProblemClassification",
      id: string,
      classification?: string | null,
      createdAt: string,
      updatedAt: string,
      units?:  {
        __typename: "ModelUnitConnection",
        nextToken?: string | null,
      } | null,
    } | null,
    unitUserSetting?:  {
      __typename: "UnitUserSetting",
      id: string,
      replacer?: Bool | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    parts?:  {
      __typename: "ModelPartUnitConnection",
      items:  Array< {
        __typename: "PartUnit",
        id: string,
        unitId: string,
        partId: string,
        targetCycleTime?: number | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    shiftModels?:  {
      __typename: "ModelShiftModelUnitConnection",
      items:  Array< {
        __typename: "ShiftModelUnit",
        id: string,
        unitId: string,
        shiftModelId: string,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
  } | null,
};

export type PartsByUnitQueryVariables = {
  id: string,
};

export type PartsByUnitQuery = {
  getUnit?:  {
    __typename: "Unit",
    parts?:  {
      __typename: "ModelPartUnitConnection",
      items:  Array< {
        __typename: "PartUnit",
        part?:  {
          __typename: "Part",
          createdAt: string,
          id: string,
          name: string,
          partNumber: string,
          updatedAt: string,
          qualityIssueConfig?: string | null,
        } | null,
        targetCycleTime?: number | null,
      } | null >,
    } | null,
  } | null,
};

export type GetTemplateByIDQueryVariables = {
  id: string,
};

export type GetTemplateByIDQuery = {
  getDisruption?:  {
    __typename: "disruption",
    id: string,
    cycleStationId: string,
    description: string,
    disLocation?: string | null,
    disLocationSpecification?: string | null,
    disLocationType?: string | null,
    unitId: string,
    team?:  {
      __typename: "Team",
      id: string,
      name: string,
      index: number,
    } | null,
    originatorTeam?:  {
      __typename: "Team",
      id: string,
      name: string,
      index: number,
    } | null,
  } | null,
};

export type GetIssuesByIdQueryVariables = {
  id: string,
};

export type GetIssuesByIdQuery = {
  getDisruption?:  {
    __typename: "disruption",
    id: string,
    issues?:  Array< {
      __typename: "Issue",
      id: string,
      index: number,
      name: string,
    } > | null,
  } | null,
};

export type DisruptionByUnitAndDateTimeQueryVariables = {
  unitId: string,
  startTimeDateUTC?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModeldisruptionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type DisruptionByUnitAndDateTimeQuery = {
  disruptionByUnitIdAndStartTimeDateUTC?:  {
    __typename: "ModeldisruptionConnection",
    items:  Array< {
      __typename: "disruption",
      id: string,
      disLocation?: string | null,
      disLocationSpecification?: string | null,
      disLocationType?: string | null,
      description: string,
      startTimeDateUTC: string,
      endTimeDateUTC: string,
      duration?: string | null,
      measures?: string | null,
      partId?: string | null,
      timeZone?: string | null,
      templateId: string,
      isSolved?: Bool | null,
      cycleStation?:  {
        __typename: "CycleStation",
        id: string,
        name: string,
      } | null,
      team?:  {
        __typename: "Team",
        id: string,
        name: string,
        index: number,
      } | null,
      originatorTeam?:  {
        __typename: "Team",
        id: string,
        name: string,
        index: number,
      } | null,
      lostVehicles?: number | null,
      m100?: number | null,
      issues?:  Array< {
        __typename: "Issue",
        id: string,
        index: number,
        name: string,
      } > | null,
      attachments?:  Array< {
        __typename: "Attachment",
        key: string,
        type: string,
        size: number,
        uploadedBy: string,
        createdAt: string,
      } > | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type DisruptionMeasuresByUnitIdQueryVariables = {
  unitId: string,
  deletedTemplate?: ModeldisruptionDisruptionByUnitIdCompositeKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModeldisruptionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type DisruptionMeasuresByUnitIdQuery = {
  disruptionsByUnitId?:  {
    __typename: "ModeldisruptionConnection",
    items:  Array< {
      __typename: "disruption",
      measures?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type DefectiveByUnitAndDateTimeQueryVariables = {
  unitId: string,
  dateTimeUTC?: ModelStringKeyConditionInput | null,
  filter?: ModelDefectiveFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type DefectiveByUnitAndDateTimeQuery = {
  defectiveByUnitIdAndDateTimeUTC?:  {
    __typename: "ModelDefectiveConnection",
    items:  Array< {
      __typename: "Defective",
      id: string,
      dateTimeUTC?: string | null,
      count?: number | null,
      part?:  {
        __typename: "Part",
        id: string,
        name: string,
      } | null,
      defectiveType?: string | null,
      defectiveCause?: string | null,
      defectiveLocation?: string | null,
      timeZone?: string | null,
      defectiveGrid?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PartsWithUnitDataQueryVariables = {
  filter?: ModelPartFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PartsWithUnitDataQuery = {
  listParts?:  {
    __typename: "ModelPartConnection",
    items:  Array< {
      __typename: "Part",
      createdAt: string,
      id: string,
      name: string,
      partNumber: string,
      qualityIssueConfig?: string | null,
      units?:  {
        __typename: "ModelPartUnitConnection",
        items:  Array< {
          __typename: "PartUnit",
          id: string,
          partId: string,
          targetCycleTime?: number | null,
          unit?:  {
            __typename: "Unit",
            createdAt: string,
            id: string,
            manufacturer?: string | null,
            name: string,
            shortName: string,
            type: UnitType,
          } | null,
        } | null >,
      } | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type DisruptionsClassificationWithUnitQueryVariables = {
};

export type DisruptionsClassificationWithUnitQuery = {
  listUnitProblemClassifications?:  {
    __typename: "ModelUnitProblemClassificationConnection",
    items:  Array< {
      __typename: "UnitProblemClassification",
      units?:  {
        __typename: "ModelUnitConnection",
        items:  Array< {
          __typename: "Unit",
          id: string,
          manufacturer?: string | null,
          name: string,
          shortName: string,
          type: UnitType,
          machineId: string,
        } | null >,
      } | null,
      classification?: string | null,
      id: string,
      createdAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GroupingsWithUnitQueryVariables = {
  filter?: ModelGroupingFilterInput | null,
  unitFilter?: ModelUnitFilterInput | null,
  nextTokenUnit?: string | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GroupingsWithUnitQuery = {
  listGroupings?:  {
    __typename: "ModelGroupingConnection",
    items:  Array< {
      __typename: "Grouping",
      units?:  {
        __typename: "ModelUnitConnection",
        items:  Array< {
          __typename: "Unit",
          name: string,
          manufacturer?: string | null,
          id: string,
          createdAt: string,
          type: UnitType,
          shortName: string,
          machineId: string,
          teams?:  {
            __typename: "ModelTeamConnection",
            items:  Array< {
              __typename: "Team",
              id: string,
              name: string,
              index: number,
            } | null >,
          } | null,
        } | null >,
      } | null,
      groupingName: string,
      createdAt: string,
      id: string,
      allowedDepartments?: Array< string > | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ShiftModelsWithUnitQueryVariables = {
};

export type ShiftModelsWithUnitQuery = {
  listShiftModels?:  {
    __typename: "ModelShiftModelConnection",
    items:  Array< {
      __typename: "ShiftModel",
      createdAt: string,
      updatedAt: string,
      id: string,
      isActive: Bool,
      timeZone: string,
      name: string,
      scheduleHours?:  {
        __typename: "ModelScheduleHourConnection",
        items:  Array< {
          __typename: "ScheduleHour",
          createdAt: string,
          hoursEndUTC: string,
          hoursStartUTC: string,
          downtime?: string | null,
          i: number,
          id: string,
          shiftModelId: string,
          shiftType: Shift,
          timeZone: string,
          type: Type,
        } | null >,
        nextToken?: string | null,
      } | null,
      units?:  {
        __typename: "ModelShiftModelUnitConnection",
        items:  Array< {
          __typename: "ShiftModelUnit",
          createdAt: string,
          id: string,
          unit?:  {
            __typename: "Unit",
            createdAt: string,
            groupingId?: string | null,
            id: string,
            name: string,
            shortName: string,
            type: UnitType,
          } | null,
          shiftModelId: string,
        } | null >,
        nextToken?: string | null,
      } | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ShiftModelWithUnitQueryVariables = {
  id: string,
};

export type ShiftModelWithUnitQuery = {
  getShiftModel?:  {
    __typename: "ShiftModel",
    createdAt: string,
    updatedAt: string,
    id: string,
    isActive: Bool,
    timeZone: string,
    name: string,
    scheduleHours?:  {
      __typename: "ModelScheduleHourConnection",
      items:  Array< {
        __typename: "ScheduleHour",
        createdAt: string,
        hoursEndUTC: string,
        hoursStartUTC: string,
        downtime?: string | null,
        i: number,
        id: string,
        shiftModelId: string,
        shiftType: Shift,
        timeZone: string,
        type: Type,
      } | null >,
      nextToken?: string | null,
    } | null,
    units?:  {
      __typename: "ModelShiftModelUnitConnection",
      items:  Array< {
        __typename: "ShiftModelUnit",
        createdAt: string,
        id: string,
        unit?:  {
          __typename: "Unit",
          createdAt: string,
          groupingId?: string | null,
          id: string,
          name: string,
          shortName: string,
          type: UnitType,
        } | null,
        shiftModelId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
  } | null,
};

export type ScheduleHourIdsQueryVariables = {
  shiftModelId: string,
};

export type ScheduleHourIdsQuery = {
  getShiftModel?:  {
    __typename: "ShiftModel",
    scheduleHours?:  {
      __typename: "ModelScheduleHourConnection",
      items:  Array< {
        __typename: "ScheduleHour",
        id: string,
      } | null >,
    } | null,
  } | null,
};

export type ShiftModelUnitsByShiftQueryVariables = {
  shiftModelId: string,
};

export type ShiftModelUnitsByShiftQuery = {
  getShiftModel?:  {
    __typename: "ShiftModel",
    id: string,
    units?:  {
      __typename: "ModelShiftModelUnitConnection",
      items:  Array< {
        __typename: "ShiftModelUnit",
        id: string,
        shiftModelId: string,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
  } | null,
};

export type ScheduleHoursByShiftQueryVariables = {
  shiftModelId: string,
  shiftType: Shift,
};

export type ScheduleHoursByShiftQuery = {
  getShiftModel?:  {
    __typename: "ShiftModel",
    id: string,
    scheduleHours?:  {
      __typename: "ModelScheduleHourConnection",
      items:  Array< {
        __typename: "ScheduleHour",
        shiftType: Shift,
        type: Type,
        hoursStartUTC: string,
        hoursEndUTC: string,
        downtime?: string | null,
        timeZone: string,
        shiftModelId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
  } | null,
};

export type UnitsByGroupingIdQueryVariables = {
  groupingId: string,
  limit?: number | null,
  filter?: ModelUnitFilterInput | null,
  sortDirection?: ModelSortDirection | null,
  nextToken?: string | null,
};

export type UnitsByGroupingIdQuery = {
  unitsByGrouping?:  {
    __typename: "ModelUnitConnection",
    items:  Array< {
      __typename: "Unit",
      id: string,
      groupingId?: string | null,
      name: string,
      shortName: string,
      type: UnitType,
      speedModes?: string | null,
      m100Range?:  {
        __typename: "M100Range",
        min: number,
        max: number,
      } | null,
      machineId: string,
      teams?:  {
        __typename: "ModelTeamConnection",
        items:  Array< {
          __typename: "Team",
          id: string,
          index: number,
          name: string,
        } | null >,
      } | null,
      shiftModels?:  {
        __typename: "ModelShiftModelUnitConnection",
        nextToken?: string | null,
        items:  Array< {
          __typename: "ShiftModelUnit",
          createdAt: string,
          id: string,
          shiftModelId: string,
          shiftModel?:  {
            __typename: "ShiftModel",
            createdAt: string,
            id: string,
            isActive: Bool,
            name: string,
            timeZone: string,
            scheduleHours?:  {
              __typename: "ModelScheduleHourConnection",
              items:  Array< {
                __typename: "ScheduleHour",
                createdAt: string,
                hoursEndUTC: string,
                hoursStartUTC: string,
                i: number,
                id: string,
                shiftModelId: string,
                shiftType: Shift,
                timeZone: string,
                type: Type,
                updatedAt: string,
              } | null >,
            } | null,
            updatedAt: string,
          } | null,
        } | null >,
      } | null,
      unitProblemClassificationId?: string | null,
      unitProblemClassification?:  {
        __typename: "UnitProblemClassification",
        id: string,
        classification?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UnitsDataQueryVariables = {
  filter?: ModelUnitFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UnitsDataQuery = {
  listUnits?:  {
    __typename: "ModelUnitConnection",
    items:  Array< {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      machineId: string,
      speedModes?: string | null,
      m100Range?:  {
        __typename: "M100Range",
        min: number,
        max: number,
      } | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      createdAt: string,
      updatedAt: string,
      grouping?:  {
        __typename: "Grouping",
        id: string,
        groupingName: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      unitProblemClassification?:  {
        __typename: "UnitProblemClassification",
        id: string,
        classification?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      unitUserSetting?:  {
        __typename: "UnitUserSetting",
        id: string,
        replacer?: Bool | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      parts?:  {
        __typename: "ModelPartUnitConnection",
        nextToken?: string | null,
      } | null,
      shiftModels?:  {
        __typename: "ModelShiftModelUnitConnection",
        nextToken?: string | null,
      } | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type TimeSlotsByUnitAndDateTimeStartCountQueryVariables = {
  unitId: string,
  dateTimeStartUTC?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelactualCountFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type TimeSlotsByUnitAndDateTimeStartCountQuery = {
  scheduleSlotByUnitAndDateTimeStart?:  {
    __typename: "ModelactualCountConnection",
    items:  Array< {
      __typename: "actualCount",
      id: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ScheduleSlotsByUnitAndDateTimeQueryVariables = {
  unitId: string,
  dateTimeStartUTC?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelactualCountFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ScheduleSlotsByUnitAndDateTimeQuery = {
  scheduleSlotByUnitAndDateTimeStart?:  {
    __typename: "ModelactualCountConnection",
    items:  Array< {
      __typename: "actualCount",
      id: string,
      dateTimeStartUTC: string,
      dateTimeEndUTC: string,
      timeZone: string,
      downtime?: string | null,
      type: Type,
      shift: Shift,
      actualCount?: number | null,
      deleted: Bool,
      vehicleNumber?:  {
        __typename: "VehicleNumber",
        from?: number | null,
        until?: number | null,
      } | null,
      quota: number,
      defective?: number | null,
      shiftModelId: string,
      split?: SplitPosition | null,
      partId: string,
      part?:  {
        __typename: "Part",
        id: string,
        partNumber: string,
        name: string,
        units?:  {
          __typename: "ModelPartUnitConnection",
          items:  Array< {
            __typename: "PartUnit",
            targetCycleTime?: number | null,
            partId: string,
            id: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        qualityIssueConfig?: string | null,
        imageFront?: string | null,
        imageBack?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      unitId: string,
      unit?:  {
        __typename: "Unit",
        id: string,
        name: string,
      } | null,
      configurationId: string,
      configuration?:  {
        __typename: "Configuration",
        id: string,
        shiftTarget: number,
        validFrom: string,
        validUntil: string,
        timeZone: string,
        speedMode?: number | null,
        shiftModel?:  {
          __typename: "ShiftModel",
          createdAt: string,
          id: string,
          isActive: Bool,
          name: string,
          timeZone: string,
          scheduleHours?:  {
            __typename: "ModelScheduleHourConnection",
            items:  Array< {
              __typename: "ScheduleHour",
              createdAt: string,
              hoursEndUTC: string,
              hoursStartUTC: string,
              i: number,
              id: string,
              shiftModelId: string,
              shiftType: Shift,
              timeZone: string,
              type: Type,
              updatedAt: string,
            } | null >,
          } | null,
        } | null,
        partId: string,
        unitId: string,
        shiftModelId: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type TeamsByUnitIdQueryVariables = {
  unitId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTeamFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type TeamsByUnitIdQuery = {
  teamsByUnit?:  {
    __typename: "ModelTeamConnection",
    items:  Array< {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type TeamsAndCycleStationsByUnitQueryVariables = {
  unitId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTeamFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type TeamsAndCycleStationsByUnitQuery = {
  teamsByUnit?:  {
    __typename: "ModelTeamConnection",
    items:  Array< {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
      cycleStations?:  {
        __typename: "ModelCycleStationConnection",
        items:  Array< {
          __typename: "CycleStation",
          id: string,
          unitId: string,
          name: string,
          isActive: Bool,
          index: number,
        } | null >,
        nextToken?: string | null,
      } | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CycleStationsByTeamIdQueryVariables = {
  teamId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelCycleStationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type CycleStationsByTeamIdQuery = {
  cycleStationsByTeam?:  {
    __typename: "ModelCycleStationConnection",
    items:  Array< {
      __typename: "CycleStation",
      id: string,
      unitId: string,
      name: string,
      isActive: Bool,
      index: number,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CycleStationsByUnitIdQueryVariables = {
  unitId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelCycleStationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type CycleStationsByUnitIdQuery = {
  cycleStationsByUnit?:  {
    __typename: "ModelCycleStationConnection",
    items:  Array< {
      __typename: "CycleStation",
      id: string,
      unitId: string,
      name: string,
      isActive: Bool,
      index: number,
      teamId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ActiveCycleStationsByTeamIdQueryVariables = {
  teamId?: string | null,
  isActive?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelCycleStationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ActiveCycleStationsByTeamIdQuery = {
  activeCycleStationsByTeam?:  {
    __typename: "ModelCycleStationConnection",
    items:  Array< {
      __typename: "CycleStation",
      id: string,
      unitId: string,
      name: string,
      isActive: Bool,
      index: number,
      teamId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ActiveCycleStationsByUnitIdQueryVariables = {
  unitId?: string | null,
  isActive?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelCycleStationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ActiveCycleStationsByUnitIdQuery = {
  activeCycleStationsByUnit?:  {
    __typename: "ModelCycleStationConnection",
    items:  Array< {
      __typename: "CycleStation",
      id: string,
      unitId: string,
      name: string,
      isActive: Bool,
      index: number,
      teamId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type TemplatesByUnitQueryVariables = {
  unitId?: string | null,
  template?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModeldisruptionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type TemplatesByUnitQuery = {
  listTemplatesByUnit?:  {
    __typename: "ModeldisruptionConnection",
    items:  Array< {
      __typename: "disruption",
      id: string,
      description: string,
      index?: number | null,
      cycleStationId: string,
      originatorTeam?:  {
        __typename: "Team",
        id: string,
        name: string,
        index: number,
      } | null,
      issues?:  Array< {
        __typename: "Issue",
        id: string,
        name: string,
        index: number,
      } > | null,
      disLocation?: string | null,
      disLocationSpecification?: string | null,
      disLocationType?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UnitBasicDataQueryVariables = {
  id: string,
};

export type UnitBasicDataQuery = {
  getUnit?:  {
    __typename: "Unit",
    id: string,
    name: string,
    shortName: string,
    type: UnitType,
    manufacturer?: string | null,
    speedModes?: string | null,
    groupingId?: string | null,
    unitUserSettingId?: string | null,
    unitProblemClassificationId?: string | null,
    m100Range?:  {
      __typename: "M100Range",
      min: number,
      max: number,
    } | null,
    machineId: string,
  } | null,
};

export type ShiftModelBasicDataQueryVariables = {
  id: string,
};

export type ShiftModelBasicDataQuery = {
  getShiftModel?:  {
    __typename: "ShiftModel",
    id: string,
    name: string,
  } | null,
};

export type OeeIdsByUnitAndDateTimeUTCQueryVariables = {
  unitId: string,
  startTimeDateUTCEndTimeDateUTC?: ModelOEEListOEEsByUnitIdAndTimeDateUTCCompositeKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelOEEFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type OeeIdsByUnitAndDateTimeUTCQuery = {
  listOEEsByUnitIdAndTimeDateUTC?:  {
    __typename: "ModelOEEConnection",
    items:  Array< {
      __typename: "OEE",
      id: string,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MeasuresBasicDataQueryVariables = {
  reportId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMeasureReportFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MeasuresBasicDataQuery = {
  listMeasures?:  {
    __typename: "ModelMeasureReportConnection",
    items:  Array< {
      __typename: "MeasureReport",
      id: string,
      description: string,
      isCritical?: Bool | null,
      reportId: string,
      progress?: Progress | null,
      subDepartment?: string | null,
      attachments?: string | null,
      status?: Status | null,
      dueDate?: string | null,
      templateId?: string | null,
      classifications?: string | null,
      cycleStationName?: string | null,
      unitId: string,
      productNumber?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MeasureIdsQueryVariables = {
  reportId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMeasureReportFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MeasureIdsQuery = {
  listMeasures?:  {
    __typename: "ModelMeasureReportConnection",
    items:  Array< {
      __typename: "MeasureReport",
      id: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UnitByMachineDataQueryVariables = {
  machineId: string,
  filter?: ModelUnitFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UnitByMachineDataQuery = {
  unitByMachineId?:  {
    __typename: "ModelUnitConnection",
    items:  Array< {
      __typename: "Unit",
      id: string,
      machineId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UnitsMachineDataQueryVariables = {
  filter?: ModelUnitFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UnitsMachineDataQuery = {
  listUnits?:  {
    __typename: "ModelUnitConnection",
    items:  Array< {
      __typename: "Unit",
      id: string,
      machineId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnAddDisruptionSubscriptionVariables = {
  unitId: string,
};

export type OnAddDisruptionSubscription = {
  onAddDisruption?:  {
    __typename: "disruption",
    id: string,
    unitId: string,
    cycleStationId: string,
    teamId?: string | null,
    originatorId?: string | null,
    disLocation?: string | null,
    disLocationSpecification?: string | null,
    disLocationType?: string | null,
    description: string,
    startTimeDateUTC: string,
    endTimeDateUTC: string,
    timeZone?: string | null,
    duration?: string | null,
    measures?: string | null,
    partId?: string | null,
    template: Bool,
    templateId: string,
    deleted: Bool,
    shiftType?: Shift | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    lostVehicles?: number | null,
    issues?:  Array< {
      __typename: "Issue",
      id: string,
      name: string,
      index: number,
    } > | null,
    attachments?:  Array< {
      __typename: "Attachment",
      key: string,
      type: string,
      size: number,
      uploadedBy: string,
      createdAt: string,
    } > | null,
    m100?: number | null,
    index?: number | null,
    isSolved?: Bool | null,
    team?:  {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    originatorTeam?:  {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    cycleStation?:  {
      __typename: "CycleStation",
      id: string,
      unitId: string,
      teamId?: string | null,
      name: string,
      isActive: Bool,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type OnMutateActualCountSubscriptionVariables = {
  unitId: string,
};

export type OnMutateActualCountSubscription = {
  onMutateActualCount?:  {
    __typename: "actualCount",
    id: string,
    dateTimeStartUTC: string,
    dateTimeEndUTC: string,
    downtime?: string | null,
    timeZone: string,
    shift: Shift,
    shiftModelId: string,
    initialActualCount?: number | null,
    actualCount?: number | null,
    vehicleNumber?:  {
      __typename: "VehicleNumber",
      from?: number | null,
      until?: number | null,
    } | null,
    quota: number,
    defective?: number | null,
    partId: string,
    unitId: string,
    configurationId: string,
    deleted: Bool,
    type: Type,
    split?: SplitPosition | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    part?:  {
      __typename: "Part",
      id: string,
      partNumber: string,
      name: string,
      qualityIssueConfig?: string | null,
      imageFront?: string | null,
      imageBack?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    configuration?:  {
      __typename: "Configuration",
      id: string,
      target?: number | null,
      shiftTarget: number,
      attendingShift?: AttendingShift | null,
      validFrom: string,
      validUntil: string,
      timeZone: string,
      speedMode?: number | null,
      cycleTime: number,
      partId: string,
      unitId: string,
      shiftModelId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type OnMutateDisruptionSubscriptionVariables = {
  unitId: string,
};

export type OnMutateDisruptionSubscription = {
  onMutateDisruption?:  {
    __typename: "disruption",
    id: string,
    unitId: string,
    cycleStationId: string,
    teamId?: string | null,
    originatorId?: string | null,
    disLocation?: string | null,
    disLocationSpecification?: string | null,
    disLocationType?: string | null,
    description: string,
    startTimeDateUTC: string,
    endTimeDateUTC: string,
    timeZone?: string | null,
    duration?: string | null,
    measures?: string | null,
    partId?: string | null,
    template: Bool,
    templateId: string,
    deleted: Bool,
    shiftType?: Shift | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    lostVehicles?: number | null,
    issues?:  Array< {
      __typename: "Issue",
      id: string,
      name: string,
      index: number,
    } > | null,
    attachments?:  Array< {
      __typename: "Attachment",
      key: string,
      type: string,
      size: number,
      uploadedBy: string,
      createdAt: string,
    } > | null,
    m100?: number | null,
    index?: number | null,
    isSolved?: Bool | null,
    team?:  {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    originatorTeam?:  {
      __typename: "Team",
      id: string,
      name: string,
      unitId: string,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    cycleStation?:  {
      __typename: "CycleStation",
      id: string,
      unitId: string,
      teamId?: string | null,
      name: string,
      isActive: Bool,
      index: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    unit?:  {
      __typename: "Unit",
      id: string,
      name: string,
      shortName: string,
      type: UnitType,
      manufacturer?: string | null,
      speedModes?: string | null,
      groupingId?: string | null,
      unitUserSettingId?: string | null,
      unitProblemClassificationId?: string | null,
      machineId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type OnStartShiftSubscriptionVariables = {
  unitId: string,
};

export type OnStartShiftSubscription = {
  onStartShift?: string | null,
};
