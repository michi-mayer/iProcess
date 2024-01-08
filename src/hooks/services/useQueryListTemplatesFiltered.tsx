import { useInfiniteQuery } from '@tanstack/react-query'
import { Get } from 'type-fest'
import { TemplateBase, TemplateBaseWithOriginator } from 'types'
import { z } from 'zod'
import { TemplateBaseSchema, TemplateBaseWithTeamInfoSchema } from 'zodSchemas'
import { Bool, ModelIDInput, TemplatesByUnitQuery, TemplatesByUnitQueryVariables } from 'API'
import { useIProcessState } from 'contexts/iProcessContext'
import { templatesByUnit } from 'graphql/queriesCustom'
import { call, ScanResult } from 'services/client'
import { arrayOf, definedArray, MaybeEmptyString, NonEmptyString, parse } from 'shared'

type QueryItems = NonNullable<Get<TemplatesByUnitQuery, ['listTemplatesByUnit', 'items', '0']>>

interface FilterByTeamProps {
  reportedByTeam?: string
  reportedByAnyTeam?: boolean // * Remember that 'teamID' isn't set for Production Units
  reportedByPreviousTeams?: boolean
  reportedBySelectedPreviousTeams?: string[]
}

interface FetchTemplatesProps extends Pick<ScanResult, 'nextToken'>, FilterByTeamProps {
  unitId: string
  cycleStationId?: string
}

const Schema = parse<FetchTemplatesProps>().with({
  unitId: NonEmptyString,
  cycleStationId: MaybeEmptyString.optional(), // * Set to EMPTY_STRING by default
  nextToken: NonEmptyString.nullish(),
  reportedByTeam: NonEmptyString.optional(),
  reportedByAnyTeam: z.boolean().optional(),
  reportedByPreviousTeams: z.boolean().optional(),
  reportedBySelectedPreviousTeams: arrayOf(NonEmptyString)
})

const buildFilter = (
  { reportedByTeam, reportedByAnyTeam, reportedByPreviousTeams }: FilterByTeamProps,
  cycleStationId: string | undefined
): TemplatesByUnitQueryVariables['filter'] => {
  let teamIdFilter: ModelIDInput | undefined

  if (reportedByAnyTeam) {
    // * We dont care about the reporter and bring them all
    teamIdFilter = { attributeExists: true }
  } else if (reportedByTeam) {
    // *We want only templates that belong to the reporter
    teamIdFilter = { eq: reportedByTeam }
  }

  const cycleStationIdFilter =
    cycleStationId && !reportedByAnyTeam && !reportedByPreviousTeams ? { eq: cycleStationId } : undefined

  return {
    deleted: { eq: Bool.no },
    cycleStationId: cycleStationIdFilter,
    originatorId: { attributeExists: reportedByPreviousTeams || false },
    teamId: teamIdFilter
  }
}

const getItems = (
  input: QueryItems[],
  { reportedByPreviousTeams, reportedBySelectedPreviousTeams }: FilterByTeamProps
) => {
  if (reportedByPreviousTeams) {
    const items = arrayOf(TemplateBaseWithTeamInfoSchema).parse(input)

    if (reportedBySelectedPreviousTeams) {
      return items.filter((_) => reportedBySelectedPreviousTeams.includes(_.originatorTeam.id))
    }

    return items
  }

  return arrayOf(TemplateBaseSchema).parse(input)
}

const fetchTemplates = async <T extends TemplateBaseWithOriginator | TemplateBase>(
  input: Partial<FetchTemplatesProps>
) => {
  const { unitId, cycleStationId, nextToken, ...filterProps } = Schema.parse(input)

  const filter = buildFilter(filterProps, cycleStationId)
  const response = await call<TemplatesByUnitQuery, TemplatesByUnitQueryVariables>(templatesByUnit, {
    unitId,
    nextToken,
    filter,
    template: { eq: Bool.yes }
  })

  const query = response.data?.listTemplatesByUnit
  const values = definedArray(query?.items)

  return { items: getItems(values, filterProps), nextToken: query?.nextToken } as ScanResult<T>
}

const useQueryListTemplatesFiltered = <T extends TemplateBaseWithOriginator | TemplateBase>(
  props: FilterByTeamProps = {}
) => {
  const { unitSelected, cycleStationSelected, isSorting } = useIProcessState()

  const input: Partial<FetchTemplatesProps> = {
    ...props,
    unitId: unitSelected?.id,
    cycleStationId: cycleStationSelected?.id
  }

  return useInfiniteQuery({
    queryKey: ['FetchTemplates', input],
    queryFn: ({ pageParam }) => fetchTemplates<T>({ ...input, nextToken: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextToken,
    initialPageParam: undefined as FetchTemplatesProps['nextToken'],
    throwOnError: false,
    enabled: Schema.safeParse(input).success && !isSorting,
    meta: {
      input,
      errorMessage: 'Error fetching Templates:'
    }
  })
}

export default useQueryListTemplatesFiltered
