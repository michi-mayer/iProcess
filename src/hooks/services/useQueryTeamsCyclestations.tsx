import { DefinedUseQueryResult, useQuery } from '@tanstack/react-query'
import { sortBy } from 'remeda'
import { CycleStation, TeamAndCycleStations } from 'types'
import { z } from 'zod'
import { CycleStationSchema, TeamAndCycleStationsSchema } from 'zodSchemas'
import {
  CycleStationsByUnitIdQueryVariables,
  TeamsAndCycleStationsByUnitQuery,
  TeamsAndCycleStationsByUnitQueryVariables,
  UnitType
} from 'API'
import { cycleStationsByUnitId, teamsAndCycleStationsByUnit } from 'graphql/queriesCustom'
import { convertBoolToBoolean } from 'helper/utils'
import { call, scan } from 'services/client'
import { definedArray, NonEmptyString } from 'shared'
import { CycleStationResponse } from './useQueryCycleStations'

const Schema = z.object({
  unitId: NonEmptyString,
  unitType: z.nativeEnum(UnitType)
})

interface OverloadParams<T extends UnitType> {
  unitId: string | undefined
  unitType: T | undefined
}

interface Params {
  unitId: string | undefined
  unitType: UnitType | undefined
}

async function fetchTeamsAndCycleStations<T extends UnitType.assemblyLine | UnitType.productionUnit>(
  params: OverloadParams<T>
): Promise<T extends UnitType.assemblyLine ? TeamAndCycleStations[] : CycleStation[]>
async function fetchTeamsAndCycleStations(params: Params): Promise<TeamAndCycleStations[] | CycleStation[]> {
  const { unitId, unitType } = Schema.parse(params)
  if (unitType === UnitType.productionUnit) {
    const cycleStations = await scan<CycleStationResponse, CycleStationsByUnitIdQueryVariables>(cycleStationsByUnitId, {
      unitId
    })
    return sortBy(
      cycleStations.map(({ isActive, ...rest }) =>
        CycleStationSchema.parse({
          ...rest,
          isActive: convertBoolToBoolean(isActive)
        })
      ),
      (_) => _.index
    )
  } else {
    const response = await call<TeamsAndCycleStationsByUnitQuery, TeamsAndCycleStationsByUnitQueryVariables>(
      teamsAndCycleStationsByUnit,
      {
        unitId
      }
    )
    return sortBy(definedArray(response.data?.teamsByUnit?.items), (_) => _.index).map((team) =>
      TeamAndCycleStationsSchema.parse({
        ...team,
        cycleStations: sortBy(team.cycleStations?.items || [], (_) => _?.index || 0).map((cycleStation) => ({
          ...cycleStation,
          isActive: convertBoolToBoolean(cycleStation?.isActive)
        }))
      })
    )
  }
}

function useQueryTeamsCyclestations<T extends UnitType.assemblyLine | UnitType.productionUnit>(
  params: OverloadParams<T>
): DefinedUseQueryResult<T extends UnitType.assemblyLine ? TeamAndCycleStations[] : CycleStation[], unknown>
function useQueryTeamsCyclestations(params: Params) {
  const response = Schema.safeParse(params)
  return useQuery({
    queryKey: ['FetchTeamsAndCycleStations', params],
    queryFn: () => fetchTeamsAndCycleStations(params),
    enabled: response.success,
    initialData: [],
    meta: {
      input: params,
      errorMessage: '[useQueryTeamsCyclestations]: error fetching Teams and CycleStations'
    }
  })
}

export default useQueryTeamsCyclestations
