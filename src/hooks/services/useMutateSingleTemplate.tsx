import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ScheduleStateProps } from 'APIcustom'
import { NIL as NIL_UUID } from 'uuid'
import { Bool, CreateDisruptionMutationVariables, UpdateDisruptionInput, UpdateDisruptionMutationVariables } from 'API'
import { ICreateTemplate } from 'components/Dialogs/DisruptionDialogs/TemplateDialog'
import { useIProcessState } from 'contexts/iProcessContext'
import { createDisruption, updateDisruption } from 'graphql/mutations'
import { getCurrentDateTimeUTC } from 'helper/time'
import { defined } from 'helper/utils'
import { call } from 'services/client'

interface Props {
  scheduleState: ScheduleStateProps
  formData: ICreateTemplate
}

const mutateSingleTemplate = async ({ formData, scheduleState }: Props) => {
  const baseInput = {
    disLocation: formData.categoryClassification,
    disLocationSpecification: formData.reasonClassification,
    disLocationType: formData.typeClassification,
    description: formData.description,
    issues: formData.issues.map((_, index) => ({ ..._, index })),
    originatorId: formData.originatorId,
    teamId: scheduleState.selectedTeam?.id
  }
  if (formData.id) {
    await call<UpdateDisruptionInput, UpdateDisruptionMutationVariables>(updateDisruption, {
      input: {
        ...baseInput,
        id: formData.id
      }
    })

    return formData.id
  } else {
    await call<unknown, CreateDisruptionMutationVariables>(createDisruption, {
      input: {
        ...baseInput,
        startTimeDateUTC: getCurrentDateTimeUTC(scheduleState.timeZone),
        endTimeDateUTC: getCurrentDateTimeUTC(scheduleState.timeZone),
        cycleStationId: formData.cycleStationId,
        timeZone: scheduleState.timeZone,
        partId: scheduleState.productSelected.id,
        unitId: defined('unitId at createDisruptionTemplate', scheduleState.unitSelected?.id),
        deleted: Bool.no,
        template: Bool.yes,
        templateId: NIL_UUID
      }
    })
  }
}

const useMutateSingleTemplate = () => {
  const {
    selectedShift,
    unitSelected,
    productSelected: partSelected,
    timeZone,
    shiftTimeRange,
    cycleStationSelected,
    selectedTeam
  } = useIProcessState()
  const queryClient = useQueryClient()
  const scheduleState: ScheduleStateProps = {
    selectedShift,
    unitSelected,
    productSelected: partSelected,
    timeZone,
    shiftTimeRange,
    selectedTeam
  }

  return useMutation({
    mutationFn: (disruptionFormData: ICreateTemplate) =>
      mutateSingleTemplate({ formData: disruptionFormData, scheduleState }),
    onSuccess: (id) => {
      queryClient.invalidateQueries({
        queryKey: ['FetchTemplates', { unitId: unitSelected?.id, cycleStationId: cycleStationSelected?.id }]
      })

      queryClient.invalidateQueries({
        queryKey: ['FetchIssues']
      })

      if (id) {
        queryClient.invalidateQueries({
          queryKey: ['FetchCategoriesByDescription', { id }]
        })
      }
    },
    onError: (error) => console.error('[useMutateCreateDisruptionTemplate]: error when creating template', error)
  })
}

export default useMutateSingleTemplate
