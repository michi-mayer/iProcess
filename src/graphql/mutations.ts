/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const calculateOEE = /* GraphQL */ `mutation CalculateOEE($input: TimeRange) {
  calculateOEE(input: $input) {
    id
    startTimeDateUTC
    endTimeDateUTC
    timeZone
    overall
    availability
    performance
    quality
    actualCountSum
    quotaSum
    netOperatingTimeInMinutes
    targetCycleTimeInMinutes
    disruptionDurationSum
    defectiveCountSum
    unitId
    shiftType
    createdAt
    updatedAt
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.CalculateOEEMutationVariables,
  APITypes.CalculateOEEMutation
>;
export const mutateMeasureReport = /* GraphQL */ `mutation MutateMeasureReport($put: MeasureReportInput, $delete: DeleteInput) {
  mutateMeasureReport(put: $put, delete: $delete)
}
` as GeneratedMutation<
  APITypes.MutateMeasureReportMutationVariables,
  APITypes.MutateMeasureReportMutation
>;
export const mutateProduct = /* GraphQL */ `mutation MutateProduct($put: ProductInput, $delete: DeleteInput) {
  mutateProduct(put: $put, delete: $delete)
}
` as GeneratedMutation<
  APITypes.MutateProductMutationVariables,
  APITypes.MutateProductMutation
>;
export const mutateUnit = /* GraphQL */ `mutation MutateUnit($put: UnitInput, $delete: DeleteInput) {
  mutateUnit(put: $put, delete: $delete)
}
` as GeneratedMutation<
  APITypes.MutateUnitMutationVariables,
  APITypes.MutateUnitMutation
>;
export const mutateShiftModel = /* GraphQL */ `mutation MutateShiftModel(
  $put: ShiftModelInput
  $duplicate: DuplicateInput
  $delete: DeleteInput
) {
  mutateShiftModel(put: $put, duplicate: $duplicate, delete: $delete)
}
` as GeneratedMutation<
  APITypes.MutateShiftModelMutationVariables,
  APITypes.MutateShiftModelMutation
>;
export const mutateTemplates = /* GraphQL */ `mutation MutateTemplates($put: [TemplateInput!]!) {
  mutateTemplates(put: $put)
}
` as GeneratedMutation<
  APITypes.MutateTemplatesMutationVariables,
  APITypes.MutateTemplatesMutation
>;
export const createGroupingCustom = /* GraphQL */ `mutation CreateGroupingCustom($put: LambdaGroupingInput) {
  createGroupingCustom(put: $put)
}
` as GeneratedMutation<
  APITypes.CreateGroupingCustomMutationVariables,
  APITypes.CreateGroupingCustomMutation
>;
export const updateGroupingCustom = /* GraphQL */ `mutation UpdateGroupingCustom($put: LambdaGroupingInput) {
  updateGroupingCustom(put: $put)
}
` as GeneratedMutation<
  APITypes.UpdateGroupingCustomMutationVariables,
  APITypes.UpdateGroupingCustomMutation
>;
export const deleteGroupingCustom = /* GraphQL */ `mutation DeleteGroupingCustom($delete: DeleteInput!) {
  deleteGroupingCustom(delete: $delete)
}
` as GeneratedMutation<
  APITypes.DeleteGroupingCustomMutationVariables,
  APITypes.DeleteGroupingCustomMutation
>;
export const createUnitProblemClassificationCustom = /* GraphQL */ `mutation CreateUnitProblemClassificationCustom(
  $input: UnitProblemClassificationInput
) {
  createUnitProblemClassificationCustom(input: $input)
}
` as GeneratedMutation<
  APITypes.CreateUnitProblemClassificationCustomMutationVariables,
  APITypes.CreateUnitProblemClassificationCustomMutation
>;
export const deleteUnitProblemClassificationCustom = /* GraphQL */ `mutation DeleteUnitProblemClassificationCustom($id: ID) {
  deleteUnitProblemClassificationCustom(id: $id)
}
` as GeneratedMutation<
  APITypes.DeleteUnitProblemClassificationCustomMutationVariables,
  APITypes.DeleteUnitProblemClassificationCustomMutation
>;
export const updateUnitProblemClassificationCustom = /* GraphQL */ `mutation UpdateUnitProblemClassificationCustom(
  $input: UnitProblemClassificationInput
) {
  updateUnitProblemClassificationCustom(input: $input)
}
` as GeneratedMutation<
  APITypes.UpdateUnitProblemClassificationCustomMutationVariables,
  APITypes.UpdateUnitProblemClassificationCustomMutation
>;
export const startShift = /* GraphQL */ `mutation StartShift($input: StartShiftInput!) {
  startShift(input: $input)
}
` as GeneratedMutation<
  APITypes.StartShiftMutationVariables,
  APITypes.StartShiftMutation
>;
export const deleteConfigurationCustom = /* GraphQL */ `mutation DeleteConfigurationCustom($id: ID) {
  deleteConfigurationCustom(id: $id)
}
` as GeneratedMutation<
  APITypes.DeleteConfigurationCustomMutationVariables,
  APITypes.DeleteConfigurationCustomMutation
>;
export const updateConfigurationsAndActualCounts = /* GraphQL */ `mutation UpdateConfigurationsAndActualCounts(
  $input: UpdateConfigurationsAndActualCountsInput
) {
  updateConfigurationsAndActualCounts(input: $input)
}
` as GeneratedMutation<
  APITypes.UpdateConfigurationsAndActualCountsMutationVariables,
  APITypes.UpdateConfigurationsAndActualCountsMutation
>;
export const createDisruption = /* GraphQL */ `mutation CreateDisruption(
  $input: CreateDisruptionInput!
  $condition: ModeldisruptionConditionInput
) {
  createDisruption(input: $input, condition: $condition) {
    id
    unitId
    cycleStationId
    teamId
    originatorId
    disLocation
    disLocationSpecification
    disLocationType
    description
    startTimeDateUTC
    endTimeDateUTC
    timeZone
    duration
    measures
    partId
    template
    templateId
    deleted
    shiftType
    createdAt
    updatedAt
    lostVehicles
    issues {
      id
      name
      index
    }
    attachments {
      key
      type
      size
      uploadedBy
      createdAt
    }
    m100
    index
    isSolved
    team {
      id
      name
      unitId
      index
      createdAt
      updatedAt
    }
    originatorTeam {
      id
      name
      unitId
      index
      createdAt
      updatedAt
    }
    cycleStation {
      id
      unitId
      teamId
      name
      isActive
      index
      createdAt
      updatedAt
    }
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.CreateDisruptionMutationVariables,
  APITypes.CreateDisruptionMutation
>;
export const updateDisruption = /* GraphQL */ `mutation UpdateDisruption(
  $input: UpdateDisruptionInput!
  $condition: ModeldisruptionConditionInput
) {
  updateDisruption(input: $input, condition: $condition) {
    id
    unitId
    cycleStationId
    teamId
    originatorId
    disLocation
    disLocationSpecification
    disLocationType
    description
    startTimeDateUTC
    endTimeDateUTC
    timeZone
    duration
    measures
    partId
    template
    templateId
    deleted
    shiftType
    createdAt
    updatedAt
    lostVehicles
    issues {
      id
      name
      index
    }
    attachments {
      key
      type
      size
      uploadedBy
      createdAt
    }
    m100
    index
    isSolved
    team {
      id
      name
      unitId
      index
      createdAt
      updatedAt
    }
    originatorTeam {
      id
      name
      unitId
      index
      createdAt
      updatedAt
    }
    cycleStation {
      id
      unitId
      teamId
      name
      isActive
      index
      createdAt
      updatedAt
    }
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.UpdateDisruptionMutationVariables,
  APITypes.UpdateDisruptionMutation
>;
export const deleteDisruption = /* GraphQL */ `mutation DeleteDisruption(
  $input: DeleteDisruptionInput!
  $condition: ModeldisruptionConditionInput
) {
  deleteDisruption(input: $input, condition: $condition) {
    id
    unitId
    cycleStationId
    teamId
    originatorId
    disLocation
    disLocationSpecification
    disLocationType
    description
    startTimeDateUTC
    endTimeDateUTC
    timeZone
    duration
    measures
    partId
    template
    templateId
    deleted
    shiftType
    createdAt
    updatedAt
    lostVehicles
    issues {
      id
      name
      index
    }
    attachments {
      key
      type
      size
      uploadedBy
      createdAt
    }
    m100
    index
    isSolved
    team {
      id
      name
      unitId
      index
      createdAt
      updatedAt
    }
    originatorTeam {
      id
      name
      unitId
      index
      createdAt
      updatedAt
    }
    cycleStation {
      id
      unitId
      teamId
      name
      isActive
      index
      createdAt
      updatedAt
    }
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.DeleteDisruptionMutationVariables,
  APITypes.DeleteDisruptionMutation
>;
export const createMeasureReport = /* GraphQL */ `mutation CreateMeasureReport(
  $input: CreateMeasureReportInput!
  $condition: ModelMeasureReportConditionInput
) {
  createMeasureReport(input: $input, condition: $condition) {
    id
    templateId
    subDepartment
    description
    notes
    firstOccurrence
    productNumber
    totalDuration
    frequency
    unitId
    classifications
    cycleStationName
    isCritical
    progress
    attachments
    what
    when
    where
    causes
    reportId
    status
    dueDate
    createdAt
    updatedAt
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.CreateMeasureReportMutationVariables,
  APITypes.CreateMeasureReportMutation
>;
export const updateMeasureReport = /* GraphQL */ `mutation UpdateMeasureReport(
  $input: UpdateMeasureReportInput!
  $condition: ModelMeasureReportConditionInput
) {
  updateMeasureReport(input: $input, condition: $condition) {
    id
    templateId
    subDepartment
    description
    notes
    firstOccurrence
    productNumber
    totalDuration
    frequency
    unitId
    classifications
    cycleStationName
    isCritical
    progress
    attachments
    what
    when
    where
    causes
    reportId
    status
    dueDate
    createdAt
    updatedAt
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.UpdateMeasureReportMutationVariables,
  APITypes.UpdateMeasureReportMutation
>;
export const deleteMeasureReport = /* GraphQL */ `mutation DeleteMeasureReport(
  $input: DeleteMeasureReportInput!
  $condition: ModelMeasureReportConditionInput
) {
  deleteMeasureReport(input: $input, condition: $condition) {
    id
    templateId
    subDepartment
    description
    notes
    firstOccurrence
    productNumber
    totalDuration
    frequency
    unitId
    classifications
    cycleStationName
    isCritical
    progress
    attachments
    what
    when
    where
    causes
    reportId
    status
    dueDate
    createdAt
    updatedAt
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.DeleteMeasureReportMutationVariables,
  APITypes.DeleteMeasureReportMutation
>;
export const createGrouping = /* GraphQL */ `mutation CreateGrouping(
  $input: CreateGroupingInput!
  $condition: ModelGroupingConditionInput
) {
  createGrouping(input: $input, condition: $condition) {
    id
    groupingName
    allowedDepartments
    createdAt
    updatedAt
    units {
      nextToken
    }
  }
}
` as GeneratedMutation<
  APITypes.CreateGroupingMutationVariables,
  APITypes.CreateGroupingMutation
>;
export const updateGrouping = /* GraphQL */ `mutation UpdateGrouping(
  $input: UpdateGroupingInput!
  $condition: ModelGroupingConditionInput
) {
  updateGrouping(input: $input, condition: $condition) {
    id
    groupingName
    allowedDepartments
    createdAt
    updatedAt
    units {
      nextToken
    }
  }
}
` as GeneratedMutation<
  APITypes.UpdateGroupingMutationVariables,
  APITypes.UpdateGroupingMutation
>;
export const deleteGrouping = /* GraphQL */ `mutation DeleteGrouping(
  $input: DeleteGroupingInput!
  $condition: ModelGroupingConditionInput
) {
  deleteGrouping(input: $input, condition: $condition) {
    id
    groupingName
    allowedDepartments
    createdAt
    updatedAt
    units {
      nextToken
    }
  }
}
` as GeneratedMutation<
  APITypes.DeleteGroupingMutationVariables,
  APITypes.DeleteGroupingMutation
>;
export const createTeam = /* GraphQL */ `mutation CreateTeam(
  $input: CreateTeamInput!
  $condition: ModelTeamConditionInput
) {
  createTeam(input: $input, condition: $condition) {
    id
    name
    unitId
    index
    createdAt
    updatedAt
    templates {
      nextToken
    }
    cycleStations {
      nextToken
    }
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.CreateTeamMutationVariables,
  APITypes.CreateTeamMutation
>;
export const updateTeam = /* GraphQL */ `mutation UpdateTeam(
  $input: UpdateTeamInput!
  $condition: ModelTeamConditionInput
) {
  updateTeam(input: $input, condition: $condition) {
    id
    name
    unitId
    index
    createdAt
    updatedAt
    templates {
      nextToken
    }
    cycleStations {
      nextToken
    }
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.UpdateTeamMutationVariables,
  APITypes.UpdateTeamMutation
>;
export const deleteTeam = /* GraphQL */ `mutation DeleteTeam(
  $input: DeleteTeamInput!
  $condition: ModelTeamConditionInput
) {
  deleteTeam(input: $input, condition: $condition) {
    id
    name
    unitId
    index
    createdAt
    updatedAt
    templates {
      nextToken
    }
    cycleStations {
      nextToken
    }
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.DeleteTeamMutationVariables,
  APITypes.DeleteTeamMutation
>;
export const createCycleStation = /* GraphQL */ `mutation CreateCycleStation(
  $input: CreateCycleStationInput!
  $condition: ModelCycleStationConditionInput
) {
  createCycleStation(input: $input, condition: $condition) {
    id
    unitId
    teamId
    name
    isActive
    index
    createdAt
    updatedAt
    templates {
      nextToken
    }
    team {
      id
      name
      unitId
      index
      createdAt
      updatedAt
    }
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.CreateCycleStationMutationVariables,
  APITypes.CreateCycleStationMutation
>;
export const updateCycleStation = /* GraphQL */ `mutation UpdateCycleStation(
  $input: UpdateCycleStationInput!
  $condition: ModelCycleStationConditionInput
) {
  updateCycleStation(input: $input, condition: $condition) {
    id
    unitId
    teamId
    name
    isActive
    index
    createdAt
    updatedAt
    templates {
      nextToken
    }
    team {
      id
      name
      unitId
      index
      createdAt
      updatedAt
    }
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.UpdateCycleStationMutationVariables,
  APITypes.UpdateCycleStationMutation
>;
export const deleteCycleStation = /* GraphQL */ `mutation DeleteCycleStation(
  $input: DeleteCycleStationInput!
  $condition: ModelCycleStationConditionInput
) {
  deleteCycleStation(input: $input, condition: $condition) {
    id
    unitId
    teamId
    name
    isActive
    index
    createdAt
    updatedAt
    templates {
      nextToken
    }
    team {
      id
      name
      unitId
      index
      createdAt
      updatedAt
    }
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.DeleteCycleStationMutationVariables,
  APITypes.DeleteCycleStationMutation
>;
export const createUnit = /* GraphQL */ `mutation CreateUnit(
  $input: CreateUnitInput!
  $condition: ModelUnitConditionInput
) {
  createUnit(input: $input, condition: $condition) {
    id
    name
    shortName
    type
    manufacturer
    speedModes
    groupingId
    unitUserSettingId
    unitProblemClassificationId
    m100Range {
      min
      max
    }
    machineId
    createdAt
    updatedAt
    templates {
      nextToken
    }
    grouping {
      id
      groupingName
      allowedDepartments
      createdAt
      updatedAt
    }
    teams {
      nextToken
    }
    cycleStations {
      nextToken
    }
    unitProblemClassification {
      id
      classification
      createdAt
      updatedAt
    }
    unitUserSetting {
      id
      replacer
      createdAt
      updatedAt
    }
    parts {
      nextToken
    }
    shiftModels {
      nextToken
    }
  }
}
` as GeneratedMutation<
  APITypes.CreateUnitMutationVariables,
  APITypes.CreateUnitMutation
>;
export const updateUnit = /* GraphQL */ `mutation UpdateUnit(
  $input: UpdateUnitInput!
  $condition: ModelUnitConditionInput
) {
  updateUnit(input: $input, condition: $condition) {
    id
    name
    shortName
    type
    manufacturer
    speedModes
    groupingId
    unitUserSettingId
    unitProblemClassificationId
    m100Range {
      min
      max
    }
    machineId
    createdAt
    updatedAt
    templates {
      nextToken
    }
    grouping {
      id
      groupingName
      allowedDepartments
      createdAt
      updatedAt
    }
    teams {
      nextToken
    }
    cycleStations {
      nextToken
    }
    unitProblemClassification {
      id
      classification
      createdAt
      updatedAt
    }
    unitUserSetting {
      id
      replacer
      createdAt
      updatedAt
    }
    parts {
      nextToken
    }
    shiftModels {
      nextToken
    }
  }
}
` as GeneratedMutation<
  APITypes.UpdateUnitMutationVariables,
  APITypes.UpdateUnitMutation
>;
export const deleteUnit = /* GraphQL */ `mutation DeleteUnit(
  $input: DeleteUnitInput!
  $condition: ModelUnitConditionInput
) {
  deleteUnit(input: $input, condition: $condition) {
    id
    name
    shortName
    type
    manufacturer
    speedModes
    groupingId
    unitUserSettingId
    unitProblemClassificationId
    m100Range {
      min
      max
    }
    machineId
    createdAt
    updatedAt
    templates {
      nextToken
    }
    grouping {
      id
      groupingName
      allowedDepartments
      createdAt
      updatedAt
    }
    teams {
      nextToken
    }
    cycleStations {
      nextToken
    }
    unitProblemClassification {
      id
      classification
      createdAt
      updatedAt
    }
    unitUserSetting {
      id
      replacer
      createdAt
      updatedAt
    }
    parts {
      nextToken
    }
    shiftModels {
      nextToken
    }
  }
}
` as GeneratedMutation<
  APITypes.DeleteUnitMutationVariables,
  APITypes.DeleteUnitMutation
>;
export const createUnitProblemClassification = /* GraphQL */ `mutation CreateUnitProblemClassification(
  $input: CreateUnitProblemClassificationInput!
  $condition: ModelUnitProblemClassificationConditionInput
) {
  createUnitProblemClassification(input: $input, condition: $condition) {
    id
    classification
    createdAt
    updatedAt
    units {
      nextToken
    }
  }
}
` as GeneratedMutation<
  APITypes.CreateUnitProblemClassificationMutationVariables,
  APITypes.CreateUnitProblemClassificationMutation
>;
export const updateUnitProblemClassification = /* GraphQL */ `mutation UpdateUnitProblemClassification(
  $input: UpdateUnitProblemClassificationInput!
  $condition: ModelUnitProblemClassificationConditionInput
) {
  updateUnitProblemClassification(input: $input, condition: $condition) {
    id
    classification
    createdAt
    updatedAt
    units {
      nextToken
    }
  }
}
` as GeneratedMutation<
  APITypes.UpdateUnitProblemClassificationMutationVariables,
  APITypes.UpdateUnitProblemClassificationMutation
>;
export const deleteUnitProblemClassification = /* GraphQL */ `mutation DeleteUnitProblemClassification(
  $input: DeleteUnitProblemClassificationInput!
  $condition: ModelUnitProblemClassificationConditionInput
) {
  deleteUnitProblemClassification(input: $input, condition: $condition) {
    id
    classification
    createdAt
    updatedAt
    units {
      nextToken
    }
  }
}
` as GeneratedMutation<
  APITypes.DeleteUnitProblemClassificationMutationVariables,
  APITypes.DeleteUnitProblemClassificationMutation
>;
export const createUnitUserSetting = /* GraphQL */ `mutation CreateUnitUserSetting(
  $input: CreateUnitUserSettingInput!
  $condition: ModelUnitUserSettingConditionInput
) {
  createUnitUserSetting(input: $input, condition: $condition) {
    id
    replacer
    createdAt
    updatedAt
  }
}
` as GeneratedMutation<
  APITypes.CreateUnitUserSettingMutationVariables,
  APITypes.CreateUnitUserSettingMutation
>;
export const updateUnitUserSetting = /* GraphQL */ `mutation UpdateUnitUserSetting(
  $input: UpdateUnitUserSettingInput!
  $condition: ModelUnitUserSettingConditionInput
) {
  updateUnitUserSetting(input: $input, condition: $condition) {
    id
    replacer
    createdAt
    updatedAt
  }
}
` as GeneratedMutation<
  APITypes.UpdateUnitUserSettingMutationVariables,
  APITypes.UpdateUnitUserSettingMutation
>;
export const deleteUnitUserSetting = /* GraphQL */ `mutation DeleteUnitUserSetting(
  $input: DeleteUnitUserSettingInput!
  $condition: ModelUnitUserSettingConditionInput
) {
  deleteUnitUserSetting(input: $input, condition: $condition) {
    id
    replacer
    createdAt
    updatedAt
  }
}
` as GeneratedMutation<
  APITypes.DeleteUnitUserSettingMutationVariables,
  APITypes.DeleteUnitUserSettingMutation
>;
export const createPartUnit = /* GraphQL */ `mutation CreatePartUnit(
  $input: CreatePartUnitInput!
  $condition: ModelPartUnitConditionInput
) {
  createPartUnit(input: $input, condition: $condition) {
    id
    unitId
    partId
    targetCycleTime
    createdAt
    updatedAt
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
    part {
      id
      partNumber
      name
      qualityIssueConfig
      imageFront
      imageBack
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.CreatePartUnitMutationVariables,
  APITypes.CreatePartUnitMutation
>;
export const updatePartUnit = /* GraphQL */ `mutation UpdatePartUnit(
  $input: UpdatePartUnitInput!
  $condition: ModelPartUnitConditionInput
) {
  updatePartUnit(input: $input, condition: $condition) {
    id
    unitId
    partId
    targetCycleTime
    createdAt
    updatedAt
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
    part {
      id
      partNumber
      name
      qualityIssueConfig
      imageFront
      imageBack
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.UpdatePartUnitMutationVariables,
  APITypes.UpdatePartUnitMutation
>;
export const deletePartUnit = /* GraphQL */ `mutation DeletePartUnit(
  $input: DeletePartUnitInput!
  $condition: ModelPartUnitConditionInput
) {
  deletePartUnit(input: $input, condition: $condition) {
    id
    unitId
    partId
    targetCycleTime
    createdAt
    updatedAt
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
    part {
      id
      partNumber
      name
      qualityIssueConfig
      imageFront
      imageBack
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.DeletePartUnitMutationVariables,
  APITypes.DeletePartUnitMutation
>;
export const createPart = /* GraphQL */ `mutation CreatePart(
  $input: CreatePartInput!
  $condition: ModelPartConditionInput
) {
  createPart(input: $input, condition: $condition) {
    id
    partNumber
    name
    qualityIssueConfig
    imageFront
    imageBack
    createdAt
    updatedAt
    units {
      nextToken
    }
  }
}
` as GeneratedMutation<
  APITypes.CreatePartMutationVariables,
  APITypes.CreatePartMutation
>;
export const updatePart = /* GraphQL */ `mutation UpdatePart(
  $input: UpdatePartInput!
  $condition: ModelPartConditionInput
) {
  updatePart(input: $input, condition: $condition) {
    id
    partNumber
    name
    qualityIssueConfig
    imageFront
    imageBack
    createdAt
    updatedAt
    units {
      nextToken
    }
  }
}
` as GeneratedMutation<
  APITypes.UpdatePartMutationVariables,
  APITypes.UpdatePartMutation
>;
export const deletePart = /* GraphQL */ `mutation DeletePart(
  $input: DeletePartInput!
  $condition: ModelPartConditionInput
) {
  deletePart(input: $input, condition: $condition) {
    id
    partNumber
    name
    qualityIssueConfig
    imageFront
    imageBack
    createdAt
    updatedAt
    units {
      nextToken
    }
  }
}
` as GeneratedMutation<
  APITypes.DeletePartMutationVariables,
  APITypes.DeletePartMutation
>;
export const createActualCount = /* GraphQL */ `mutation CreateActualCount(
  $input: CreateActualCountInput!
  $condition: ModelactualCountConditionInput
) {
  createActualCount(input: $input, condition: $condition) {
    id
    dateTimeStartUTC
    dateTimeEndUTC
    downtime
    timeZone
    shift
    shiftModelId
    initialActualCount
    actualCount
    vehicleNumber {
      from
      until
    }
    quota
    defective
    partId
    unitId
    configurationId
    deleted
    type
    split
    createdAt
    updatedAt
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
    part {
      id
      partNumber
      name
      qualityIssueConfig
      imageFront
      imageBack
      createdAt
      updatedAt
    }
    configuration {
      id
      target
      shiftTarget
      attendingShift
      validFrom
      validUntil
      timeZone
      speedMode
      cycleTime
      partId
      unitId
      shiftModelId
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.CreateActualCountMutationVariables,
  APITypes.CreateActualCountMutation
>;
export const updateActualCount = /* GraphQL */ `mutation UpdateActualCount(
  $input: UpdateActualCountInput!
  $condition: ModelactualCountConditionInput
) {
  updateActualCount(input: $input, condition: $condition) {
    id
    dateTimeStartUTC
    dateTimeEndUTC
    downtime
    timeZone
    shift
    shiftModelId
    initialActualCount
    actualCount
    vehicleNumber {
      from
      until
    }
    quota
    defective
    partId
    unitId
    configurationId
    deleted
    type
    split
    createdAt
    updatedAt
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
    part {
      id
      partNumber
      name
      qualityIssueConfig
      imageFront
      imageBack
      createdAt
      updatedAt
    }
    configuration {
      id
      target
      shiftTarget
      attendingShift
      validFrom
      validUntil
      timeZone
      speedMode
      cycleTime
      partId
      unitId
      shiftModelId
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.UpdateActualCountMutationVariables,
  APITypes.UpdateActualCountMutation
>;
export const deleteActualCount = /* GraphQL */ `mutation DeleteActualCount(
  $input: DeleteActualCountInput!
  $condition: ModelactualCountConditionInput
) {
  deleteActualCount(input: $input, condition: $condition) {
    id
    dateTimeStartUTC
    dateTimeEndUTC
    downtime
    timeZone
    shift
    shiftModelId
    initialActualCount
    actualCount
    vehicleNumber {
      from
      until
    }
    quota
    defective
    partId
    unitId
    configurationId
    deleted
    type
    split
    createdAt
    updatedAt
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
    part {
      id
      partNumber
      name
      qualityIssueConfig
      imageFront
      imageBack
      createdAt
      updatedAt
    }
    configuration {
      id
      target
      shiftTarget
      attendingShift
      validFrom
      validUntil
      timeZone
      speedMode
      cycleTime
      partId
      unitId
      shiftModelId
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.DeleteActualCountMutationVariables,
  APITypes.DeleteActualCountMutation
>;
export const createDefective = /* GraphQL */ `mutation CreateDefective(
  $input: CreateDefectiveInput!
  $condition: ModelDefectiveConditionInput
) {
  createDefective(input: $input, condition: $condition) {
    id
    dateTime
    dateTimeUTC
    timeZone
    shift
    partId
    unitId
    defectiveGrid
    defectiveType
    defectiveCause
    defectiveLocation
    count
    deleted
    createdAt
    updatedAt
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
    part {
      id
      partNumber
      name
      qualityIssueConfig
      imageFront
      imageBack
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.CreateDefectiveMutationVariables,
  APITypes.CreateDefectiveMutation
>;
export const updateDefective = /* GraphQL */ `mutation UpdateDefective(
  $input: UpdateDefectiveInput!
  $condition: ModelDefectiveConditionInput
) {
  updateDefective(input: $input, condition: $condition) {
    id
    dateTime
    dateTimeUTC
    timeZone
    shift
    partId
    unitId
    defectiveGrid
    defectiveType
    defectiveCause
    defectiveLocation
    count
    deleted
    createdAt
    updatedAt
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
    part {
      id
      partNumber
      name
      qualityIssueConfig
      imageFront
      imageBack
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.UpdateDefectiveMutationVariables,
  APITypes.UpdateDefectiveMutation
>;
export const deleteDefective = /* GraphQL */ `mutation DeleteDefective(
  $input: DeleteDefectiveInput!
  $condition: ModelDefectiveConditionInput
) {
  deleteDefective(input: $input, condition: $condition) {
    id
    dateTime
    dateTimeUTC
    timeZone
    shift
    partId
    unitId
    defectiveGrid
    defectiveType
    defectiveCause
    defectiveLocation
    count
    deleted
    createdAt
    updatedAt
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
    part {
      id
      partNumber
      name
      qualityIssueConfig
      imageFront
      imageBack
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.DeleteDefectiveMutationVariables,
  APITypes.DeleteDefectiveMutation
>;
export const createOEE = /* GraphQL */ `mutation CreateOEE(
  $input: CreateOEEInput!
  $condition: ModelOEEConditionInput
) {
  createOEE(input: $input, condition: $condition) {
    id
    startTimeDateUTC
    endTimeDateUTC
    timeZone
    overall
    availability
    performance
    quality
    actualCountSum
    quotaSum
    netOperatingTimeInMinutes
    targetCycleTimeInMinutes
    disruptionDurationSum
    defectiveCountSum
    unitId
    shiftType
    createdAt
    updatedAt
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.CreateOEEMutationVariables,
  APITypes.CreateOEEMutation
>;
export const updateOEE = /* GraphQL */ `mutation UpdateOEE(
  $input: UpdateOEEInput!
  $condition: ModelOEEConditionInput
) {
  updateOEE(input: $input, condition: $condition) {
    id
    startTimeDateUTC
    endTimeDateUTC
    timeZone
    overall
    availability
    performance
    quality
    actualCountSum
    quotaSum
    netOperatingTimeInMinutes
    targetCycleTimeInMinutes
    disruptionDurationSum
    defectiveCountSum
    unitId
    shiftType
    createdAt
    updatedAt
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.UpdateOEEMutationVariables,
  APITypes.UpdateOEEMutation
>;
export const deleteOEE = /* GraphQL */ `mutation DeleteOEE(
  $input: DeleteOEEInput!
  $condition: ModelOEEConditionInput
) {
  deleteOEE(input: $input, condition: $condition) {
    id
    startTimeDateUTC
    endTimeDateUTC
    timeZone
    overall
    availability
    performance
    quality
    actualCountSum
    quotaSum
    netOperatingTimeInMinutes
    targetCycleTimeInMinutes
    disruptionDurationSum
    defectiveCountSum
    unitId
    shiftType
    createdAt
    updatedAt
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.DeleteOEEMutationVariables,
  APITypes.DeleteOEEMutation
>;
export const createScheduleHour = /* GraphQL */ `mutation CreateScheduleHour(
  $input: CreateScheduleHourInput!
  $condition: ModelScheduleHourConditionInput
) {
  createScheduleHour(input: $input, condition: $condition) {
    id
    shiftType
    type
    hoursStartUTC
    hoursEndUTC
    downtime
    timeZone
    shiftModelId
    i
    createdAt
    updatedAt
  }
}
` as GeneratedMutation<
  APITypes.CreateScheduleHourMutationVariables,
  APITypes.CreateScheduleHourMutation
>;
export const updateScheduleHour = /* GraphQL */ `mutation UpdateScheduleHour(
  $input: UpdateScheduleHourInput!
  $condition: ModelScheduleHourConditionInput
) {
  updateScheduleHour(input: $input, condition: $condition) {
    id
    shiftType
    type
    hoursStartUTC
    hoursEndUTC
    downtime
    timeZone
    shiftModelId
    i
    createdAt
    updatedAt
  }
}
` as GeneratedMutation<
  APITypes.UpdateScheduleHourMutationVariables,
  APITypes.UpdateScheduleHourMutation
>;
export const deleteScheduleHour = /* GraphQL */ `mutation DeleteScheduleHour(
  $input: DeleteScheduleHourInput!
  $condition: ModelScheduleHourConditionInput
) {
  deleteScheduleHour(input: $input, condition: $condition) {
    id
    shiftType
    type
    hoursStartUTC
    hoursEndUTC
    downtime
    timeZone
    shiftModelId
    i
    createdAt
    updatedAt
  }
}
` as GeneratedMutation<
  APITypes.DeleteScheduleHourMutationVariables,
  APITypes.DeleteScheduleHourMutation
>;
export const createShiftModel = /* GraphQL */ `mutation CreateShiftModel(
  $input: CreateShiftModelInput!
  $condition: ModelShiftModelConditionInput
) {
  createShiftModel(input: $input, condition: $condition) {
    id
    name
    isActive
    timeZone
    createdAt
    updatedAt
    scheduleHours {
      nextToken
    }
    units {
      nextToken
    }
  }
}
` as GeneratedMutation<
  APITypes.CreateShiftModelMutationVariables,
  APITypes.CreateShiftModelMutation
>;
export const updateShiftModel = /* GraphQL */ `mutation UpdateShiftModel(
  $input: UpdateShiftModelInput!
  $condition: ModelShiftModelConditionInput
) {
  updateShiftModel(input: $input, condition: $condition) {
    id
    name
    isActive
    timeZone
    createdAt
    updatedAt
    scheduleHours {
      nextToken
    }
    units {
      nextToken
    }
  }
}
` as GeneratedMutation<
  APITypes.UpdateShiftModelMutationVariables,
  APITypes.UpdateShiftModelMutation
>;
export const deleteShiftModel = /* GraphQL */ `mutation DeleteShiftModel(
  $input: DeleteShiftModelInput!
  $condition: ModelShiftModelConditionInput
) {
  deleteShiftModel(input: $input, condition: $condition) {
    id
    name
    isActive
    timeZone
    createdAt
    updatedAt
    scheduleHours {
      nextToken
    }
    units {
      nextToken
    }
  }
}
` as GeneratedMutation<
  APITypes.DeleteShiftModelMutationVariables,
  APITypes.DeleteShiftModelMutation
>;
export const createShiftModelUnit = /* GraphQL */ `mutation CreateShiftModelUnit(
  $input: CreateShiftModelUnitInput!
  $condition: ModelShiftModelUnitConditionInput
) {
  createShiftModelUnit(input: $input, condition: $condition) {
    id
    unitId
    shiftModelId
    createdAt
    updatedAt
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
    shiftModel {
      id
      name
      isActive
      timeZone
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.CreateShiftModelUnitMutationVariables,
  APITypes.CreateShiftModelUnitMutation
>;
export const updateShiftModelUnit = /* GraphQL */ `mutation UpdateShiftModelUnit(
  $input: UpdateShiftModelUnitInput!
  $condition: ModelShiftModelUnitConditionInput
) {
  updateShiftModelUnit(input: $input, condition: $condition) {
    id
    unitId
    shiftModelId
    createdAt
    updatedAt
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
    shiftModel {
      id
      name
      isActive
      timeZone
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.UpdateShiftModelUnitMutationVariables,
  APITypes.UpdateShiftModelUnitMutation
>;
export const deleteShiftModelUnit = /* GraphQL */ `mutation DeleteShiftModelUnit(
  $input: DeleteShiftModelUnitInput!
  $condition: ModelShiftModelUnitConditionInput
) {
  deleteShiftModelUnit(input: $input, condition: $condition) {
    id
    unitId
    shiftModelId
    createdAt
    updatedAt
    unit {
      id
      name
      shortName
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      machineId
      createdAt
      updatedAt
    }
    shiftModel {
      id
      name
      isActive
      timeZone
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.DeleteShiftModelUnitMutationVariables,
  APITypes.DeleteShiftModelUnitMutation
>;
export const createConfiguration = /* GraphQL */ `mutation CreateConfiguration(
  $input: CreateConfigurationInput!
  $condition: ModelConfigurationConditionInput
) {
  createConfiguration(input: $input, condition: $condition) {
    id
    target
    shiftTarget
    attendingShift
    validFrom
    validUntil
    timeZone
    speedMode
    cycleTime
    partId
    unitId
    shiftModelId
    createdAt
    updatedAt
    shiftModel {
      id
      name
      isActive
      timeZone
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.CreateConfigurationMutationVariables,
  APITypes.CreateConfigurationMutation
>;
export const updateConfiguration = /* GraphQL */ `mutation UpdateConfiguration(
  $input: UpdateConfigurationInput!
  $condition: ModelConfigurationConditionInput
) {
  updateConfiguration(input: $input, condition: $condition) {
    id
    target
    shiftTarget
    attendingShift
    validFrom
    validUntil
    timeZone
    speedMode
    cycleTime
    partId
    unitId
    shiftModelId
    createdAt
    updatedAt
    shiftModel {
      id
      name
      isActive
      timeZone
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.UpdateConfigurationMutationVariables,
  APITypes.UpdateConfigurationMutation
>;
export const deleteConfiguration = /* GraphQL */ `mutation DeleteConfiguration(
  $input: DeleteConfigurationInput!
  $condition: ModelConfigurationConditionInput
) {
  deleteConfiguration(input: $input, condition: $condition) {
    id
    target
    shiftTarget
    attendingShift
    validFrom
    validUntil
    timeZone
    speedMode
    cycleTime
    partId
    unitId
    shiftModelId
    createdAt
    updatedAt
    shiftModel {
      id
      name
      isActive
      timeZone
      createdAt
      updatedAt
    }
  }
}
` as GeneratedMutation<
  APITypes.DeleteConfigurationMutationVariables,
  APITypes.DeleteConfigurationMutation
>;
