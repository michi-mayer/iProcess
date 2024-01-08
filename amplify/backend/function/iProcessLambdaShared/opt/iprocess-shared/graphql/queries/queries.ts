/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const calculateDisruptionKPIs = /* GraphQL */ `query CalculateDisruptionKPIs($input: CalculateDisruptionKPIsInput) {
  calculateDisruptionKPIs(input: $input)
}
` as GeneratedQuery<
  APITypes.CalculateDisruptionKPIsQueryVariables,
  APITypes.CalculateDisruptionKPIsQuery
>;
export const getQuickSightURL = /* GraphQL */ `query GetQuickSightURL($input: GetQuickSightURLInput!) {
  getQuickSightURL(input: $input)
}
` as GeneratedQuery<
  APITypes.GetQuickSightURLQueryVariables,
  APITypes.GetQuickSightURLQuery
>;
export const getAvailableMachines = /* GraphQL */ `query GetAvailableMachines {
  getAvailableMachines
}
` as GeneratedQuery<
  APITypes.GetAvailableMachinesQueryVariables,
  APITypes.GetAvailableMachinesQuery
>;
export const listCognitoUsers = /* GraphQL */ `query ListCognitoUsers($input: ListCognitoUsersInput) {
  listCognitoUsers(input: $input)
}
` as GeneratedQuery<
  APITypes.ListCognitoUsersQueryVariables,
  APITypes.ListCognitoUsersQuery
