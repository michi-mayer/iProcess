/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onAddDisruption = /* GraphQL */ `subscription OnAddDisruption($unitId: ID!) {
  onAddDisruption(unitId: $unitId) {
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
` as GeneratedSubscription<
  APITypes.OnAddDisruptionSubscriptionVariables,
  APITypes.OnAddDisruptionSubscription
>;
export const onMutateActualCount = /* GraphQL */ `subscription OnMutateActualCount($unitId: ID!) {
  onMutateActualCount(unitId: $unitId) {
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
` as GeneratedSubscription<
  APITypes.OnMutateActualCountSubscriptionVariables,
  APITypes.OnMutateActualCountSubscription
>;
export const onMutateDisruption = /* GraphQL */ `subscription OnMutateDisruption($unitId: ID!) {
  onMutateDisruption(unitId: $unitId) {
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
` as GeneratedSubscription<
  APITypes.OnMutateDisruptionSubscriptionVariables,
  APITypes.OnMutateDisruptionSubscription
>;
export const onStartShift = /* GraphQL */ `subscription OnStartShift($unitId: ID!) {
  onStartShift(unitId: $unitId)
}
` as GeneratedSubscription<
  APITypes.OnStartShiftSubscriptionVariables,
  APITypes.OnStartShiftSubscription
>;
