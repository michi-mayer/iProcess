export const createActualCountCustom = /* GraphQL */ `
  mutation CreateActualCountCustom($input: CreateActualCountInput!, $condition: ModelactualCountConditionInput) {
    createActualCount(input: $input, condition: $condition) {
      id
    }
  }
`

export const updateActualCountCustom = /* GraphQL */ `
  mutation UpdateActualCountCustom($input: UpdateActualCountInput!, $condition: ModelactualCountConditionInput) {
    updateActualCount(input: $input, condition: $condition) {
      id
    }
  }
`

export const deleteActualCountCustom = /* GraphQL */ `
  mutation DeleteActualCountCustom($input: DeleteActualCountInput!, $condition: ModelactualCountConditionInput) {
    deleteActualCount(input: $input, condition: $condition) {
      id
    }
  }
`

export const createDefectiveCustom = /* GraphQL */ `
  mutation CreateDefectiveCustom($input: CreateDefectiveInput!, $condition: ModelDefectiveConditionInput) {
    createDefective(input: $input, condition: $condition) {
      id
    }
  }
`
export const updateDefectiveCustom = /* GraphQL */ `
  mutation UpdateDefectiveCustom($input: UpdateDefectiveInput!, $condition: ModelDefectiveConditionInput) {
    updateDefective(input: $input, condition: $condition) {
      id
    }
  }
`
export const deleteDefectiveCustom = /* GraphQL */ `
  mutation DeleteDefectiveCustom($input: DeleteDefectiveInput!, $condition: ModelDefectiveConditionInput) {
    deleteDefective(input: $input, condition: $condition) {
      id
    }
  }
`

export const createOEECustom = /* GraphQL */ `
  mutation CreateOEECustom($input: CreateOEEInput!, $condition: ModelOEEConditionInput) {
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
      shiftType
      unitId
      unit {
        name
      }
      createdAt
      updatedAt
    }
  }
`

export const updateOEECustom = /* GraphQL */ `
  mutation UpdateOEECustom($input: UpdateOEEInput!, $condition: ModelOEEConditionInput) {
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
      shiftType
      unitId
      unit {
        name
      }
      createdAt
      updatedAt
    }
  }
`

export const deleteOEECustom = /* GraphQL */ `
  mutation DeleteOEECustom($input: DeleteOEEInput!, $condition: ModelOEEConditionInput) {
    deleteOEE(input: $input, condition: $condition) {
      id
    }
  }
`
