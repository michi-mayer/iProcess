import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Disruption, isDisruption, Template } from 'types'
import { Bool, UpdateDisruptionInput, UpdateDisruptionMutationVariables } from 'API'
import { updateDisruption } from 'graphql/mutations'
import { call } from 'services/client'
import { NonEmptyString } from 'shared'

const deleteDisruptionTemplate = async (item: Template | Disruption) => {
  return await call<UpdateDisruptionInput, UpdateDisruptionMutationVariables>(updateDisruption, {
    input: {
      id: NonEmptyString.parse(item.id),
      deleted: Bool.yes,
      template: isDisruption(item) ? Bool.no : Bool.yes
    }
  })
}

const useMutateDeleteDisruption = (queryHash: 'FetchDisruptionsByTime' | 'FetchTemplates') => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (template: Template | Disruption) => deleteDisruptionTemplate(template),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryHash]
      })
    }
  })
}

export default useMutateDeleteDisruption
