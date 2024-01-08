import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import {
  ConfigurationInput,
  Shift,
  UnitType,
  UpdateConfigurationsAndActualCountsInput,
  UpdateConfigurationsAndActualCountsMutation,
  UpdateConfigurationsAndActualCountsMutationVariables
} from 'API'
import { ConfiguratorRecord, ExtendedUnit, ShiftTranslator, useIProcessState } from 'contexts/iProcessContext'
import { updateConfigurationsAndActualCounts } from 'graphql/mutations'
import { getUtcDateTimeFromLocalDateTime } from 'helper/time'
import { call } from 'services/client'

const ConfigurationInputSchema: z.ZodType<ConfigurationInput> = z.object({
  validFrom: z.string().nullish(),
  validUntil: z.string().nullish(),
  partId: z.string().nullish(),
  shiftModelId: z.string().nullish(),
  shiftTarget: z.number().nullish(),
  cycleTime: z.number().nullish(),
  speedMode: z.number().nullish(),
  timeZone: z.string().nullish(),
  unitType: z.nativeEnum(UnitType).nullish()
})

const ConfigurationsAndActualCountSchema: z.ZodType<UpdateConfigurationsAndActualCountsInput> = z.object({
  unitId: z.string(),
  shiftType: z.nativeEnum(Shift),
  dateTimeStartUTC: z.string(),
  dateTimeEndUTC: z.string(),
  configurationIdsToDelete: z.array(z.string()),
  configurations: z.array(ConfigurationInputSchema)
})

interface ConfigurationUnitAPI {
  cycleTime?: number
  partId?: string
  shiftModelId?: string
  shiftTarget?: number
  speedMode?: number
  timeZone: string
  validFrom: string
  validUntil: string
  unitType: UnitType
}

const updateConfigurationAndActualCount = async (
  unit: ExtendedUnit | undefined,
  shiftType: Shift,
  dateTimeStartUTC: string | undefined,
  dateTimeEndUTC: string | undefined,
  formData: ConfigurationUnitAPI[],
  configurationByUnitId: ConfiguratorRecord
) => {
  const configurationIdsToDelete = configurationByUnitId[unit?.id as keyof ConfiguratorRecord]?.map((_) => _.id)

  const data = {
    unitId: unit?.id,
    shiftType,
    dateTimeStartUTC,
    dateTimeEndUTC,
    configurations: formData,
    configurationIdsToDelete
  }

  const input = ConfigurationsAndActualCountSchema.parse(data)
  return await call<UpdateConfigurationsAndActualCountsMutation, UpdateConfigurationsAndActualCountsMutationVariables>(
    updateConfigurationsAndActualCounts,
    {
      input
    }
  )
}

const useMutationUpdateConfigurationAndActualCount = () => {
  const queryClient = useQueryClient()
  const { timeZone, unitSelected, shiftTimeRange, selectedShift, configurationByUnitId } = useIProcessState()
  const dateTimeStartUTC = getUtcDateTimeFromLocalDateTime(shiftTimeRange?.dateTimeStart, timeZone)
  const dateTimeEndUTC = getUtcDateTimeFromLocalDateTime(shiftTimeRange?.dateTimeEnd, timeZone)
  return useMutation({
    mutationFn: (formData: ConfigurationUnitAPI[]) =>
      updateConfigurationAndActualCount(
        unitSelected,
        ShiftTranslator[selectedShift] as Shift,
        dateTimeStartUTC,
        dateTimeEndUTC,
        formData,
        configurationByUnitId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['FetchCalculationPerScheduleSlot']
      })
      queryClient.invalidateQueries({
        queryKey: ['ValidConfigurationByUnit']
      })
    },
    onError: (error, formData) => {
      console.error('Something went wrong when updating the configuration', {
        error,
        unit: unitSelected,
        shiftType: ShiftTranslator[selectedShift] as Shift,
        dateTimeStartUTC,
        dateTimeEndUTC,
        formData
      })
    }
  })
}

export default useMutationUpdateConfigurationAndActualCount
