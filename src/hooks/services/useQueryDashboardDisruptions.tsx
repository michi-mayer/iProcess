// React libraries, components & context
import { useQuery } from '@tanstack/react-query'
import { MustCalculateDisruptionKPIsInput } from 'APIcustom'
import { ParetoBarDatumSchema, ParetoDataSchema } from 'zodSchemas'
// Types & API
import { CalculateDisruptionKPIsQuery, CalculateDisruptionKPIsQueryVariables, Shift } from 'API'
import { useStorePareto } from 'contexts/paretoStore'
// Queries
import { calculateDisruptionKPIs } from 'graphql/queries'
import { ALL_OPTION_DASHBOARDS } from 'helper/constants'
import { call } from 'services/client'
import { arrayOf } from 'shared'

function removeAllValue(items: Shift[]): Shift[]
function removeAllValue(items: string[]): string[]
function removeAllValue(items: string[] | Shift[]): string[] | Shift[] {
  return items.filter((item) => item !== ALL_OPTION_DASHBOARDS.name && item !== ALL_OPTION_DASHBOARDS.id)
}

const fetchDashboardDisruptions = async (input: MustCalculateDisruptionKPIsInput) => {
  const response = await call<CalculateDisruptionKPIsQuery, CalculateDisruptionKPIsQueryVariables>(
    calculateDisruptionKPIs,
    { input }
  )

  const body = JSON.parse(response.data?.calculateDisruptionKPIs ?? '[]')
  const data = arrayOf(ParetoDataSchema).parse(body)
  return arrayOf(ParetoBarDatumSchema).parse(
    data.map((_) => ({
      ..._,
      productName: _.products.map((_) => _.name).join(', '),
      productNumber: _.products.map((_) => _.number).join(', ')
    }))
  )
}

const useQueryDashboardDisruptions = (shouldQuery: boolean) => {
  const [{ shifts, unitIds, startDate, endDate, ...filter }] = useStorePareto((store) => store)
  const parsedFilter = {
    startDate,
    endDate,
    shifts: removeAllValue(shifts),
    disruptionCategories: removeAllValue(filter.disruptionCategories),
    disruptionDescriptions: removeAllValue(filter.disruptionDescriptions),
    disruptionTypes: removeAllValue(filter.disruptionTypes),
    unitIds: removeAllValue(unitIds)
  }

  return useQuery({
    queryKey: ['DashboardDisruptions', parsedFilter],
    queryFn: () => fetchDashboardDisruptions(parsedFilter),
    enabled: shouldQuery
  })
}

export default useQueryDashboardDisruptions
