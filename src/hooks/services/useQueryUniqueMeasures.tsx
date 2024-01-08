import { useQuery } from '@tanstack/react-query'
import { uniq } from 'remeda'
import { Bool, DisruptionMeasuresByUnitIdQuery, DisruptionMeasuresByUnitIdQueryVariables } from 'API'
import { useIProcessState } from 'contexts/iProcessContext'
import { disruptionMeasuresByUnitId } from 'graphql/queriesCustom'
import { trimEnd } from 'helper/utils'
import { call } from 'services/client'
import { definedArray, NonEmptyString } from 'shared'

const CHARACTERS_LENGTH = 1

const fetchMeasures = async (unitId: string | undefined) => {
  const parsedUnitId = NonEmptyString.parse(unitId)
  const response = await call<DisruptionMeasuresByUnitIdQuery, DisruptionMeasuresByUnitIdQueryVariables>(
    disruptionMeasuresByUnitId,
    {
      unitId: parsedUnitId,
      deletedTemplate: {
        eq: {
          deleted: Bool.no,
          template: Bool.no
        }
      }
    }
  )

  return uniq(
    definedArray(response.data?.disruptionsByUnitId?.items)
      .map((_) => trimEnd(NonEmptyString.parse(_?.measures)))
      .filter((measure) => measure && measure?.length > CHARACTERS_LENGTH)
  )
}

const useQueryUniqueMeasures = () => {
  const { unitSelected } = useIProcessState()
  const result = NonEmptyString.safeParse(unitSelected?.id)
  return useQuery({
    queryKey: ['Measures', { unitId: unitSelected?.id }],
    queryFn: () => fetchMeasures(unitSelected?.id),
    enabled: result.success,
    initialData: []
  })
}

export default useQueryUniqueMeasures
