/**
 * * To see SQL syntax highlight we recommend to use
 * * https://marketplace.visualstudio.com/items?itemName=frigus02.vscode-sql-tagged-template-literals
 */
// 3rd party libs
import log from 'loglevel'

// Lambda layer
import { OTHER_DISRUPTIONS_TEMPLATE_ID, Nullable, ParetoData, formatDuration, ItemProcessor } from 'iprocess-shared'

// Local modules
import { Event, ParetoProductsSchema } from '../types.js'
import { getCycleStationNameValue, getTemplateInfo, getUnitShortName } from '../mapper.js'

export interface AthenaQuery<TInput extends object, TOutput extends object> {
  builder: (event: Event) => string
  processItem: ItemProcessor<TInput, TOutput | undefined>
}

type FieldsToOmit =
  | '__typename'
  | 'products'
  | 'unitShortName'
  | 'cycleStationName'
  | 'classifications'
  | 'totalDuration'
  | 'totalDurationInMinutes'
  | 'frequency'

interface AthenaTemplateData extends Omit<ParetoData, FieldsToOmit | 'unitId' | 'description'> {
  products: string
  frequency: string
  totalDurationInMinutes: string
  firstOccurrence: string
}

interface AthenaGenericDisruptionData extends Omit<ParetoData, FieldsToOmit> {
  cycleStationId: string
  disLocation: string
  disLocationSpecification: string
  disLocationType: string
  products: string
  frequency: string
  totalDurationInMinutes: string
  firstOccurrence: string
}

const sqlifyArray = (array: unknown[]): string => array.map((_) => `'${_}'`).join(',')

const extendItemData = async (
  unitId: string,
  cycleStationId: Nullable<string>,
  disLocation: Nullable<string>,
  disLocationSpecification: Nullable<string>,
  disLocationType: Nullable<string>
) => {
  const unitShortName = await getUnitShortName(unitId)
  const cycleStationName = await getCycleStationNameValue(cycleStationId)

  // ! Use 'Classifications' type
  const classifications = JSON.stringify({
    category: disLocation,
    cause: disLocationSpecification,
    type: disLocationType
  })

  return { unitShortName, cycleStationName, classifications }
}

export const dataWithTemplateQuery: AthenaQuery<AthenaTemplateData, ParetoData> = {
  processItem: async ({ id, templateId, firstOccurrence, ...rest }: AthenaTemplateData) => {
    const templateInfo = await getTemplateInfo(templateId)

    if (templateInfo) {
      const { unitId, cycleStationId, description, disLocation, disLocationType, disLocationSpecification } = templateInfo
      const { unitShortName, cycleStationName, classifications } = await extendItemData(
        unitId,
        cycleStationId,
        disLocation,
        disLocationType,
        disLocationSpecification
      )

      return {
        id,
        unitId,
        templateId,
        description,
        unitShortName,
        classifications,
        firstOccurrence,
        cycleStationName,
        __typename: 'ParetoData',
        frequency: Number(rest.frequency),
        totalDurationInMinutes: Number(rest.totalDurationInMinutes),
        products: ParetoProductsSchema.parse(rest.products),
        totalDuration: formatDuration(Number(rest.totalDurationInMinutes))
      }
    } else {
      log.warn(`Cannot retrieve information from template with ID ${templateId}`)
      return undefined
    }
  },

  builder: ({
    startDate,
    endDate,
    shifts,
    unitIds,
    disruptionTypes,
    disruptionDescriptions,
    disruptionCategories
  }: Event) => {
    const query = `
      SELECT
        -- we need the id attribute to match the expected schema but it's only needed for genericDisruptions
          '' AS "id"
        , "templateid" AS "templateId"
        -- the following function aggregates all disruptions and builds an array of unique tuples of (partName, partNumber)
        -- a tuple is represented as a 2-elements array in SQL
        , ARRAY_DISTINCT(ARRAY_AGG(ARRAY[CONCAT('"', "partname", '"'), CONCAT('"', "partnumber", '"')])) AS "products"
        , COUNT(*) AS "frequency"
        , SUM("duration_minutes") AS "totalDurationInMinutes"
        , DATE_FORMAT(MIN("starttimedateutc"), '%Y-%m-%d') AS "firstOccurrence"
      FROM
        "athena"."disruption"
      WHERE "template" = false
        AND "templateid" <> '${OTHER_DISRUPTIONS_TEMPLATE_ID}'
        AND "starttimedateutc" >= from_iso8601_timestamp('${startDate.toISOString()}') 
        AND "endtimedateutc" < from_iso8601_timestamp('${endDate.toISOString()}')
        AND "shifttype" IN (${sqlifyArray(shifts)})
        AND "unitid" IN (${sqlifyArray(unitIds || [])})
        AND (
          "dislocationtype" IN (${sqlifyArray(disruptionTypes || [])})
          OR "dislocationtype" LIKE '%'
        )
        AND "dislocationspecification" IN (${sqlifyArray(disruptionDescriptions || [])})
        AND "dislocation" IN (${sqlifyArray(disruptionCategories || [])})
      GROUP BY "templateid"
    `

    log.debug(`Query is\n${query}`)
    return query
  }
}

