import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { DisruptionWithTemplateData } from 'types'
import { z, ZodSchema } from 'zod'
import {
  Bool,
  DisruptionByUnitAndDateTimeQuery,
  DisruptionByUnitAndDateTimeQueryVariables,
  ModelSortDirection
} from 'API'
import { useIProcessState } from 'contexts/iProcessContext'
import { disruptionByUnitAndDateTime } from 'graphql/queriesCustom'
import { getUTCStartEndDateForDay } from 'helper/time'
import { convertBoolToBoolean, extendDisruptionWithTimeRange } from 'helper/utils'
import { call } from 'services/client'
import { definedArray, NonEmptyString, UNIT_SPECIFIC_CYCLE_STATION } from 'shared'
import { updateDisruptionWithTemplateData } from './utils'

interface Props {
  unitId: string
  startDateTime: string
  endDateTime: string
  nextToken?: string | null
}

const Schema: ZodSchema<Props> = z.object({
  unitId: NonEmptyString,
  startDateTime: NonEmptyString,
  endDateTime: NonEmptyString
})

const fetchDisruptionsByDay = async ({ nextToken, ...input }: Partial<Props>) => {
  const { unitId, startDateTime, endDateTime } = Schema.parse(input)
  const response = await call<DisruptionByUnitAndDateTimeQuery, DisruptionByUnitAndDateTimeQueryVariables>(
    disruptionByUnitAndDateTime,
    {
      unitId,
      startTimeDateUTC: { between: [startDateTime, endDateTime] },
      sortDirection: ModelSortDirection.DESC,
      filter: { deleted: { eq: Bool.no }, template: { eq: Bool.no } },
      nextToken
    }
  )

  const disruptionItems = definedArray(response.data?.disruptionByUnitIdAndStartTimeDateUTC?.items)
  const items: DisruptionWithTemplateData[] = []

  for (const { cycleStation, ..._ } of disruptionItems) {
    const item = {
      ..._,
      cycleStationId: cycleStation?.id || UNIT_SPECIFIC_CYCLE_STATION.id,
      cycleStationName: cycleStation?.name || UNIT_SPECIFIC_CYCLE_STATION.name,
      isSolved: convertBoolToBoolean(_.isSolved)
    }
    const itemWithTemplateData = await updateDisruptionWithTemplateData(item)
    const itemWithTemplateDataAndDateTime = extendDisruptionWithTimeRange(itemWithTemplateData)
    items.push(itemWithTemplateDataAndDateTime)
  }

  return { items, nextToken: response.data?.disruptionByUnitIdAndStartTimeDateUTC?.nextToken }
}

const useQueryDisruptionsByDay = () => {
  const { currentDate, currentTime, unitSelected, timeZone } = useIProcessState()
  const { startDateTime, endDateTime } = getUTCStartEndDateForDay(currentDate, currentTime, timeZone)

  const input: Partial<Props> = {
    endDateTime,
    startDateTime,
    unitId: unitSelected?.id
  }

  return useInfiniteQuery({
    queryKey: ['FetchDisruptionsByDay', input],
    queryFn: ({ pageParam }) => fetchDisruptionsByDay({ nextToken: pageParam, ...input }),
    getNextPageParam: (lastPage) => lastPage?.nextToken,
    initialPageParam: undefined as Props['nextToken'],
    enabled: Schema.safeParse(input).success,
    placeholderData: keepPreviousData,
    meta: {
      input,
      errorMessage: 'Error fetching disruptionsByDay:'
    }
  })
}

export default useQueryDisruptionsByDay