>;
export const getDisruption = /* GraphQL */ `query GetDisruption($id: ID!) {
  getDisruption(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetDisruptionQueryVariables,
  APITypes.GetDisruptionQuery
>;
export const listDisruptions = /* GraphQL */ `query ListDisruptions(
  $filter: ModeldisruptionFilterInput
  $limit: Int
  $nextToken: String
) {
  listDisruptions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
      m100
      index
      isSolved
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ListDisruptionsQueryVariables,
  APITypes.ListDisruptionsQuery
>;
export const disruptionsByDeletedAndUpdatedAt = /* GraphQL */ `query DisruptionsByDeletedAndUpdatedAt(
  $deleted: Bool
  $updatedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModeldisruptionFilterInput
  $limit: Int
  $nextToken: String
) {
  disruptionsByDeletedAndUpdatedAt(
    deleted: $deleted
    updatedAt: $updatedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
      m100
      index
      isSolved
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.DisruptionsByDeletedAndUpdatedAtQueryVariables,
  APITypes.DisruptionsByDeletedAndUpdatedAtQuery
>;
export const disruptionsByUnitId = /* GraphQL */ `query DisruptionsByUnitId(
  $unitId: ID
  $deletedTemplate: ModeldisruptionDisruptionByUnitIdCompositeKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModeldisruptionFilterInput
  $limit: Int
  $nextToken: String
) {
  disruptionsByUnitId(
    unitId: $unitId
    deletedTemplate: $deletedTemplate
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
      m100
      index
      isSolved
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.DisruptionsByUnitIdQueryVariables,
  APITypes.DisruptionsByUnitIdQuery
>;
export const listTemplatesByUnit = /* GraphQL */ `query ListTemplatesByUnit(
  $unitId: ID
  $template: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModeldisruptionFilterInput
  $limit: Int
  $nextToken: String
) {
  listTemplatesByUnit(
    unitId: $unitId
    template: $template
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
      m100
      index
      isSolved
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ListTemplatesByUnitQueryVariables,
  APITypes.ListTemplatesByUnitQuery
>;
export const disruptionByUnitIdAndStartTimeDateUTC = /* GraphQL */ `query DisruptionByUnitIdAndStartTimeDateUTC(
  $unitId: ID
  $startTimeDateUTC: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModeldisruptionFilterInput
  $limit: Int
  $nextToken: String
) {
  disruptionByUnitIdAndStartTimeDateUTC(
    unitId: $unitId
    startTimeDateUTC: $startTimeDateUTC
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
      m100
      index
      isSolved
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.DisruptionByUnitIdAndStartTimeDateUTCQueryVariables,
  APITypes.DisruptionByUnitIdAndStartTimeDateUTCQuery
>;
export const disruptionByTemplateIdAndStartTimeDateUTC = /* GraphQL */ `query DisruptionByTemplateIdAndStartTimeDateUTC(
  $templateId: ID
  $startTimeDateUTC: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModeldisruptionFilterInput
  $limit: Int
  $nextToken: String
) {
  disruptionByTemplateIdAndStartTimeDateUTC(
    templateId: $templateId
    startTimeDateUTC: $startTimeDateUTC
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
      m100
      index
      isSolved
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.DisruptionByTemplateIdAndStartTimeDateUTCQueryVariables,
  APITypes.DisruptionByTemplateIdAndStartTimeDateUTCQuery
>;
export const getMeasureReport = /* GraphQL */ `query GetMeasureReport($id: ID!) {
  getMeasureReport(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMeasureReportQueryVariables,
  APITypes.GetMeasureReportQuery
>;
export const listMeasureReports = /* GraphQL */ `query ListMeasureReports(
  $filter: ModelMeasureReportFilterInput
  $limit: Int
  $nextToken: String
) {
  listMeasureReports(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ListMeasureReportsQueryVariables,
  APITypes.ListMeasureReportsQuery
>;
export const listMeasures = /* GraphQL */ `query ListMeasures(
  $reportId: ID
  $sortDirection: ModelSortDirection
  $filter: ModelMeasureReportFilterInput
  $limit: Int
  $nextToken: String
) {
  listMeasures(
    reportId: $reportId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ListMeasuresQueryVariables,
  APITypes.ListMeasuresQuery
>;
export const getGrouping = /* GraphQL */ `query GetGrouping($id: ID!) {
  getGrouping(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetGroupingQueryVariables,
  APITypes.GetGroupingQuery
>;
export const listGroupings = /* GraphQL */ `query ListGroupings(
  $filter: ModelGroupingFilterInput
  $limit: Int
  $nextToken: String
) {
  listGroupings(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      groupingName
      allowedDepartments
      createdAt
      updatedAt
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ListGroupingsQueryVariables,
  APITypes.ListGroupingsQuery
>;
export const getTeam = /* GraphQL */ `query GetTeam($id: ID!) {
  getTeam(id: $id) {
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
` as GeneratedQuery<APITypes.GetTeamQueryVariables, APITypes.GetTeamQuery>;
export const listTeams = /* GraphQL */ `query ListTeams(
  $filter: ModelTeamFilterInput
  $limit: Int
  $nextToken: String
) {
  listTeams(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      unitId
      index
      createdAt
      updatedAt
    }
    nextToken
  }
}
` as GeneratedQuery<APITypes.ListTeamsQueryVariables, APITypes.ListTeamsQuery>;
export const teamsByUnit = /* GraphQL */ `query TeamsByUnit(
  $unitId: ID
  $sortDirection: ModelSortDirection
  $filter: ModelTeamFilterInput
  $limit: Int
  $nextToken: String
) {
  teamsByUnit(
    unitId: $unitId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      name
      unitId
      index
      createdAt
      updatedAt
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.TeamsByUnitQueryVariables,
  APITypes.TeamsByUnitQuery
>;
export const getCycleStation = /* GraphQL */ `query GetCycleStation($id: ID!) {
  getCycleStation(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetCycleStationQueryVariables,
  APITypes.GetCycleStationQuery
>;
export const listCycleStations = /* GraphQL */ `query ListCycleStations(
  $filter: ModelCycleStationFilterInput
  $limit: Int
  $nextToken: String
) {
  listCycleStations(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      unitId
      teamId
      name
      isActive
      index
      createdAt
      updatedAt
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ListCycleStationsQueryVariables,
  APITypes.ListCycleStationsQuery
>;
export const cycleStationsByUnit = /* GraphQL */ `query CycleStationsByUnit(
  $unitId: ID
  $sortDirection: ModelSortDirection
  $filter: ModelCycleStationFilterInput
  $limit: Int
  $nextToken: String
) {
  cycleStationsByUnit(
    unitId: $unitId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      unitId
      teamId
      name
      isActive
      index
      createdAt
      updatedAt
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.CycleStationsByUnitQueryVariables,
  APITypes.CycleStationsByUnitQuery
>;
export const cycleStationsByTeam = /* GraphQL */ `query CycleStationsByTeam(
  $teamId: ID
  $sortDirection: ModelSortDirection
  $filter: ModelCycleStationFilterInput
  $limit: Int
  $nextToken: String
) {
  cycleStationsByTeam(
    teamId: $teamId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      unitId
      teamId
      name
      isActive
      index
      createdAt
      updatedAt
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.CycleStationsByTeamQueryVariables,
  APITypes.CycleStationsByTeamQuery
>;
export const activeCycleStationsByUnit = /* GraphQL */ `query ActiveCycleStationsByUnit(
  $unitId: ID
  $isActive: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelCycleStationFilterInput
  $limit: Int
  $nextToken: String
) {
  activeCycleStationsByUnit(
    unitId: $unitId
    isActive: $isActive
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      unitId
      teamId
      name
      isActive
      index
      createdAt
      updatedAt
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ActiveCycleStationsByUnitQueryVariables,
  APITypes.ActiveCycleStationsByUnitQuery
>;
export const activeCycleStationsByTeam = /* GraphQL */ `query ActiveCycleStationsByTeam(
  $teamId: ID
  $isActive: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelCycleStationFilterInput
  $limit: Int
  $nextToken: String
) {
  activeCycleStationsByTeam(
    teamId: $teamId
    isActive: $isActive
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      unitId
      teamId
      name
      isActive
      index
      createdAt
      updatedAt
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ActiveCycleStationsByTeamQueryVariables,
  APITypes.ActiveCycleStationsByTeamQuery
>;
export const getUnit = /* GraphQL */ `query GetUnit($id: ID!) {
  getUnit(id: $id) {
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
` as GeneratedQuery<APITypes.GetUnitQueryVariables, APITypes.GetUnitQuery>;
export const listUnits = /* GraphQL */ `query ListUnits(
  $filter: ModelUnitFilterInput
  $limit: Int
  $nextToken: String
) {
  listUnits(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
` as GeneratedQuery<APITypes.ListUnitsQueryVariables, APITypes.ListUnitsQuery>;
export const unitsByGrouping = /* GraphQL */ `query UnitsByGrouping(
  $groupingId: ID
  $sortDirection: ModelSortDirection
  $filter: ModelUnitFilterInput
  $limit: Int
  $nextToken: String
) {
  unitsByGrouping(
    groupingId: $groupingId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.UnitsByGroupingQueryVariables,
  APITypes.UnitsByGroupingQuery
>;
export const unitByMachineId = /* GraphQL */ `query UnitByMachineId(
  $machineId: ID
  $sortDirection: ModelSortDirection
  $filter: ModelUnitFilterInput
  $limit: Int
  $nextToken: String
) {
  unitByMachineId(
    machineId: $machineId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.UnitByMachineIdQueryVariables,
  APITypes.UnitByMachineIdQuery
>;
export const getUnitProblemClassification = /* GraphQL */ `query GetUnitProblemClassification($id: ID!) {
  getUnitProblemClassification(id: $id) {
    id
    classification
    createdAt
    updatedAt
    units {
      nextToken
    }
  }
}
` as GeneratedQuery<
  APITypes.GetUnitProblemClassificationQueryVariables,
  APITypes.GetUnitProblemClassificationQuery
>;
export const listUnitProblemClassifications = /* GraphQL */ `query ListUnitProblemClassifications(
  $filter: ModelUnitProblemClassificationFilterInput
  $limit: Int
  $nextToken: String
) {
  listUnitProblemClassifications(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      classification
      createdAt
      updatedAt
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ListUnitProblemClassificationsQueryVariables,
  APITypes.ListUnitProblemClassificationsQuery
>;
export const getUnitUserSetting = /* GraphQL */ `query GetUnitUserSetting($id: ID!) {
  getUnitUserSetting(id: $id) {
    id
    replacer
    createdAt
    updatedAt
  }
}
` as GeneratedQuery<
  APITypes.GetUnitUserSettingQueryVariables,
  APITypes.GetUnitUserSettingQuery
>;
export const listUnitUserSettings = /* GraphQL */ `query ListUnitUserSettings(
  $filter: ModelUnitUserSettingFilterInput
  $limit: Int
  $nextToken: String
) {
  listUnitUserSettings(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      replacer
      createdAt
      updatedAt
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ListUnitUserSettingsQueryVariables,
  APITypes.ListUnitUserSettingsQuery
>;
export const getPartUnit = /* GraphQL */ `query GetPartUnit($id: ID!) {
  getPartUnit(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetPartUnitQueryVariables,
  APITypes.GetPartUnitQuery
>;
export const listPartUnits = /* GraphQL */ `query ListPartUnits(
  $filter: ModelPartUnitFilterInput
  $limit: Int
  $nextToken: String
) {
  listPartUnits(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      unitId
      partId
      targetCycleTime
      createdAt
      updatedAt
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ListPartUnitsQueryVariables,
  APITypes.ListPartUnitsQuery
>;
export const getPart = /* GraphQL */ `query GetPart($id: ID!) {
  getPart(id: $id) {
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
` as GeneratedQuery<APITypes.GetPartQueryVariables, APITypes.GetPartQuery>;
export const listParts = /* GraphQL */ `query ListParts(
  $filter: ModelPartFilterInput
  $limit: Int
  $nextToken: String
) {
  listParts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      partNumber
      name
      qualityIssueConfig
      imageFront
      imageBack
      createdAt
      updatedAt
    }
    nextToken
  }
}
` as GeneratedQuery<APITypes.ListPartsQueryVariables, APITypes.ListPartsQuery>;
export const getActualCount = /* GraphQL */ `query GetActualCount($id: ID!) {
  getActualCount(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetActualCountQueryVariables,
  APITypes.GetActualCountQuery
>;
export const listActualCounts = /* GraphQL */ `query ListActualCounts(
  $filter: ModelactualCountFilterInput
  $limit: Int
  $nextToken: String
) {
  listActualCounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      dateTimeStartUTC
      dateTimeEndUTC
      downtime
      timeZone
      shift
      shiftModelId
      initialActualCount
      actualCount
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
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ListActualCountsQueryVariables,
  APITypes.ListActualCountsQuery
>;
export const timeSlotByDeletedAndUpdatedAt = /* GraphQL */ `query TimeSlotByDeletedAndUpdatedAt(
  $deleted: Bool
  $updatedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelactualCountFilterInput
  $limit: Int
  $nextToken: String
) {
  timeSlotByDeletedAndUpdatedAt(
    deleted: $deleted
    updatedAt: $updatedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      dateTimeStartUTC
      dateTimeEndUTC
      downtime
      timeZone
      shift
      shiftModelId
      initialActualCount
      actualCount
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
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.TimeSlotByDeletedAndUpdatedAtQueryVariables,
  APITypes.TimeSlotByDeletedAndUpdatedAtQuery
>;
export const scheduleSlotByUnitAndDateTimeStart = /* GraphQL */ `query ScheduleSlotByUnitAndDateTimeStart(
  $unitId: ID
  $dateTimeStartUTC: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelactualCountFilterInput
  $limit: Int
  $nextToken: String
) {
  scheduleSlotByUnitAndDateTimeStart(
    unitId: $unitId
    dateTimeStartUTC: $dateTimeStartUTC
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      dateTimeStartUTC
      dateTimeEndUTC
      downtime
      timeZone
      shift
      shiftModelId
      initialActualCount
      actualCount
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
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ScheduleSlotByUnitAndDateTimeStartQueryVariables,
  APITypes.ScheduleSlotByUnitAndDateTimeStartQuery
>;
export const scheduleSlotByUnitAndDateTimeEnd = /* GraphQL */ `query ScheduleSlotByUnitAndDateTimeEnd(
  $unitId: ID
  $dateTimeEndUTC: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelactualCountFilterInput
  $limit: Int
  $nextToken: String
) {
  scheduleSlotByUnitAndDateTimeEnd(
    unitId: $unitId
    dateTimeEndUTC: $dateTimeEndUTC
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      dateTimeStartUTC
      dateTimeEndUTC
      downtime
      timeZone
      shift
      shiftModelId
      initialActualCount
      actualCount
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
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ScheduleSlotByUnitAndDateTimeEndQueryVariables,
  APITypes.ScheduleSlotByUnitAndDateTimeEndQuery
>;
export const getDefective = /* GraphQL */ `query GetDefective($id: ID!) {
  getDefective(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetDefectiveQueryVariables,
  APITypes.GetDefectiveQuery
>;
export const listDefectives = /* GraphQL */ `query ListDefectives(
  $filter: ModelDefectiveFilterInput
  $limit: Int
  $nextToken: String
) {
  listDefectives(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ListDefectivesQueryVariables,
  APITypes.ListDefectivesQuery
>;
export const defectivesByDeletedAndUpdatedAt = /* GraphQL */ `query DefectivesByDeletedAndUpdatedAt(
  $deleted: Bool
  $updatedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelDefectiveFilterInput
  $limit: Int
  $nextToken: String
) {
  defectivesByDeletedAndUpdatedAt(
    deleted: $deleted
    updatedAt: $updatedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.DefectivesByDeletedAndUpdatedAtQueryVariables,
  APITypes.DefectivesByDeletedAndUpdatedAtQuery
>;
export const defectiveByUnitIdAndDateTimeUTC = /* GraphQL */ `query DefectiveByUnitIdAndDateTimeUTC(
  $unitId: ID
  $dateTimeUTC: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelDefectiveFilterInput
  $limit: Int
  $nextToken: String
) {
  defectiveByUnitIdAndDateTimeUTC(
    unitId: $unitId
    dateTimeUTC: $dateTimeUTC
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.DefectiveByUnitIdAndDateTimeUTCQueryVariables,
  APITypes.DefectiveByUnitIdAndDateTimeUTCQuery
>;
export const getOEE = /* GraphQL */ `query GetOEE($id: ID!) {
  getOEE(id: $id) {
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
` as GeneratedQuery<APITypes.GetOEEQueryVariables, APITypes.GetOEEQuery>;
export const listOEEs = /* GraphQL */ `query ListOEEs($filter: ModelOEEFilterInput, $limit: Int, $nextToken: String) {
  listOEEs(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    }
    nextToken
  }
}
` as GeneratedQuery<APITypes.ListOEEsQueryVariables, APITypes.ListOEEsQuery>;
export const listOEEsByUnitIdAndTimeDateUTC = /* GraphQL */ `query ListOEEsByUnitIdAndTimeDateUTC(
  $unitId: ID
  $startTimeDateUTCEndTimeDateUTC: ModelOEEListOEEsByUnitIdAndTimeDateUTCCompositeKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelOEEFilterInput
  $limit: Int
  $nextToken: String
) {
  listOEEsByUnitIdAndTimeDateUTC(
    unitId: $unitId
    startTimeDateUTCEndTimeDateUTC: $startTimeDateUTCEndTimeDateUTC
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ListOEEsByUnitIdAndTimeDateUTCQueryVariables,
  APITypes.ListOEEsByUnitIdAndTimeDateUTCQuery
>;
export const getScheduleHour = /* GraphQL */ `query GetScheduleHour($id: ID!) {
  getScheduleHour(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetScheduleHourQueryVariables,
  APITypes.GetScheduleHourQuery
>;
export const listScheduleHours = /* GraphQL */ `query ListScheduleHours(
  $filter: ModelScheduleHourFilterInput
  $limit: Int
  $nextToken: String
) {
  listScheduleHours(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ListScheduleHoursQueryVariables,
  APITypes.ListScheduleHoursQuery
>;
export const listScheduleHoursByShiftModelId = /* GraphQL */ `query ListScheduleHoursByShiftModelId(
  $shiftModelId: ID
  $sortDirection: ModelSortDirection
  $filter: ModelScheduleHourFilterInput
  $limit: Int
  $nextToken: String
) {
  listScheduleHoursByShiftModelId(
    shiftModelId: $shiftModelId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ListScheduleHoursByShiftModelIdQueryVariables,
  APITypes.ListScheduleHoursByShiftModelIdQuery
>;
export const getShiftModel = /* GraphQL */ `query GetShiftModel($id: ID!) {
  getShiftModel(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetShiftModelQueryVariables,
  APITypes.GetShiftModelQuery
>;
export const listShiftModels = /* GraphQL */ `query ListShiftModels(
  $filter: ModelShiftModelFilterInput
  $limit: Int
  $nextToken: String
) {
  listShiftModels(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      isActive
      timeZone
      createdAt
      updatedAt
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ListShiftModelsQueryVariables,
  APITypes.ListShiftModelsQuery
>;
export const getShiftModelUnit = /* GraphQL */ `query GetShiftModelUnit($id: ID!) {
  getShiftModelUnit(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetShiftModelUnitQueryVariables,
  APITypes.GetShiftModelUnitQuery
>;
export const listShiftModelUnits = /* GraphQL */ `query ListShiftModelUnits(
  $filter: ModelShiftModelUnitFilterInput
  $limit: Int
  $nextToken: String
) {
  listShiftModelUnits(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      unitId
      shiftModelId
      createdAt
      updatedAt
    }
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ListShiftModelUnitsQueryVariables,
  APITypes.ListShiftModelUnitsQuery
>;
export const getConfiguration = /* GraphQL */ `query GetConfiguration($id: ID!) {
  getConfiguration(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetConfigurationQueryVariables,
  APITypes.GetConfigurationQuery
>;
export const listConfigurations = /* GraphQL */ `query ListConfigurations(
  $filter: ModelConfigurationFilterInput
  $limit: Int
  $nextToken: String
) {
  listConfigurations(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ListConfigurationsQueryVariables,
  APITypes.ListConfigurationsQuery
>;
export const configurationByUnitAndValidFrom = /* GraphQL */ `query ConfigurationByUnitAndValidFrom(
  $unitId: ID
  $validFrom: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelConfigurationFilterInput
  $limit: Int
  $nextToken: String
) {
  configurationByUnitAndValidFrom(
    unitId: $unitId
    validFrom: $validFrom
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
  }
}
` as GeneratedQuery<
  APITypes.ConfigurationByUnitAndValidFromQueryVariables,
  APITypes.ConfigurationByUnitAndValidFromQuery
>;
export const calculateShiftTargetCustom = /* GraphQL */ `query CalculateShiftTargetCustom($input: CalculateShiftTargetInput) {
  calculateShiftTargetCustom(input: $input)
}
` as GeneratedQuery<
  APITypes.CalculateShiftTargetCustomQueryVariables,
  APITypes.CalculateShiftTargetCustomQuery
>;
