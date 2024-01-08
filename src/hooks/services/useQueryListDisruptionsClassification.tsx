import { GraphQLResult } from '@aws-amplify/api'
import { useQuery } from '@tanstack/react-query'
import { DisruptionClassification } from 'APIcustom'
import { DisruptionsClassificationWithUnitQuery } from 'API'
import { disruptionsClassificationWithUnit } from 'graphql/queriesCustom'
import { sortByDate } from 'helper/sortData'
import { TWO_MINUTES_IN_MS } from 'helper/time'
import { call } from 'services/client'
import { definedArray } from 'shared'

const mapListDisruptionsClassificationQuery = (
  listDisruptionClassification: GraphQLResult<DisruptionsClassificationWithUnitQuery>
) => {
  return listDisruptionClassification.data?.listUnitProblemClassifications?.items?.map(
    (item) =>
      ({
        classification: item?.classification || undefined,
        classificationPath: JSON.parse(item?.classification ?? ''),
        id: item?.id,
        createdAt: item?.createdAt,
        units: definedArray(item?.units?.items || []),

        selectedUnits: item?.units?.items.map((unit) => {
          return unit?.shortName ?? ''
        })
      }) as DisruptionClassification
  )
}

const fetchDisruptionsClassification = async () => {
  const response = await call<DisruptionsClassificationWithUnitQuery>(disruptionsClassificationWithUnit)
  const nextTokenResponse = response.data?.listUnitProblemClassifications?.nextToken
  return {
    items: sortByDate(mapListDisruptionsClassificationQuery(response)),
    nextToken: nextTokenResponse
  }
}

const useQueryListDisruptionsClassification = () => {
  return useQuery({
    queryKey: ['ListDisruptions'],
    queryFn: () => fetchDisruptionsClassification(),
    staleTime: TWO_MINUTES_IN_MS,
    throwOnError: true
  })
}

export default useQueryListDisruptionsClassification
