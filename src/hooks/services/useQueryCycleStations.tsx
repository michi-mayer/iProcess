import { useQuery } from '@tanstack/react-query'
import { sortBy } from 'remeda'
import { Get } from 'type-fest'
import {
  ActiveCycleStationsByTeamIdQueryVariables,
  ActiveCycleStationsByUnitIdQueryVariables,
  Bool,
  CycleStationsByUnitIdQuery
} from 'API'
import { activeCycleStationsByTeamId, activeCycleStationsByUnitId } from 'graphql/queriesCustom'
import { convertBoolToBoolean } from 'helper/utils'
import { scan } from 'services/client'
import { NonEmptyString, NonNegativeNumber } from 'shared'

export type CycleStationResponse = Omit<
  NonNullable<Get<CycleStationsByUnitIdQuery, ['cycleStationsByUnit', 'items', '0']>>,
  '__typename'
>

interface Props {
  unitId: string | undefined
  teamId: string | undefined
}

export const fetchCycleStationsByUnit = async ({ unitId, teamId }: Props) => {
  const parsedUnitId = NonEmptyString.parse(unitId)

  const cycleStations = teamId
    ? await scan<CycleStationResponse, ActiveCycleStationsByTeamIdQueryVariables>(activeCycleStationsByTeamId, {
        teamId,
        isActive: {
          eq: Bool.yes
        }
      })
    : await scan<CycleStationResponse, ActiveCycleStationsByUnitIdQueryVariables>(activeCycleStationsByUnitId, {
        unitId: parsedUnitId,
        isActive: {
          eq: Bool.yes
        }
      })

  return sortBy(
    cycleStations.map(({ index, isActive, ...rest }) => ({
      ...rest,
      index: NonNegativeNumber.parse(index),
      isActive: convertBoolToBoolean(isActive)
    })),
    (_) => _.index
  )
}

const useQueryCycleStations = ({ unitId, teamId }: Props) => {
  const response = NonEmptyString.safeParse(unitId)
  return useQuery({
    queryKey: ['FetchCycleStationsByUnitId', { unitId, teamId }],
    queryFn: () => fetchCycleStationsByUnit({ unitId, teamId }),
    enabled: response.success,
    initialData: []
  })
}

export default useQueryCycleStations
