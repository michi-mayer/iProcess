/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateDisruption = /* GraphQL */ `
  subscription OnCreateDisruption {
    onCreateDisruption {
      id
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
      unitId
      template
      templateId
      deleted
      createdAt
      updatedAt
    }
  }
`
export const onUpdateDisruption = /* GraphQL */ `
  subscription OnUpdateDisruption {
    onUpdateDisruption {
      id
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
      unitId
      template
      templateId
      deleted
      createdAt
      updatedAt
    }
  }
`
export const onDeleteDisruption = /* GraphQL */ `
  subscription OnDeleteDisruption {
    onDeleteDisruption {
      id
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
      unitId
      template
      templateId
      deleted
      createdAt
      updatedAt
    }
  }
`
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
      id
      name
      firstName
      email
      mobileNumer
      roles
      profilePicSize
      profilePicThumbnail
      validated
      awsCognitoID
      disabled
      settingsLanguage
      createdAt
      updatedAt
      groupings {
        items {
          id
          groupingId
          userId
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
      id
      name
      firstName
      email
      mobileNumer
      roles
      profilePicSize
      profilePicThumbnail
      validated
      awsCognitoID
      disabled
      settingsLanguage
      createdAt
      updatedAt
      groupings {
        items {
          id
          groupingId
          userId
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
      id
      name
      firstName
      email
      mobileNumer
      roles
      profilePicSize
      profilePicThumbnail
      validated
      awsCognitoID
      disabled
      settingsLanguage
      createdAt
      updatedAt
      groupings {
        items {
          id
          groupingId
          userId
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`
export const onCreateUserGroupings = /* GraphQL */ `
  subscription OnCreateUserGroupings {
    onCreateUserGroupings {
      id
      groupingId
      userId
      createdAt
      updatedAt
      user {
        id
        name
        firstName
        email
        mobileNumer
        roles
        profilePicSize
        profilePicThumbnail
        validated
        awsCognitoID
        disabled
        settingsLanguage
        createdAt
        updatedAt
        groupings {
          nextToken
        }
      }
      grouping {
        id
        groupingType
        groupingName
        groupingLongText
        longitude
        latitude
        siteAdressStreet
        siteAdressCity
        siteAdressPostalCode
        siteAdressState
        siteAdressCountry
        siteAdressPhoneNumer
        createdAt
        updatedAt
        users {
          nextToken
        }
        images {
          nextToken
        }
        units {
          nextToken
        }
      }
    }
  }
`
export const onUpdateUserGroupings = /* GraphQL */ `
  subscription OnUpdateUserGroupings {
    onUpdateUserGroupings {
      id
      groupingId
      userId
      createdAt
      updatedAt
      user {
        id
        name
        firstName
        email
        mobileNumer
        roles
        profilePicSize
        profilePicThumbnail
        validated
        awsCognitoID
        disabled
        settingsLanguage
        createdAt
        updatedAt
        groupings {
          nextToken
        }
      }
      grouping {
        id
        groupingType
        groupingName
        groupingLongText
        longitude
        latitude
        siteAdressStreet
        siteAdressCity
        siteAdressPostalCode
        siteAdressState
        siteAdressCountry
        siteAdressPhoneNumer
        createdAt
        updatedAt
        users {
          nextToken
        }
        images {
          nextToken
        }
        units {
          nextToken
        }
      }
    }
  }
`
export const onDeleteUserGroupings = /* GraphQL */ `
  subscription OnDeleteUserGroupings {
    onDeleteUserGroupings {
      id
      groupingId
      userId
      createdAt
      updatedAt
      user {
        id
        name
        firstName
        email
        mobileNumer
        roles
        profilePicSize
        profilePicThumbnail
        validated
        awsCognitoID
        disabled
        settingsLanguage
        createdAt
        updatedAt
        groupings {
          nextToken
        }
      }
      grouping {
        id
        groupingType
        groupingName
        groupingLongText
        longitude
        latitude
        siteAdressStreet
        siteAdressCity
        siteAdressPostalCode
        siteAdressState
        siteAdressCountry
        siteAdressPhoneNumer
        createdAt
        updatedAt
        users {
          nextToken
        }
        images {
          nextToken
        }
        units {
          nextToken
        }
      }
    }
  }
`
export const onCreateGrouping = /* GraphQL */ `
  subscription OnCreateGrouping {
    onCreateGrouping {
      id
      groupingType
      groupingName
      groupingLongText
      longitude
      latitude
      siteAdressStreet
      siteAdressCity
      siteAdressPostalCode
      siteAdressState
      siteAdressCountry
      siteAdressPhoneNumer
      createdAt
      updatedAt
      users {
        items {
          id
          groupingId
          userId
          createdAt
          updatedAt
        }
        nextToken
      }
      images {
        items {
          id
          groupingId
          image
          createdAt
          updatedAt
        }
        nextToken
      }
      units {
        items {
          id
          name
          shortName
          description
          type
          manufacturer
          speedModes
          groupingId
          unitUserSettingId
          unitProblemClassificationId
          isActive
          unitId
          index
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`
export const onUpdateGrouping = /* GraphQL */ `
  subscription OnUpdateGrouping {
    onUpdateGrouping {
      id
      groupingType
      groupingName
      groupingLongText
      longitude
      latitude
      siteAdressStreet
      siteAdressCity
      siteAdressPostalCode
      siteAdressState
      siteAdressCountry
      siteAdressPhoneNumer
      createdAt
      updatedAt
      users {
        items {
          id
          groupingId
          userId
          createdAt
          updatedAt
        }
        nextToken
      }
      images {
        items {
          id
          groupingId
          image
          createdAt
          updatedAt
        }
        nextToken
      }
      units {
        items {
          id
          name
          shortName
          description
          type
          manufacturer
          speedModes
          groupingId
          unitUserSettingId
          unitProblemClassificationId
          isActive
          unitId
          index
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`
export const onDeleteGrouping = /* GraphQL */ `
  subscription OnDeleteGrouping {
    onDeleteGrouping {
      id
      groupingType
      groupingName
      groupingLongText
      longitude
      latitude
      siteAdressStreet
      siteAdressCity
      siteAdressPostalCode
      siteAdressState
      siteAdressCountry
      siteAdressPhoneNumer
      createdAt
      updatedAt
      users {
        items {
          id
          groupingId
          userId
          createdAt
          updatedAt
        }
        nextToken
      }
      images {
        items {
          id
          groupingId
          image
          createdAt
          updatedAt
        }
        nextToken
      }
      units {
        items {
          id
          name
          shortName
          description
          type
          manufacturer
          speedModes
          groupingId
          unitUserSettingId
          unitProblemClassificationId
          isActive
          unitId
          index
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`
export const onCreateImage = /* GraphQL */ `
  subscription OnCreateImage {
    onCreateImage {
      id
      groupingId
      image
      createdAt
      updatedAt
    }
  }
`
export const onUpdateImage = /* GraphQL */ `
  subscription OnUpdateImage {
    onUpdateImage {
      id
      groupingId
      image
      createdAt
      updatedAt
    }
  }
`
export const onDeleteImage = /* GraphQL */ `
  subscription OnDeleteImage {
    onDeleteImage {
      id
      groupingId
      image
      createdAt
      updatedAt
    }
  }
`
export const onCreateUnit = /* GraphQL */ `
  subscription OnCreateUnit {
    onCreateUnit {
      id
      name
      shortName
      description
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      isActive
      unitId
      index
      createdAt
      updatedAt
      grouping {
        id
        groupingType
        groupingName
        groupingLongText
        longitude
        latitude
        siteAdressStreet
        siteAdressCity
        siteAdressPostalCode
        siteAdressState
        siteAdressCountry
        siteAdressPhoneNumer
        createdAt
        updatedAt
        users {
          nextToken
        }
        images {
          nextToken
        }
        units {
          nextToken
        }
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
export const onUpdateUnit = /* GraphQL */ `
  subscription OnUpdateUnit {
    onUpdateUnit {
      id
      name
      shortName
      description
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      isActive
      unitId
      index
      createdAt
      updatedAt
      grouping {
        id
        groupingType
        groupingName
        groupingLongText
        longitude
        latitude
        siteAdressStreet
        siteAdressCity
        siteAdressPostalCode
        siteAdressState
        siteAdressCountry
        siteAdressPhoneNumer
        createdAt
        updatedAt
        users {
          nextToken
        }
        images {
          nextToken
        }
        units {
          nextToken
        }
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
export const onDeleteUnit = /* GraphQL */ `
  subscription OnDeleteUnit {
    onDeleteUnit {
      id
      name
      shortName
      description
      type
      manufacturer
      speedModes
      groupingId
      unitUserSettingId
      unitProblemClassificationId
      isActive
      unitId
      index
      createdAt
      updatedAt
      grouping {
        id
        groupingType
        groupingName
        groupingLongText
        longitude
        latitude
        siteAdressStreet
        siteAdressCity
        siteAdressPostalCode
        siteAdressState
        siteAdressCountry
        siteAdressPhoneNumer
        createdAt
        updatedAt
        users {
          nextToken
        }
        images {
          nextToken
        }
        units {
          nextToken
        }
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
export const onCreateUnitProblemClassification = /* GraphQL */ `
  subscription OnCreateUnitProblemClassification {
    onCreateUnitProblemClassification {
      id
      classification
      createdAt
      updatedAt
      units {
        items {
          id
          name
          shortName
          description
          type
          manufacturer
          speedModes
          groupingId
          unitUserSettingId
          unitProblemClassificationId
          isActive
          unitId
          index
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`
export const onUpdateUnitProblemClassification = /* GraphQL */ `
  subscription OnUpdateUnitProblemClassification {
    onUpdateUnitProblemClassification {
      id
      classification
      createdAt
      updatedAt
      units {
        items {
          id
          name
          shortName
          description
          type
          manufacturer
          speedModes
          groupingId
          unitUserSettingId
          unitProblemClassificationId
          isActive
          unitId
          index
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`
export const onDeleteUnitProblemClassification = /* GraphQL */ `
  subscription OnDeleteUnitProblemClassification {
    onDeleteUnitProblemClassification {
      id
      classification
      createdAt
      updatedAt
      units {
        items {
          id
          name
          shortName
          description
          type
          manufacturer
          speedModes
          groupingId
          unitUserSettingId
          unitProblemClassificationId
          isActive
          unitId
          index
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`
export const onCreateUnitUserSetting = /* GraphQL */ `
  subscription OnCreateUnitUserSetting {
    onCreateUnitUserSetting {
      id
      replacer
      createdAt
      updatedAt
    }
  }
`
export const onUpdateUnitUserSetting = /* GraphQL */ `
  subscription OnUpdateUnitUserSetting {
    onUpdateUnitUserSetting {
      id
      replacer
      createdAt
      updatedAt
    }
  }
`
export const onDeleteUnitUserSetting = /* GraphQL */ `
  subscription OnDeleteUnitUserSetting {
    onDeleteUnitUserSetting {
      id
      replacer
      createdAt
      updatedAt
    }
  }
`
export const onCreatePartUnit = /* GraphQL */ `
  subscription OnCreatePartUnit {
    onCreatePartUnit {
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
        description
        type
        manufacturer
        speedModes
        groupingId
        unitUserSettingId
        unitProblemClassificationId
        isActive
        unitId
        index
        createdAt
        updatedAt
        grouping {
          id
          groupingType
          groupingName
          groupingLongText
          longitude
          latitude
          siteAdressStreet
          siteAdressCity
          siteAdressPostalCode
          siteAdressState
          siteAdressCountry
          siteAdressPhoneNumer
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
      part {
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
        schedule {
          nextToken
        }
      }
    }
  }
`
export const onUpdatePartUnit = /* GraphQL */ `
  subscription OnUpdatePartUnit {
    onUpdatePartUnit {
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
        description
        type
        manufacturer
        speedModes
        groupingId
        unitUserSettingId
        unitProblemClassificationId
        isActive
        unitId
        index
        createdAt
        updatedAt
        grouping {
          id
          groupingType
          groupingName
          groupingLongText
          longitude
          latitude
          siteAdressStreet
          siteAdressCity
          siteAdressPostalCode
          siteAdressState
          siteAdressCountry
          siteAdressPhoneNumer
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
      part {
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
        schedule {
          nextToken
        }
      }
    }
  }
`
export const onDeletePartUnit = /* GraphQL */ `
  subscription OnDeletePartUnit {
    onDeletePartUnit {
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
        description
        type
        manufacturer
        speedModes
        groupingId
        unitUserSettingId
        unitProblemClassificationId
        isActive
        unitId
        index
        createdAt
        updatedAt
        grouping {
          id
          groupingType
          groupingName
          groupingLongText
          longitude
          latitude
          siteAdressStreet
          siteAdressCity
          siteAdressPostalCode
          siteAdressState
          siteAdressCountry
          siteAdressPhoneNumer
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
      part {
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
        schedule {
          nextToken
        }
      }
    }
  }
`
export const onCreatePart = /* GraphQL */ `
  subscription OnCreatePart {
    onCreatePart {
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
      schedule {
        items {
          id
          type
          hoursStartUTC
          hoursEndUTC
          timeZone
          quotaWithReplacement
          quota
          numberOfWorkers
          manufacturedPart
          partId
          i
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`
export const onUpdatePart = /* GraphQL */ `
  subscription OnUpdatePart {
    onUpdatePart {
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
      schedule {
        items {
          id
          type
          hoursStartUTC
          hoursEndUTC
          timeZone
          quotaWithReplacement
          quota
          numberOfWorkers
          manufacturedPart
          partId
          i
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`
export const onDeletePart = /* GraphQL */ `
  subscription OnDeletePart {
    onDeletePart {
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
      schedule {
        items {
          id
          type
          hoursStartUTC
          hoursEndUTC
          timeZone
          quotaWithReplacement
          quota
          numberOfWorkers
          manufacturedPart
          partId
          i
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`
export const onCreateSchedule = /* GraphQL */ `
  subscription OnCreateSchedule {
    onCreateSchedule {
      id
      type
      hoursStartUTC
      hoursEndUTC
      timeZone
      quotaWithReplacement
      quota
      numberOfWorkers
      manufacturedPart
      partId
      i
      createdAt
      updatedAt
      parts {
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
  }
`
export const onUpdateSchedule = /* GraphQL */ `
  subscription OnUpdateSchedule {
    onUpdateSchedule {
      id
      type
      hoursStartUTC
      hoursEndUTC
      timeZone
      quotaWithReplacement
      quota
      numberOfWorkers
      manufacturedPart
      partId
      i
      createdAt
      updatedAt
      parts {
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
  }
`
export const onDeleteSchedule = /* GraphQL */ `
  subscription OnDeleteSchedule {
    onDeleteSchedule {
      id
      type
      hoursStartUTC
      hoursEndUTC
      timeZone
      quotaWithReplacement
      quota
      numberOfWorkers
      manufacturedPart
      partId
      i
      createdAt
      updatedAt
      parts {
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
  }
`
export const onCreateActualCount = /* GraphQL */ `
  subscription OnCreateActualCount {
    onCreateActualCount {
      id
      dateTimeStartUTC
      dateTimeEndUTC
      timeZone
      shift
      shiftModelId
      actualCount
      quota
      defective
      partId
      partName
      partNumber
      unitId
      unitName
      deleted
      configurationId
      type
      split
      createdAt
      updatedAt
      part {
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
        schedule {
          nextToken
        }
      }
      configuration {
        id
        shiftTarget
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
  }
`
export const onUpdateActualCount = /* GraphQL */ `
  subscription OnUpdateActualCount {
    onUpdateActualCount {
      id
      dateTimeStartUTC
      dateTimeEndUTC
      timeZone
      shift
      shiftModelId
      actualCount
      quota
      defective
      partId
      partName
      partNumber
      unitId
      unitName
      deleted
      configurationId
      type
      split
      createdAt
      updatedAt
      part {
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
        schedule {
          nextToken
        }
      }
      configuration {
        id
        shiftTarget
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
  }
`
export const onDeleteActualCount = /* GraphQL */ `
  subscription OnDeleteActualCount {
    onDeleteActualCount {
      id
      dateTimeStartUTC
      dateTimeEndUTC
      timeZone
      shift
      shiftModelId
      actualCount
      quota
      defective
      partId
      partName
      partNumber
      unitId
      unitName
      deleted
      configurationId
      type
      split
      createdAt
      updatedAt
      part {
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
        schedule {
          nextToken
        }
      }
      configuration {
        id
        shiftTarget
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
  }
`
export const onCreateDefective = /* GraphQL */ `
  subscription OnCreateDefective {
    onCreateDefective {
      id
      dateTime
      dateTimeUTC
      timeZone
      shift
      partName
      partId
      partNumber
      unitName
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
  }
`
export const onUpdateDefective = /* GraphQL */ `
  subscription OnUpdateDefective {
    onUpdateDefective {
      id
      dateTime
      dateTimeUTC
      timeZone
      shift
      partName
      partId
      partNumber
      unitName
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
  }
`
export const onDeleteDefective = /* GraphQL */ `
  subscription OnDeleteDefective {
    onDeleteDefective {
      id
      dateTime
      dateTimeUTC
      timeZone
      shift
      partName
      partId
      partNumber
      unitName
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
  }
`
export const onCreateOEE = /* GraphQL */ `
  subscription OnCreateOEE {
    onCreateOEE {
      id
      startTimeDateUTC
      endTimeDateUTC
      timeZone
      overall
      availability
      performance
      quality
      unitId
      unitName
      shiftType
      createdAt
      updatedAt
    }
  }
`
export const onUpdateOEE = /* GraphQL */ `
  subscription OnUpdateOEE {
    onUpdateOEE {
      id
      startTimeDateUTC
      endTimeDateUTC
      timeZone
      overall
      availability
      performance
      quality
      unitId
      unitName
      shiftType
      createdAt
      updatedAt
    }
  }
`
export const onDeleteOEE = /* GraphQL */ `
  subscription OnDeleteOEE {
    onDeleteOEE {
      id
      startTimeDateUTC
      endTimeDateUTC
      timeZone
      overall
      availability
      performance
      quality
      unitId
      unitName
      shiftType
      createdAt
      updatedAt
    }
  }
`
export const onCreateScheduleHour = /* GraphQL */ `
  subscription OnCreateScheduleHour {
    onCreateScheduleHour {
      id
      shiftType
      type
      hoursStartUTC
      hoursEndUTC
      timeZone
      quotaWithReplacement
      quota
      shiftModelId
      i
      createdAt
      updatedAt
    }
  }
`
export const onUpdateScheduleHour = /* GraphQL */ `
  subscription OnUpdateScheduleHour {
    onUpdateScheduleHour {
      id
      shiftType
      type
      hoursStartUTC
      hoursEndUTC
      timeZone
      quotaWithReplacement
      quota
      shiftModelId
      i
      createdAt
      updatedAt
    }
  }
`
export const onDeleteScheduleHour = /* GraphQL */ `
  subscription OnDeleteScheduleHour {
    onDeleteScheduleHour {
      id
      shiftType
      type
      hoursStartUTC
      hoursEndUTC
      timeZone
      quotaWithReplacement
      quota
      shiftModelId
      i
      createdAt
      updatedAt
    }
  }
`
export const onCreateShiftModel = /* GraphQL */ `
  subscription OnCreateShiftModel {
    onCreateShiftModel {
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
          timeZone
          quotaWithReplacement
          quota
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
export const onUpdateShiftModel = /* GraphQL */ `
  subscription OnUpdateShiftModel {
    onUpdateShiftModel {
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
          timeZone
          quotaWithReplacement
          quota
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
export const onDeleteShiftModel = /* GraphQL */ `
  subscription OnDeleteShiftModel {
    onDeleteShiftModel {
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
          timeZone
          quotaWithReplacement
          quota
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
export const onCreateShiftModelUnit = /* GraphQL */ `
  subscription OnCreateShiftModelUnit {
    onCreateShiftModelUnit {
      id
      unitId
      shiftModelId
      createdAt
      updatedAt
      unit {
        id
        name
        shortName
        description
        type
        manufacturer
        speedModes
        groupingId
        unitUserSettingId
        unitProblemClassificationId
        isActive
        unitId
        index
        createdAt
        updatedAt
        grouping {
          id
          groupingType
          groupingName
          groupingLongText
          longitude
          latitude
          siteAdressStreet
          siteAdressCity
          siteAdressPostalCode
          siteAdressState
          siteAdressCountry
          siteAdressPhoneNumer
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
      shiftModel {
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
  }
`
export const onUpdateShiftModelUnit = /* GraphQL */ `
  subscription OnUpdateShiftModelUnit {
    onUpdateShiftModelUnit {
      id
      unitId
      shiftModelId
      createdAt
      updatedAt
      unit {
        id
        name
        shortName
        description
        type
        manufacturer
        speedModes
        groupingId
        unitUserSettingId
        unitProblemClassificationId
        isActive
        unitId
        index
        createdAt
        updatedAt
        grouping {
          id
          groupingType
          groupingName
          groupingLongText
          longitude
          latitude
          siteAdressStreet
          siteAdressCity
          siteAdressPostalCode
          siteAdressState
          siteAdressCountry
          siteAdressPhoneNumer
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
      shiftModel {
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
  }
`
export const onDeleteShiftModelUnit = /* GraphQL */ `
  subscription OnDeleteShiftModelUnit {
    onDeleteShiftModelUnit {
      id
      unitId
      shiftModelId
      createdAt
      updatedAt
      unit {
        id
        name
        shortName
        description
        type
        manufacturer
        speedModes
        groupingId
        unitUserSettingId
        unitProblemClassificationId
        isActive
        unitId
        index
        createdAt
        updatedAt
        grouping {
          id
          groupingType
          groupingName
          groupingLongText
          longitude
          latitude
          siteAdressStreet
          siteAdressCity
          siteAdressPostalCode
          siteAdressState
          siteAdressCountry
          siteAdressPhoneNumer
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
      shiftModel {
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
  }
`
export const onCreateConfiguration = /* GraphQL */ `
  subscription OnCreateConfiguration {
    onCreateConfiguration {
      id
      shiftTarget
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
        scheduleHours {
          nextToken
        }
        units {
          nextToken
        }
      }
    }
  }
`
export const onUpdateConfiguration = /* GraphQL */ `
  subscription OnUpdateConfiguration {
    onUpdateConfiguration {
      id
      shiftTarget
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
        scheduleHours {
          nextToken
        }
        units {
          nextToken
        }
      }
    }
  }
`
export const onDeleteConfiguration = /* GraphQL */ `
  subscription OnDeleteConfiguration {
    onDeleteConfiguration {
      id
      shiftTarget
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
        scheduleHours {
          nextToken
        }
        units {
          nextToken
        }
      }
    }
  }
`
