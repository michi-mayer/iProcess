import { useQuery } from '@tanstack/react-query'
import { sortBy } from 'remeda'
import { match } from 'ts-pattern'
import { Get } from 'type-fest'
import { DisruptionWithTemplateData } from 'types'
import { z, ZodType } from 'zod'
import { Bool, DisruptionByUnitAndDateTimeQuery, DisruptionByUnitAndDateTimeQueryVariables } from 'API'
import { useIProcessState } from 'contexts/iProcessContext'
import { disruptionByUnitAndDateTime } from 'graphql/queriesCustom'
import { convertBoolToBoolean, extendDisruptionWithTimeRange } from 'helper/utils'
import { scan } from 'services/client'
import { DateTimeRange, NonEmptyString, UNIT_SPECIFIC_CYCLE_STATION } from 'shared'
import { updateDisruptionWithTemplateData } from './utils'

export enum TeamsChoice {
  SelectedTeam = 'SelectedTeam',
  PreviousTeams = 'PreviousTeams',
  NoTeam = 'NoTeam'
}

type TeamsOption =
  | { by: TeamsChoice.NoTeam }
  | { by: TeamsChoice.SelectedTeam; id: string | undefined }
  | { by: TeamsChoice.PreviousTeams; ids: string[] }

const TeamsOptionSchema: ZodType<TeamsOption> = z.discriminatedUnion('by', [
  z.object({ by: z.literal(TeamsChoice.NoTeam) }),
  z.object({ by: z.literal(TeamsChoice.SelectedTeam), id: NonEmptyString }),
  z.object({ by: z.literal(TeamsChoice.PreviousTeams), ids: z.array(NonEmptyString).nonempty() })
])

const filterByReporterTeam = (reporter: TeamsOption | undefined, { team }: DisruptionWithTemplateData) =>
  match(reporter)
    .with({ by: TeamsChoice.SelectedTeam }, ({ id }) => team?.id && team.id === id)
    .with({ by: TeamsChoice.PreviousTeams }, ({ ids }) => team?.id && ids.includes(team.id))
    .otherwise(() => true)

const filterByOriginatorTeam = (originator: TeamsOption | undefined, { originatorTeam }: DisruptionWithTemplateData) =>
  match(originator)
    .with({ by: TeamsChoice.SelectedTeam }, ({ id }) => originatorTeam?.id && originatorTeam.id === id)
    .with({ by: TeamsChoice.PreviousTeams }, ({ ids }) => originatorTeam?.id && ids.includes(originatorTeam.id))
    .with({ by: TeamsChoice.NoTeam }, () => !originatorTeam?.id)
    .otherwise(() => true)

type InputDisruption = NonNullable<
  Get<DisruptionByUnitAndDateTimeQuery, ['disruptionByUnitIdAndStartTimeDateUTC', 'items', '0']>
>

export interface FetchDisruptionsByTimeProps {
  unitId: string
  partId: string
  cycleStationId?: string
  startUTC: string
  endUTC: string
  originator?: TeamsOption
  reporter?: TeamsOption
}

const Schema: ZodType<FetchDisruptionsByTimeProps> = z.object({
  unitId: NonEmptyString,
  partId: NonEmptyString,
  originator: TeamsOptionSchema.optional(),
  reporter: TeamsOptionSchema.optional(),
  cycleStationId: z.string().optional(), // ? can be an empty string
  startUTC: NonEmptyString,
  endUTC: NonEmptyString
})

const fetchDisruptionsByTime = async (input: Partial<FetchDisruptionsByTimeProps>) => {
  const { unitId, partId, startUTC, endUTC, cycleStationId, originator, reporter } = Schema.parse(input)

  const response = await scan<InputDisruption, DisruptionByUnitAndDateTimeQueryVariables>(disruptionByUnitAndDateTime, {
    unitId,
    startTimeDateUTC: { between: [startUTC, endUTC] },
    filter: {
      deleted: { eq: Bool.no },
      template: { eq: Bool.no },
      partId: { eq: partId },
      endTimeDateUTC: { ge: startUTC },
      cycleStationId: cycleStationId ? { eq: cycleStationId } : undefined
    }
  })

  const results: DisruptionWithTemplateData[] = []

  for (const { cycleStation, isSolved, ..._ } of response) {
    const item = {
      ..._,
      cycleStationId: cycleStation?.id || UNIT_SPECIFIC_CYCLE_STATION.id,
      cycleStationName: cycleStation?.name || UNIT_SPECIFIC_CYCLE_STATION.name,
      isSolved: convertBoolToBoolean(isSolved)
    }

    const itemWithTemplateData = await updateDisruptionWithTemplateData(item)
    const result = extendDisruptionWithTimeRange(itemWithTemplateData)

    if (filterByOriginatorTeam(originator, result) && filterByReporterTeam(reporter, result)) {
      results.push(result)
    }
  }

  return sortBy(results, (_) => _.startTimeDate)
}

export interface UseQueryDisruptionsByTimeProps extends DateTimeRange<string | undefined> {
  originator?: TeamsOption
  reporter?: TeamsOption
  cycleStationId?: string
}

const useQueryDisruptionsByTime = ({
  dateTimeStartUTC,
  dateTimeEndUTC,
  cycleStationId,
  originator,
  reporter
}: UseQueryDisruptionsByTimeProps) => {
  const { unitSelected, productSelected: partSelected } = useIProcessState()
  const input: Partial<FetchDisruptionsByTimeProps> = {
    originator,
    reporter,
    cycleStationId,
    unitId: unitSelected?.id,
    partId: partSelected?.id ?? undefined,
    startUTC: dateTimeStartUTC,
    endUTC: dateTimeEndUTC
  }

  return useQuery({
    queryKey: ['FetchDisruptionsByTime', input, unitSelected, partSelected],
    queryFn: () => fetchDisruptionsByTime(input),
    enabled: Schema.safeParse(input).success,
    initialData: [],
    meta: {
      input,
      errorMessage: '[useQueryDisruptionsByTime] Error fetching disruptionsByTime:'
    }
  })
}

export default useQueryDisruptionsByTime
