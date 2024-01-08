import { useQuery } from '@tanstack/react-query'
import { ExtendedProductWithUnits } from 'APIcustom'
import { Get } from 'type-fest'
import { UnitBase } from 'types'
import { TargetCycleTimeInputSchema, UnitBaseSchema } from 'zodSchemas'
import { PartsWithUnitDataQuery, PartsWithUnitDataQueryVariables } from 'API'
import { ExtendedProductUnit, ExtendedUnit, QualityIssueConfig } from 'contexts/iProcessContext'
import { partsWithUnitData } from 'graphql/queriesCustom'
import { sortByDate } from 'helper/sortData'
import { TWO_MINUTES_IN_MS } from 'helper/time'
import { convertBooleanToBool } from 'helper/utils'
import { call } from 'services/client'
import { definedArray, EmptyZodObject, objectOf, WithID } from 'shared'

type PartsWithUnitData = NonNullable<Get<PartsWithUnitDataQuery, ['listParts', 'items', '0']>>
type PartsWithUnitDataUnit = NonNullable<
  Get<PartsWithUnitDataQuery, ['listParts', 'items', '0', 'units', 'items', '0']>
>

const getArrayFromUnit = (units: PartsWithUnitDataUnit[]) => {
  const selectedUnits: UnitBase[] = []
  const targetCycleTime = units.map(
    ({ targetCycleTime, unit }) =>
      // eslint-disable-next-line no-extra-boolean-cast
      TargetCycleTimeInputSchema.parse({ unitId: unit?.id, targetCycleTime: !!targetCycleTime ? targetCycleTime : 1 })
    // FIXME: Find which units have the target set to 0 (or unset)
  )

  for (const item of units) {
    if (item?.unit) {
      const response = UnitBaseSchema.safeParse(item?.unit)
      response.success ? selectedUnits.push(response.data) : console.warn(response.error)
    }
  }

  return { selectedUnits, targetCycleTime }
}

const Schema = objectOf(EmptyZodObject)
  .withType<PartsWithUnitData>()
  .transform(({ units, qualityIssueConfig, ..._ }): ExtendedProductWithUnits => {
    const { selectedUnits, targetCycleTime } = getArrayFromUnit(definedArray(units?.items))

    const qualityIssueConfigValues = JSON.parse(qualityIssueConfig ?? '{}') as QualityIssueConfig

    return {
      ..._,
      ...qualityIssueConfigValues,
      qualityIssueConfig, // TODO: Remove (not used aside from debugging)
      unitsConfig: targetCycleTime,
      productUnit: units?.items as ExtendedProductUnit[],
      units: selectedUnits as (ExtendedUnit & WithID)[],
      selectedUnits: selectedUnits?.map(({ id, shortName, name, type }) => ({
        id,
        type,
        name,
        shortName: shortName ?? ''
      })),
      hasQualityIssueConfig: convertBooleanToBool(!!qualityIssueConfig)
    }
  })

const fetchPartList = async () => {
  const response = await call<PartsWithUnitDataQuery, PartsWithUnitDataQueryVariables>(partsWithUnitData)

  return {
    items: sortByDate(definedArray(response.data?.listParts?.items).map((_) => Schema.parse(_))),
    nextToken: response.data?.listParts?.nextToken
  }
}

const useQueryListParts = () => {
  return useQuery({
    queryKey: ['ListParts'],
    queryFn: () => fetchPartList(),
    staleTime: TWO_MINUTES_IN_MS,
    throwOnError: true
  })
}

export default useQueryListParts
