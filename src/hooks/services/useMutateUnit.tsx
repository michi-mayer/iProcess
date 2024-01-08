import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import { CycleStation, isAssemblyLine, TeamAndCycleStations } from 'types'
import { NIL } from 'uuid'
import { IUnitState, UnitSchema } from 'zodSchemas'
import { MutateUnitMutationVariables, UnitInput } from 'API'
import { ExtendedUnit } from 'contexts/iProcessContext'
import { mutateUnit } from 'graphql/mutations'
import { convertBooleanToBool } from 'helper/utils'
import { call } from 'services/client'
import { WithID } from 'shared'

const parseCycleStation = ({ unitId: _unitId, teamId: _teamId, isActive, ...rest }: CycleStation, index: number) => ({
  ...rest,
  isActive: convertBooleanToBool(isActive),
  index: index + 1
})

const parseTeamInput = ({ unitId: _unitId, cycleStations, ..._ }: TeamAndCycleStations, index: number) => ({
  ..._,
  index: index + 1,
  cycleStations: cycleStations.map((_, index) => parseCycleStation(_, index))
})

const UnitInputFromUnitSchema = UnitSchema.transform(
  ({ speedModeCollection, teams, cycleStations, ..._ }): UnitInput => ({
    ..._,
    speedModes: JSON.stringify(speedModeCollection),
    teams: teams.map((_, index) => parseTeamInput(_, index)),
    cycleStations: cycleStations.map((_, index) => parseCycleStation(_, index)),
    machineId: _.machineId.length === 0 ? NIL : _.machineId
  })
)

const createOrUpdateUnit = async (input: UnitInput) => {
  await call<unknown, MutateUnitMutationVariables>(mutateUnit, { put: input })
}

const removeUnit = async (id: string, queryClient: QueryClient) => {
  await call<unknown, MutateUnitMutationVariables>(mutateUnit, { delete: { id } }).then(() => {
    queryClient.invalidateQueries({
      queryKey: ['ListUnits']
    })
  })
}

interface MutateUnitProps {
  previousUnitData?: ExtendedUnit
  shouldDelete?: boolean
}

const useMutateUnit = ({ previousUnitData, shouldDelete }: MutateUnitProps) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData?: IUnitState | WithID) => {
      const result = UnitInputFromUnitSchema.safeParse(formData)
      if (result.success) {
        return createOrUpdateUnit({ ...result.data, id: previousUnitData?.id })
      } else {
        if (shouldDelete && formData?.id) return removeUnit(formData.id, queryClient)
        return Promise.resolve(console.warn('Unit data is not defined'))
      }
    },
    onSuccess: (_, unit) => {
      queryClient.invalidateQueries({
        queryKey: ['ListUnits']
      })
      if (unit && 'type' in unit && isAssemblyLine(unit)) {
        queryClient.invalidateQueries({
          queryKey: ['FetchTeamsAndCycleStations', { unitId: unit.id, unitType: unit.type }]
        })
      }
    },
    onError: (error, unitData) => {
      console.error('[useMutateUnit]: There was an error while creating or updating a Unit', error, unitData)
    }
  })
}

export default useMutateUnit
