import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DeleteConfigurationCustomMutationVariables } from 'API'
import { useIProcessState } from 'contexts/iProcessContext'
import { deleteConfigurationCustom } from 'graphql/mutations'
import { getCurrentConfigs } from 'helper/utils'
import { call } from 'services/client'

const deleteConfiguration = async (configurationIds: string[]) => {
  await Promise.all(
    configurationIds.map(async (configurationId) => {
      return await call<unknown, DeleteConfigurationCustomMutationVariables>(deleteConfigurationCustom, {
        id: configurationId
      })
    })
  )
}

const useMutateDeleteConfiguration = () => {
  const { configurationByUnitId, unitSelected } = useIProcessState()
  const [configurationIds, setConfigurationIds] = useState<string[]>([])
  const configurations = getCurrentConfigs(configurationByUnitId, unitSelected?.id)

  useEffect(() => {
    if (configurations) {
      setConfigurationIds(configurations.map((configuration) => configuration.id))
    }
  }, [configurations])

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteConfiguration(configurationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ValidConfigurationByUnit']
      })
    },
    onError: (error) =>
      console.error('[deleteConfigurationCustom] Error deleting configuration', {
        error,
        configurationIds
      })
  })
}

export default useMutateDeleteConfiguration
