export const disruptionsByTemplate = /* GraphQL */ `
  query DisruptionsByTemplate(
    $templateId: ID!
    $startTimeDateUTC: ModelStringKeyConditionInput
    $endTimeDateUTC: ModelStringInput
    $unitId: ID!
    $deleted: Bool
    $limit: Int
  ) {
    disruptionByTemplateIdAndStartTimeDateUTC(
      templateId: $templateId
      startTimeDateUTC: $startTimeDateUTC
      limit: $limit
      filter: { endTimeDateUTC: $endTimeDateUTC, deleted: { eq: $deleted }, unitId: { eq: $unitId } }
    ) {
      items {
        id
        description
        templateId
        team {
          id
        }
      }
      nextToken
    }
  }
`

export const getCycleStationName = /* GraphQL */ `
  query GetCycleStationName($id: ID!) {
    getUnit(id: $id) {
      name
    }
  }
`

export const getGroupingWithUnits = /* GraphQL */ `
  query GetGroupingWithUnits($id: ID!) {
    getGrouping(id: $id) {
      id
      groupingName
      allowedDepartments
      createdAt
      updatedAt
      units {
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
  }
`

export const getProductWithUnits = /* GraphQL */ `
  query GetProductWithUnits($id: ID!) {
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
  }
`

export const getShiftModelWithScheduleHoursAndUnits = /* GraphQL */ `
  query GetShiftModelWithScheduleHoursAndUnits($id: ID!) {
    getShiftModel(id: $id) {
      id
      name
      isActive
      timeZone
      createdAt
      updatedAt
      scheduleHours {
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
      units {
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
  }
`

export const getCompleteUnit = /* GraphQL */ `
  query GetCompleteUnit($id: ID!) {
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
      grouping {
        id
        groupingName
        allowedDepartments
        createdAt
        updatedAt
        units {
          nextToken
        }
      }
      teams {
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
      cycleStations {
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
      unitProblemClassification {
        id
        classification
        createdAt
        updatedAt
        units {
          nextToken
        }
      }
      unitUserSetting {
        id
        replacer
        createdAt
        updatedAt
      }
      parts {
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
      shiftModels {
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
  }
`

export const partsByUnit = /* GraphQL */ `
  query PartsByUnit($id: ID!) {
    getUnit(id: $id) {
      parts {
        items {
          part {
            createdAt
            id
            name
            partNumber
            updatedAt
            qualityIssueConfig
          }
          targetCycleTime
        }
      }
    }
  }
`
export const getTemplateByID = /* GraphQL */ `
  query GetTemplateByID($id: ID!) {
    getDisruption(id: $id) {
      id
      cycleStationId
      description
      disLocation
      disLocationSpecification
      disLocationType
      unitId
      team {
        id
        name
        index
      }
      originatorTeam {
        id
        name
        index
      }
    }
  }
`

export const getIssuesById = /* GraphQL */ `
  query GetIssuesById($id: ID!) {
    getDisruption(id: $id) {
      id
      issues {
        id
        index
        name
      }
    }
  }
`

export const disruptionByUnitAndDateTime = /* GraphQL */ `
  query DisruptionByUnitAndDateTime(
    $unitId: ID!
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
        disLocation
        disLocationSpecification
        disLocationType
        description
        startTimeDateUTC
        endTimeDateUTC
        duration
        measures
        partId
        timeZone
        templateId
        isSolved
        cycleStation {
          id
          name
        }
        team {
          id
          name
          index
        }
        originatorTeam {
          id
          name
          index
        }
        lostVehicles
        m100
        issues {
          id
          index
          name
        }
        attachments {
          key
          type
          size
          uploadedBy
          createdAt
        }
        updatedAt
      }
      nextToken
    }
  }
`

export const disruptionMeasuresByUnitId = /* GraphQL */ `
  query DisruptionMeasuresByUnitId(
    $unitId: ID!
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
        measures
      }
      nextToken
    }
  }
`

export const defectiveByUnitAndDateTime = /* GraphQL */ `
  query DefectiveByUnitAndDateTime(
    $unitId: ID!
    $dateTimeUTC: ModelStringKeyConditionInput
    $filter: ModelDefectiveFilterInput
    $limit: Int
    $nextToken: String
  ) {
    defectiveByUnitIdAndDateTimeUTC(
      unitId: $unitId
      dateTimeUTC: $dateTimeUTC
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        dateTimeUTC
        count
        part {
          id
          name
        }
        defectiveType
        defectiveCause
        defectiveLocation
        timeZone
        defectiveGrid
      }
      nextToken
    }
  }
`

export const partsWithUnitData = /* GraphQL */ `
  query PartsWithUnitData($filter: ModelPartFilterInput, $limit: Int, $nextToken: String) {
    listParts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        createdAt
        id
        name
        partNumber
        qualityIssueConfig
        units {
          items {
            id
            partId
            targetCycleTime
            unit {
              createdAt
              id
              manufacturer
              name
              shortName
              type
            }
          }
        }
      }
      nextToken
    }
  }
`

