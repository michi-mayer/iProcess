import { GraphQLResult } from '@aws-amplify/api'
import { useQuery } from '@tanstack/react-query'
import { PartsByUnitQuery, PartsByUnitQueryVariables } from 'API'
import { ExtendedProduct, ExtendedUnit, useIProcessState } from 'contexts/iProcessContext'
import { partsByUnit } from 'graphql/queriesCustom'
import { defined } from 'helper/utils'
import { call } from 'services/client'

function mapGetUnitsQueryPart(getPartsByUnit: GraphQLResult<PartsByUnitQuery>) {
  return getPartsByUnit?.data?.getUnit?.parts?.items?.map((part) => {
    return {
      id: part?.part?.id,
      partNumber: part?.part?.partNumber,
      name: part?.part?.name,
      targetCycleTime: part?.targetCycleTime
    } as ExtendedProduct
  })
}

const fetchPartList = async (unitSelected: ExtendedUnit | undefined) => {
  const response = await call<PartsByUnitQuery, PartsByUnitQueryVariables>(partsByUnit, {
    id: defined('unitId at fetchPartList', unitSelected?.id)
  })

  return mapGetUnitsQueryPart(response)
}

const useQueryGetPartsByUnit = () => {
  const { unitSelected } = useIProcessState()
  return useQuery({
    queryKey: ['PartList', { unitId: unitSelected?.id }, unitSelected],
    queryFn: () => fetchPartList(unitSelected),
    enabled: !!unitSelected?.id,
    meta: {
      input: { unitSelected },
      errorMessage: 'Error fetching parts'
    }
  })
}

export default useQueryGetPartsByUnit
