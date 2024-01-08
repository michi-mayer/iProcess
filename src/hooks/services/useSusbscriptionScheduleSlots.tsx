import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { OnMutateActualCountSubscription, OnMutateActualCountSubscriptionVariables } from 'API'
import { useIProcessState } from 'contexts/iProcessContext'
import { onMutateActualCount } from 'graphql/subscriptions'
import useSubscription from './useSubscription'

export const useSubscriptionScheduleSlots = () => {
  const { unitSelected } = useIProcessState()
  const queryClient = useQueryClient()

  const getSubscriptionVariables = useCallback((): OnMutateActualCountSubscriptionVariables | undefined => {
    if (unitSelected?.id) {
      return { unitId: unitSelected.id }
    }
  }, [unitSelected?.id])

  const forwardCallbackUpdate = useCallback(
    ({ onMutateActualCount }: OnMutateActualCountSubscription) => {
      if (onMutateActualCount) {
        const { unitId } = onMutateActualCount
        queryClient.invalidateQueries({
          queryKey: ['FetchCalculationPerScheduleSlot', { unitId }]
        })
      }
    },
    [queryClient]
  )

  useSubscription(onMutateActualCount, forwardCallbackUpdate, getSubscriptionVariables())
}
