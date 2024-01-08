import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { CalculateShiftTargetCustomQuery, CalculateShiftTargetCustomQueryVariables, Shift } from 'API'
import { calculateShiftTargetCustom } from 'graphql/queries'
import { call } from 'services/client'

const Schema = z.object({
  cycleTime: z.number(),
  shiftModelId: z.string(),
  shiftType: z.nativeEnum(Shift)
})

type Props = Partial<z.infer<typeof Schema>>

const fetchCalculateShiftTargetCustom = async (input: Props) => {
  const { cycleTime, shiftModelId, shiftType } = Schema.parse(input)
  const response = await call<CalculateShiftTargetCustomQuery, CalculateShiftTargetCustomQueryVariables>(
    calculateShiftTargetCustom,
    {
      input: {
        cycleTime,
        shiftModelId,
        shiftType
      }
    }
  )

  return response?.data?.calculateShiftTargetCustom
}

interface useCalculateShiftTargetProps extends Props {
  enableQuery?: boolean
}

const useCalculateShiftTargetCustom = ({
  cycleTime,
  shiftModelId,
  shiftType,
  enableQuery = true
}: useCalculateShiftTargetProps) => {
  const input = {
    cycleTime,
    shiftModelId,
    shiftType
  }
  return useQuery({
    queryKey: ['CalculateShiftTargetCustom', input],
    queryFn: () => fetchCalculateShiftTargetCustom(input),
    enabled: Schema.safeParse(input).success && enableQuery,
    meta: {
      input,
      errorMessage: '[fetchCalculateShiftTargetCustom]: error fetching calculated shift target'
    }
  })
}

export default useCalculateShiftTargetCustom
