import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import {
  CreatedAt,
  CycleStationInput,
  M100RangeInput,
  TeamsInput,
  UnitInput,
  UnitsDataQuery,
  UnitsDataQueryVariables,
  UnitType
} from 'API'
import { ExtendedUnit, SpeedMode } from 'contexts/iProcessContext'
import { unitsData } from 'graphql/queriesCustom'
import { sortByDate } from 'helper/sortData'
import { TWO_MINUTES_IN_MS } from 'helper/time'
import { call } from 'services/client'
import { arrayOf, EmptyZodObject, NonEmptyString, objectOf, parse, WithID } from 'shared'

const UnitInputSchema = parse<UnitInput & WithID & CreatedAt>().with({
  id: NonEmptyString,
  name: NonEmptyString,
  shortName: NonEmptyString,
  machineId: NonEmptyString,
  type: z.nativeEnum(UnitType),
  m100Range: objectOf(EmptyZodObject).withType<M100RangeInput>().nullish(),
  manufacturer: NonEmptyString.nullish(),
  speedModes: NonEmptyString.nullish(),
  teams: arrayOf(objectOf(EmptyZodObject).withType<TeamsInput>()),
  cycleStations: arrayOf(objectOf(EmptyZodObject).withType<CycleStationInput>()),
  createdAt: NonEmptyString
})

const UnitDataSchema = UnitInputSchema.omit({ cycleStations: true }).transform(
  ({ speedModes, m100Range, ..._ }): ExtendedUnit & WithID => ({
    ..._,
    m100Range: m100Range ?? undefined,
    speedModeCollection: speedModes ? (JSON.parse(speedModes) as SpeedMode[]) : []
  })
)

interface FetchUnitListProps {
  type?: UnitType
}

const fetchUnitList = async ({ type }: FetchUnitListProps) => {
  const response = await call<UnitsDataQuery, UnitsDataQueryVariables>(
    unitsData,
    type ? { filter: { type: { eq: type } } } : undefined
  )

  const result = response?.data?.listUnits
  const items = sortByDate(arrayOf(UnitDataSchema).parse(result?.items))

  return { items, nextToken: result?.nextToken }
}

interface UseQueryListUnitsProps extends FetchUnitListProps {}

const useQueryListUnits = (props: UseQueryListUnitsProps = {}) => {
  return useQuery({
    queryKey: ['ListUnits', props],
    queryFn: () => fetchUnitList(props),
    staleTime: TWO_MINUTES_IN_MS,
    throwOnError: true,
    meta: {
      input: props,
      errorMessage: '[useQueryListUnits]: error fetching units'
    }
  })
}

export default useQueryListUnits
