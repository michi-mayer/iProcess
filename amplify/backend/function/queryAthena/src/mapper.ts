// Lambda layer
import {
  AppSyncClient,
  UNIT_SPECIFIC_CYCLE_STATION,
  defined,
  throwOnNullish,
  Nullable,
  AthenaConnector
} from 'iprocess-shared'
import { unitBasicData, getCycleStationName, getTemplateByID } from 'iprocess-shared/graphql/queries/index.js'

import type {
  GetCycleStationNameQuery,
  GetCycleStationNameQueryVariables,
  GetTemplateByIDQuery,
  GetTemplateByIDQueryVariables,
  UnitBasicDataQuery,
  UnitBasicDataQueryVariables
} from 'iprocess-shared/graphql/index.js'

// Local modules
import { dataWithTemplateQuery, genericDisruptionQuery } from './athena/queries.js'
import type { Event } from './types.js'

const athenaClient = new AthenaConnector()
const connector = new AppSyncClient()

export const getUnitShortName = async (id: string) => {
  const response = await connector.get<UnitBasicDataQuery, UnitBasicDataQueryVariables>(unitBasicData, { id })

  return defined(response.getUnit?.shortName, throwOnNullish({ id }))
}

export const getCycleStationNameValue = async (id: Nullable<string>) => {
  if (!id) {
    return UNIT_SPECIFIC_CYCLE_STATION.name
  }
  const response = await connector.get<GetCycleStationNameQuery, GetCycleStationNameQueryVariables>(
    getCycleStationName,
    { id }
  )

  return response.getUnit?.name ?? UNIT_SPECIFIC_CYCLE_STATION.name
}

export const getTemplateInfo = async (id: string) => {
  const response = await connector.get<GetTemplateByIDQuery, GetTemplateByIDQueryVariables>(getTemplateByID, {
    id
  })
  return response.getDisruption
}

export const queryAthena = async (event: Event) => {
  const results = await Promise.all([
    athenaClient.call(dataWithTemplateQuery.builder(event), dataWithTemplateQuery.processItem),
    athenaClient.call(genericDisruptionQuery.builder(event), genericDisruptionQuery.processItem)
  ])

  return results.flat()
}
