import { Event } from '../types.js'
import log from 'loglevel'

import { AthenaConnector, ItemProcessor, fromEnvironment, getCurrentDateTime, prettify } from 'iprocess-shared'
import { DeleteDisruptionInput, disruption as Disruption } from 'iprocess-shared/graphql/API.js'

import { ScriptInfo, UpdateOperation, client, updateTableBuilder } from './base.js'

const TABLE_NAME_DISRUPTION = fromEnvironment('API_ERFASSUNGSAPP_DISRUPTIONTABLE_NAME')

const scriptInfo: ScriptInfo = {
  tableName: TABLE_NAME_DISRUPTION,
  version: 'v23.37.0-1',
  updatedAt: '2023-06-26'
}

export interface AthenaQuery<TInput extends object, TOutput extends object> {
  builder: (event?: Event) => string
  processItem: ItemProcessor<TInput, TOutput | undefined>
}

interface AthenaTemplateData {
  id: string
  description: string
  cyclestationid: string
  unitid: string
  dislocation: string
  dislocationspecification: string
  dislocationtype: string
  deleted: string
  template: string
}

const athenaClient = new AthenaConnector()

const scanTemplates = async ({
  description,
  cyclestationid,
  unitid,
  dislocation,
  dislocationspecification,
  dislocationtype
}: AthenaTemplateData): Promise<Disruption[] | undefined> => {
  log.debug(
    '[scanTemplates]: Scanning Templates with the following attributes =>',
    prettify({
      description,
      cyclestationid,
      unitid,
      disLocation: dislocation,
      disLocationSpecification: dislocationspecification,
      disLocationType: dislocationtype
    })
  )

  const queryFilter =
    'template=:template AND deleted=:deleted AND description=:description AND cycleStationId=:cycleStationId AND unitId=:unitId AND disLocation=:disLocation AND disLocationSpecification=:disLocationSpecification';
  const attributeValues = {
    ':description': description,
    ':cycleStationId': cyclestationid,
    ':unitId': unitid,
    ':disLocation': dislocation,
    ':disLocationSpecification': dislocationspecification,
    ':template': 'yes',
    ':deleted': 'no'
  }

  const FilterExpression = dislocationtype.length > 0 ? `${queryFilter} AND disLocationType=:disLocationType` : queryFilter
  const ExpressionAttributeValues = dislocationtype.length > 0
    ? { ...attributeValues, ':disLocationType': dislocationtype }
    : attributeValues

  log.debug(`[scanTemplates]: Scan Expressions:`, prettify({ ExpressionAttributeValues, FilterExpression }))

  return await client.scan({
    TableName: TABLE_NAME_DISRUPTION,
    FilterExpression,
    ExpressionAttributeValues
  })
}

const scanDisruption = async (templateId: string): Promise<Disruption[] | undefined> => {
  log.debug(`[scanDisruption]: Scanning Disruptions with templateId: ${templateId}`)
  return await client.scan({
    TableName: TABLE_NAME_DISRUPTION,
    FilterExpression: 'template=:template AND deleted=:deleted AND templateId=:templateId',
    ExpressionAttributeValues: {
      ':templateId': templateId,
      ':template': 'no',
      ':deleted': 'no'
    }
  })
}

export const dataWithDuplicatedTemplates: AthenaQuery<AthenaTemplateData, Disruption[]> = {
  processItem: async (template) => {
    log.debug('[processItem]: Scanning Templates with the following attributes', prettify(template))
    return await scanTemplates(template)
  },

  builder: () => {
    const query = `
    SELECT 
      description, cyclestationid, unitid, dislocation, dislocationspecification, dislocationtype, 
    COUNT(*) 
      as count 
    FROM 
      "athena"."disruption_template" 
    WHERE 
      template='yes' AND deleted='no' 
    GROUP BY 
      description, cyclestationid, unitid, dislocation, dislocationspecification, dislocationtype HAVING COUNT(*) > 1
    `
    log.debug(`Query is\n${query}`)
    return query
  }
}

const queryAthena = async () => {
  const result = await athenaClient.call(dataWithDuplicatedTemplates.builder(), dataWithDuplicatedTemplates.processItem)
  const repeatedTemplates = result.filter((_) => _.length > 0)
  log.debug(`Repeated Templates: ${repeatedTemplates.length} =>`, prettify(repeatedTemplates))
  return repeatedTemplates
}

const batchDeleteTemplates = async (input: DeleteDisruptionInput[]) =>
  await client.batchUpdateOrDelete(
    TABLE_NAME_DISRUPTION,
    input.map((_) => ({ DeleteRequest: { Key: _ } }))
  )
const batchUpdateDisruption = async (input: Disruption[], templateId: string | undefined) => {
  if (templateId && input.length > 0) {
    const updatedDisruptions = input.map((_) => ({
      ..._,
      templateId,
      updatedAt: getCurrentDateTime({ utc: true }).toISOString(),
      createdAt: _.createdAt || undefined
    }))
    await client.batchUpdateOrDelete(
      TABLE_NAME_DISRUPTION,
      updatedDisruptions.map((_) => ({ PutRequest: { Item: _ } }))
    )
    log.debug(
      `Disruptions updated in this batch: ${updatedDisruptions.length} with templateId ${templateId} =>`,
      prettify({ updatedDisruptions })
    )
  }
}

const updateDisruptionItem: UpdateOperation<Disruption[]> = async (templates, persistToDB: boolean) => {
  const templatesToDelete = templates.filter((_, index) => index > 0)
  const templateToKeep = templates[0]
  let disruptionsToUpdate: Disruption[] = []
  const templateIDsToDelete: DeleteDisruptionInput[] = []

  log.debug(`${templates.length} duplicated templates with same attributes: =>`, prettify(templates))
  log.debug(`Template to Keep: =>`, prettify(templateToKeep))

  for await (const { id } of templatesToDelete) {
    const disruptions = await scanDisruption(id)
    if (disruptions) {
      disruptionsToUpdate = [...disruptionsToUpdate, ...disruptions]
    }
    templateIDsToDelete.push({ id })
  }

  log.debug(
    `Disruptions to be updated in this batch: ${disruptionsToUpdate.length} =>`,
    prettify({ disruptionsToUpdate })
  )

  if (persistToDB) {
    log.debug(`Batch updating DynamoDB table: ${TABLE_NAME_DISRUPTION}`)
    await batchUpdateDisruption(disruptionsToUpdate, templateToKeep?.id)
    await batchDeleteTemplates(templateIDsToDelete)
  }
  log.debug(
    `Templates deleted in this batch: ${templatesToDelete.length} =>`,
    prettify({ templatesToDelete, templateIdToDelete: templateIDsToDelete })
  )
}

export const updateTemplatesFromDisruptionTable = async (persistToDB: boolean) =>
  await updateTableBuilder(scriptInfo, queryAthena, (_) => updateDisruptionItem(_, persistToDB))
