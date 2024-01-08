import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TemplateBase } from 'types'
import { MutateTemplatesMutation, MutateTemplatesMutationVariables } from 'API'
import { useIProcessState } from 'contexts/iProcessContext'
import { mutateTemplates } from 'graphql/mutations'
import { call } from 'services/client'

const batchMutateTemplates = async (templates: TemplateBase[]) => {
  const templatesWithIndex = templates.map(({ id }, index) => ({ id, index: index + 1 }))
  await call<MutateTemplatesMutation, MutateTemplatesMutationVariables>(mutateTemplates, { put: templatesWithIndex })
}

const useMutateMultipleTemplates = () => {
  const queryClient = useQueryClient()
  const { unitSelected } = useIProcessState()
  const queryKey = ['FetchTemplates', { unitId: unitSelected?.id }]
  return useMutation({
    mutationFn: batchMutateTemplates,
    onMutate: async (newTemplates) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey })

      // Snapshot the previous value from the existing cache
      const previousTemplates = queryClient.getQueryData(queryKey)

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, [{ items: newTemplates }])

      // Return a context object with the snapshotted value
      return { previousTemplates }
    },
    onError: (error, _, context) => {
      console.error('[useMutateTemplates]: error when mutating a list of templates', error)
      queryClient.setQueryData(queryKey, context?.previousTemplates)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    }
  })
}

export default useMutateMultipleTemplates
