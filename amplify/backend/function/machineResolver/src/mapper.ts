import log from 'loglevel'
import type { Get } from 'type-fest'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { AppSyncClient, definedArray, fromEnvironment, getScanParameters } from 'iprocess-shared'
import {
  ScheduleSlotByUnitAndDateTimeEndQuery,
  ScheduleSlotByUnitAndDateTimeEndQueryVariables,
  UnitByMachineDataQuery,
  UnitByMachineDataQueryVariables,
  UnitsMachineDataQuery,
  UnitsMachineDataQueryVariables,
  UpdateActualCountMutationVariables,
  actualCount as ActualCount
} from 'iprocess-shared/graphql/API.js'
import {
  scheduleSlotByUnitAndDateTimeEnd,
  unitByMachineData,
  unitsMachineData
} from 'iprocess-shared/graphql/queries/index.js'
import { NIL as NIL_UUID } from 'uuid'
import { DayJS } from 'iprocess-shared/shared/datetime.js'

import { updateActualCount } from 'iprocess-shared/graphql/mutations/index.js'

import { calculateActualCount } from './utils.js'

const API_ID = fromEnvironment('API_ERFASSUNGSAPP_GRAPHQLAPIIDOUTPUT')
const BUCKET_NAME = fromEnvironment('MACHINES_IDS_S3_BUCKET_NAME', () => `machine-data-${API_ID}`)

type UnitWithMachineData = Get<UnitsMachineDataQuery, ['listUnits', 'items', '0']>

const s3 = new S3Client({ region: fromEnvironment('REGION') })
const appsync = new AppSyncClient()

// * --- Requests to S3 ---

export const listAvailableMachines = async () => {
  const { Contents } = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET_NAME }))

  const machineIDs = definedArray(Contents?.map((_) => _.Key))
  log.debug('Available machines from S3', JSON.stringify(machineIDs))
  return machineIDs
}

// * --- Requests to AppSync ---

export const listUsedMachines = async () => {
  const items = await appsync.scan<UnitsMachineDataQuery, UnitsMachineDataQueryVariables, UnitWithMachineData>(
    unitsMachineData,
    getScanParameters,
    {
      filter: {
        machineId: { ne: NIL_UUID }
      }
    }
  )

  const machineIDs = definedArray(items.map((_) => _.machineId))
  log.debug('Used machines from retrieved from Unit table', JSON.stringify(machineIDs))
  return machineIDs
}

export const getUnitId = async (machineId: string) => {
  const [unit] = await appsync.scan<UnitByMachineDataQuery, UnitByMachineDataQueryVariables, UnitWithMachineData>(
    unitByMachineData,
    getScanParameters,
    {
      machineId
    }
  )

  return unit?.id
}

export const getCurrentActiveActualCount = async (unitId: string, currentTime: DayJS) => {
  const [actualCount] = await appsync.scan<
    ScheduleSlotByUnitAndDateTimeEndQuery,
    ScheduleSlotByUnitAndDateTimeEndQueryVariables,
    ActualCount
  >(scheduleSlotByUnitAndDateTimeEnd, getScanParameters, {
    unitId,
    dateTimeEndUTC: { ge: currentTime.toISOString() },
    filter: {
      dateTimeStartUTC: { le: currentTime.toISOString() }
    }
  })

  return actualCount
}

export const updateActualCountItem = async (
  overflowCounter: number,
  {
    __typename,
    unit: _unit,
    part: _part,
    configuration: _configuration,
    initialActualCount,
    actualCount: currentActualCount,
    ...rest
  }: ActualCount
) => {
  if (overflowCounter === initialActualCount) {
    return
  }

  const actualCountCalculation = calculateActualCount(overflowCounter, initialActualCount || overflowCounter)

  if (currentActualCount === actualCountCalculation) {
    return
  }

  const input = {
    ...rest,
    initialActualCount: initialActualCount || overflowCounter,
    actualCount: actualCountCalculation
  }

  return await appsync.mutate<unknown, UpdateActualCountMutationVariables>(updateActualCount, {
    input
  })
}