export const disruptionsClassificationWithUnit = /* GraphQL */ `
  query DisruptionsClassificationWithUnit {
    listUnitProblemClassifications {
      items {
        units {
          items {
            id
            manufacturer
            name
            shortName
            type
            machineId
          }
        }
        classification
        id
        createdAt
      }
      nextToken
    }
  }
`

export const groupingsWithUnit = /* GraphQL */ `
  query GroupingsWithUnit(
    $filter: ModelGroupingFilterInput
    $unitFilter: ModelUnitFilterInput
    $nextTokenUnit: String
    $limit: Int
    $nextToken: String
  ) {
    listGroupings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        units(filter: $unitFilter, nextToken: $nextTokenUnit) {
          items {
            name
            manufacturer
            id
            createdAt
            type
            shortName
            machineId
            teams {
              items {
                id
                name
                index
              }
            }
          }
        }
        groupingName
        createdAt
        id
        allowedDepartments
      }
      nextToken
    }
  }
`

export const shiftModelsWithUnit = /* GraphQL */ `
  query ShiftModelsWithUnit {
    listShiftModels {
      items {
        createdAt
        updatedAt
        id
        isActive
        timeZone
        name
        scheduleHours {
          items {
            createdAt
            hoursEndUTC
            hoursStartUTC
            downtime
            i
            id
            shiftModelId
            shiftType
            timeZone
            type
          }
          nextToken
        }
        units {
          items {
            createdAt
            id
            unit {
              createdAt
              groupingId
              id
              name
              shortName
              type
            }
            shiftModelId
          }
          nextToken
        }
      }
      nextToken
    }
  }
`
export const shiftModelWithUnit = /* GraphQL */ `
  query ShiftModelWithUnit($id: ID!) {
    getShiftModel(id: $id) {
      createdAt
      updatedAt
      id
      isActive
      timeZone
      name
      scheduleHours {
        items {
          createdAt
          hoursEndUTC
          hoursStartUTC
          downtime
          i
          id
          shiftModelId
          shiftType
          timeZone
          type
        }
        nextToken
      }
      units {
        items {
          createdAt
          id
          unit {
            createdAt
            groupingId
            id
            name
            shortName
            type
          }
          shiftModelId
        }
        nextToken
      }
    }
  }
`

export const scheduleHourIds = /* GraphQL */ `
  query ScheduleHourIds($shiftModelId: ID!) {
    getShiftModel(id: $shiftModelId) {
      scheduleHours {
        items {
          id
        }
      }
    }
  }
`

export const shiftModelUnitsByShift = /* GraphQL */ `
  query ShiftModelUnitsByShift($shiftModelId: ID!) {
    getShiftModel(id: $shiftModelId) {
      id
      units {
        items {
          id
          shiftModelId
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`

export const scheduleHoursByShift = /* GraphQL */ `
  query ScheduleHoursByShift($shiftModelId: ID!, $shiftType: Shift!) {
    getShiftModel(id: $shiftModelId) {
      id
      scheduleHours(filter: { shiftType: { eq: $shiftType } }) {
        items {
          shiftType
          type
          hoursStartUTC
          hoursEndUTC
          downtime
          timeZone
          shiftModelId
        }
        nextToken
      }
    }
  }
`

export const unitsByGroupingId = /* GraphQL */ `
  query UnitsByGroupingId(
    $groupingId: ID!
    $limit: Int
    $filter: ModelUnitFilterInput
    $sortDirection: ModelSortDirection
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
        groupingId
        name
        shortName
        type
        speedModes
        m100Range {
          min
          max
        }
        machineId
        teams {
          items {
            id
            index
            name
          }
        }
        shiftModels {
          nextToken
          items {
            createdAt
            id
            shiftModelId
            shiftModel {
              createdAt
              id
              isActive
              name
              timeZone
              scheduleHours {
                items {
                  createdAt
                  hoursEndUTC
                  hoursStartUTC
                  i
                  id
                  shiftModelId
                  shiftType
                  timeZone
                  type
                  updatedAt
                }
              }
              updatedAt
              createdAt
            }
          }
        }
        unitProblemClassificationId
        unitProblemClassification {
          id
          classification
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`

export const unitsData = /* GraphQL */ `
  query UnitsData($filter: ModelUnitFilterInput, $limit: Int, $nextToken: String) {
    listUnits(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        shortName
        type
        manufacturer
        machineId
        speedModes
        m100Range {
          min
          max
        }
        groupingId
        unitUserSettingId
        unitProblemClassificationId
        createdAt
        updatedAt
        grouping {
          id
          groupingName
          createdAt
          updatedAt
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
      nextToken
    }
  }
`