export const genericDisruptionQuery: AthenaQuery<AthenaGenericDisruptionData, ParetoData> = {
  processItem: async ({
    id,
    templateId,
    firstOccurrence,
    unitId,
    cycleStationId,
    description,
    products,
    disLocation,
    disLocationSpecification,
    disLocationType,
    frequency,
    totalDurationInMinutes
  }: AthenaGenericDisruptionData) => {
    const { unitShortName, cycleStationName, classifications } = await extendItemData(
      unitId,
      cycleStationId,
      disLocation,
      disLocationType,
      disLocationSpecification
    )

    return {
      id,
      unitId,
      templateId,
      description,
      unitShortName,
      classifications,
      firstOccurrence,
      cycleStationName,
      __typename: 'ParetoData',
      frequency: Number(frequency),
      totalDurationInMinutes: Number(totalDurationInMinutes),
      products: ParetoProductsSchema.parse(products),
      totalDuration: formatDuration(Number(totalDurationInMinutes))
    }
  },

  builder: ({
    startDate,
    endDate,
    shifts,
    unitIds,
    disruptionTypes,
    disruptionDescriptions,
    disruptionCategories
  }: Event) => {
    const query = `
    SELECT
        "id"
      , "templateid" as "templateId"
      , "unitid" as "unitId"
      , "cycleStationId" as "cycleStationId"
      , "description"
      -- the following function creates an array of unique tuples of (partName, partNumber)
      -- a tuple is represented as a 2-elements array in SQL
      , ARRAY[ARRAY[CONCAT('"', "partname", '"'), CONCAT('"', "partnumber", '"')]] as "products"
      , "dislocation" as "disLocation"
      , "dislocationspecification" as "disLocationSpecification"
      , "dislocationtype" as "disLocationType"
      , 1 AS "frequency"
      , "duration_minutes" AS "totalDurationInMinutes"
      , DATE_FORMAT("starttimedateutc", '%Y-%m-%d') AS "firstOccurrence"
        FROM
          "athena"."disruption"
        WHERE "template" = false
        AND "templateid" = '${OTHER_DISRUPTIONS_TEMPLATE_ID}'
        AND "starttimedateutc" >= from_iso8601_timestamp('${startDate.toISOString()}') 
        AND "endtimedateutc" < from_iso8601_timestamp('${endDate.toISOString()}')
        AND "shifttype" IN (${sqlifyArray(shifts)})
        AND "unitid" IN (${sqlifyArray(unitIds || [])})
        AND (
          "dislocationtype" IN (${sqlifyArray(disruptionTypes || [])})
          OR "dislocationtype" LIKE '%'
        )
        AND "dislocationspecification" IN (${sqlifyArray(disruptionDescriptions || [])})
        AND "dislocation" IN (${sqlifyArray(disruptionCategories || [])})
    `

    log.debug(`Query is\n${query}`)
    return query
  }
}
