import { useQuery } from '@tanstack/react-query'
import { WithIDSchema } from 'zodSchemas'
import { ShiftModelWithUnitQuery, ShiftModelWithUnitQueryVariables } from 'API'
import { shiftModelWithUnit } from 'graphql/queriesCustom'
import { TWO_MINUTES_IN_MS } from 'helper/time'
import { call } from 'services/client'
import { MaybeID } from 'shared'
import { parseShiftModel } from './useQueryListShiftModels'

const getShiftModel = async (input: MaybeID) => {
  const { id } = WithIDSchema.parse(input)

  const response = await call<ShiftModelWithUnitQuery, ShiftModelWithUnitQueryVariables>(shiftModelWithUnit, { id })
  const shiftModel = response.data?.getShiftModel

  return shiftModel ? parseShiftModel(shiftModel) : shiftModel
}

export const useQueryShiftModelById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['GetShiftModel', { id }],
    queryFn: () => getShiftModel({ id }),
    enabled: !!id,
    staleTime: TWO_MINUTES_IN_MS,
    meta: {
      input: { id },
      errorMessage: 'Error fetching Shift Model by ID'
    }
  })
}
