import { fromEnvironment } from 'iprocess-shared'
import {
  GetPartQuery,
  GetPartQueryVariables,
  GetUnitQuery,
  GetUnitQueryVariables,
  PartUnit
} from 'iprocess-shared/graphql/API.js'

import { ScanOperation, ScriptInfo, UpdateOperation, client, updateTableBuilder, connector } from './base.js'
import { getPart, getUnit } from 'iprocess-shared/graphql/queries/index.js'
import log from 'loglevel'

const TABLE_NAME = fromEnvironment('API_ERFASSUNGSAPP_PARTUNITTABLE_NAME')

const scriptInfo: ScriptInfo = {
  tableName: TABLE_NAME,
  version: 'v23.8.1-5',
  updatedAt: '2023-06-12'
}

interface LegacyPartUnit extends PartUnit { }

const scanPartUnits: ScanOperation<LegacyPartUnit> = async () => await client.scan({ TableName: TABLE_NAME })

const getUnitItem = async (id: string) => {
  const response = await connector.get<GetUnitQuery, GetUnitQueryVariables>(getUnit, { id })
  return response.getUnit
}

const getProductItem = async (id: string) => {
  const response = await connector.get<GetPartQuery, GetPartQueryVariables>(getPart, { id })
  return response.getPart
}

const updatePartUnitItem: UpdateOperation<LegacyPartUnit> = async ({ unitId, partId, id }) => {
  const unit = await getUnitItem(unitId)
  const product = await getProductItem(partId)

  if (!unit || !product) {
    log.info(`PartUnit with id =>${id} has been deleted because unit or product does no longer exist in the DB`, JSON.stringify({ unitId: unit?.id, productId: product?.id }))
    await client.delete({
      TableName: TABLE_NAME,
      Key: { id }
    })
  }
}

export const updatePartUnitTable = async (persistToDB: boolean) => await updateTableBuilder(scriptInfo, scanPartUnits, (_) => updatePartUnitItem(_, persistToDB))