export const timeSlotsByUnitAndDateTimeStartCount = /* GraphQL */ `
  query TimeSlotsByUnitAndDateTimeStartCount(
    $unitId: ID!
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
      }
      nextToken
    }
  }
`

export const scheduleSlotsByUnitAndDateTime = /* GraphQL */ `
  query ScheduleSlotsByUnitAndDateTime(
    $unitId: ID!
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
        timeZone
        downtime
        type
        shift
        actualCount
        deleted
        vehicleNumber {
          from
          until
        }
        quota
        defective
        shiftModelId
        split
        partId
        part {
          id
          partNumber
          name
          units {
            items {
              targetCycleTime
              partId
              id
            }
            nextToken
          }
          qualityIssueConfig
          imageFront
          imageBack
          createdAt
          updatedAt
        }
        unitId
        unit {
          id
          name
        }
        configurationId
        configuration {
          id
          shiftTarget
          validFrom
          validUntil
          timeZone
          speedMode
          shiftModel {
            createdAt
            id
            isActive
            name
            timeZone
            scheduleHours {
              items {
                createdAt
                hoursEndUTC
                hoursStartUTC
                i
                id
                shiftModelId
                shiftType
                timeZone
                type
                updatedAt
              }
            }
          }
          partId
          unitId
          shiftModelId
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`
export const teamsByUnitId = /* GraphQL */ `
  query TeamsByUnitId(
    $unitId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelTeamFilterInput
    $limit: Int
    $nextToken: String
  ) {
    teamsByUnit(unitId: $unitId, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        unitId
        index
      }
      nextToken
    }
  }
`
export const teamsAndCycleStationsByUnit = /* GraphQL */ `
  query TeamsAndCycleStationsByUnit(
    $unitId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelTeamFilterInput
    $limit: Int
    $nextToken: String
  ) {
    teamsByUnit(unitId: $unitId, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        unitId
        index
        cycleStations {
          items {
            id
            unitId
            name
            isActive
            index
          }
          nextToken
        }
      }
      nextToken
    }
  }
`

export const cycleStationsByTeamId = /* GraphQL */ `
  query CycleStationsByTeamId(
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
        name
        isActive
        index
      }
      nextToken
    }
  }
`

export const cycleStationsByUnitId = /* GraphQL */ `
  query CycleStationsByUnitId(
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
        name
        isActive
        index
        teamId
      }
      nextToken
    }
  }
`

export const activeCycleStationsByTeamId = /* GraphQL */ `
  query ActiveCycleStationsByTeamId(
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
        name
        isActive
        index
        teamId
      }
      nextToken
    }
  }
`

export const activeCycleStationsByUnitId = /* GraphQL */ `
  query ActiveCycleStationsByUnitId(
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
        name
        isActive
        index
        teamId
      }
      nextToken
    }
  }
`

export const templatesByUnit = /* GraphQL */ `
  query TemplatesByUnit(
    $unitId: ID
    $template: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModeldisruptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTemplatesByUnit(
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      unitId: $unitId
      template: $template
    ) {
      items {
        id
        description
        index
        cycleStationId
        originatorTeam {
          id
          name
          index
        }
        issues {
          id
          name
          index
        }
        disLocation
        disLocationSpecification
        disLocationType
      }
      nextToken
    }
  }
`

export const unitBasicData = /* GraphQL */ `
  query UnitBasicData($id: ID!) {
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
    }
  }
`

export const shiftModelBasicData = /* GraphQL */ `
  query ShiftModelBasicData($id: ID!) {
    getShiftModel(id: $id) {
      id
      name
    }
  }
`

export const oeeIdsByUnitAndDateTimeUTC = /* GraphQL */ `
  query OeeIdsByUnitAndDateTimeUTC(
    $unitId: ID!
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
        updatedAt
      }
      nextToken
    }
  }
`

export const measuresBasicData = /* GraphQL */ `
  query MeasuresBasicData(
    $reportId: ID!
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
        description
        isCritical
        reportId
        progress
        subDepartment
        attachments
        status
        dueDate
        templateId
        classifications
        cycleStationName
        unitId
        productNumber
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`

export const measureIds = /* GraphQL */ `
  query MeasureIds(
    $reportId: ID!
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
      }
      nextToken
    }
  }
`

export const unitByMachineData = /* GraphQL */ `
  query UnitByMachineData($machineId: ID!, $filter: ModelUnitFilterInput, $limit: Int, $nextToken: String) {
    unitByMachineId(machineId: $machineId, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        machineId
      }
      nextToken
    }
  }
`

export const unitsMachineData = /* GraphQL */ `
  query UnitsMachineData($filter: ModelUnitFilterInput, $limit: Int, $nextToken: String) {
    listUnits(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        machineId
      }
      nextToken
    }
  }
`
