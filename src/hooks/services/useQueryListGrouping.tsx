import { GraphQLResult } from '@aws-amplify/api'
import { useQuery } from '@tanstack/react-query'
import { sortBy } from 'remeda'
import { TeamSchema } from 'zodSchemas'
import { GroupingsWithUnitQuery, GroupingsWithUnitQueryVariables, Unit as UnitAPI, UnitType } from 'API'
import { ExtendedGrouping, ExtendedUnit } from 'contexts/iProcessContext'
import { groupingsWithUnit } from 'graphql/queriesCustom'
import { sortByDate } from 'helper/sortData'
import { call } from 'services/client'
import { definedArray, WithID } from 'shared'
import { isUserAllowedToSeeGrouping } from './utils'

function mapTeams(unit: UnitAPI) {
  return sortBy(definedArray((unit?.teams?.items || []).map((team) => TeamSchema.parse(team))), (_) => _.index)
}

const mapListGroupingQuery = (
  listGroupingsQuery: GraphQLResult<GroupingsWithUnitQuery>,
  showAllGroupings: boolean,
  userSubDepartment: string | undefined
) => {
  const groupingList: ExtendedGrouping[] = []

  for (const grouping of listGroupingsQuery?.data?.listGroupings?.items || []) {
    const units = (grouping?.units?.items || []) as (ExtendedUnit & WithID)[]

    if (units.length === 0 && !showAllGroupings) continue

    if (isUserAllowedToSeeGrouping(grouping?.allowedDepartments, userSubDepartment, showAllGroupings)) {
      const parsedGrouping: ExtendedGrouping = {
        id: grouping?.id,
        name: grouping?.groupingName,
        createdAt: grouping?.createdAt,
        selectedSubDepartments: grouping?.allowedDepartments ?? undefined,
        units: sortBy(
          units.map((unit) => ({
            ...unit,
            teams: mapTeams(unit as UnitAPI)
          })),
          (_) => _.shortName
        )
      }
      groupingList.push(parsedGrouping)
    }
  }
  return groupingList
}

export const fetchGroupingList = async (
  byAssemblyLine: boolean = false,
  showAllGroupings = false,
  userSubDepartment: string | undefined = undefined
) => {
  const response = await call<GroupingsWithUnitQuery, GroupingsWithUnitQueryVariables>(groupingsWithUnit, {
    unitFilter: byAssemblyLine
      ? {
          type: { eq: UnitType.assemblyLine }
        }
      : undefined
  })
  const nextTokenResponse = response.data?.listGroupings?.nextToken
  return {
    items: sortByDate(mapListGroupingQuery(response, showAllGroupings, userSubDepartment)),
    nextToken: nextTokenResponse
  }
}

export type UseQueryListGroupingReturn = Awaited<ReturnType<typeof fetchGroupingList>>

interface Props {
  byAssemblyLine?: boolean
  isSorting?: boolean
  showAllGroupings?: boolean
  userSubDepartment?: string
}

const useQueryListGrouping = ({
  isSorting = false,
  byAssemblyLine = false,
  showAllGroupings = false,
  userSubDepartment
}: Props = {}) => {
  return useQuery({
    queryKey: ['ListGrouping', { byAssemblyLine, showAllGroupings, userSubDepartment }],
    queryFn: () => fetchGroupingList(byAssemblyLine, showAllGroupings, userSubDepartment),
    throwOnError: true,
    enabled: !isSorting
  })
}

export default useQueryListGrouping
