import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isReportMeasure, MutateReportMeasure } from 'types'
import { MutateMeasureReportMutation, MutateMeasureReportMutationVariables } from 'API'
import { mutateMeasureReport } from 'graphql/mutations'
import { convertBooleanToBool, defined } from 'helper/utils'
import { call } from 'services/client'

type FormData = MutateReportMeasure | { id: string }

const mutateReportMeasure = async (formData: FormData) => {
  if (isReportMeasure(formData)) {
    const measures =
      formData.measures?.map((measure) => ({
        ...measure,
        attachments: JSON.stringify(measure.attachments)
      })) || []

    return await call<MutateMeasureReportMutation, MutateMeasureReportMutationVariables>(mutateMeasureReport, {
      put: {
        ...formData,
        cycleStationName: defined('cycleStationName at useMutateReportMeasure', formData.cycleStationName),
        isCritical: convertBooleanToBool(formData.isCritical),
        classifications: JSON.stringify(formData.classifications),
        causes: JSON.stringify(formData.causes),
        attachments: JSON.stringify(formData.attachments),
        measures
      }
    })
  } else {
    return await call<MutateMeasureReportMutation, MutateMeasureReportMutationVariables>(mutateMeasureReport, {
      delete: { id: formData.id }
    })
  }
}

const useMutateReportMeasure = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => mutateReportMeasure(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ListReportMeasures']
      })
    },
    onError: (error, data) => console.error('[useMutateReportMeasure]:', error, data)
  })
}

export default useMutateReportMeasure
