import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateActualCountMutation, UpdateActualCountMutationVariables } from 'API'
import { VehicleNumber } from 'components/Dashboard/Tabs/DisruptionTabs'
import { updateActualCount } from 'graphql/mutations'
import { defined } from 'helper/utils'
import { call } from 'services/client'

interface Quantities {
  scheduleSlotId: string | undefined
  actualCount?: number
  quota?: number
  vehicleNumber?: VehicleNumber
}

const mutateActualCount = async ({ scheduleSlotId, quota, actualCount, vehicleNumber }: Quantities) => {
  return await call<UpdateActualCountMutation, UpdateActualCountMutationVariables>(updateActualCount, {
    input: {
      id: defined('scheduleSlotId at useMutateActualCount', scheduleSlotId),
      quota,
      actualCount,
      vehicleNumber
    }
  })
}

const useMutateActualCount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (quantities: Quantities) => mutateActualCount(quantities),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['FetchCalculationPerScheduleSlot']
      })
    },
    onError: (error, quantities) => {
      console.error('[useMutateActualCount]: error when updating actual count table', error, quantities)
    }
  })
}

export default useMutateActualCount
