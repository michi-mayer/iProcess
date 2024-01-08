import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { Bool, DefectiveByUnitAndDateTimeQuery, DefectiveByUnitAndDateTimeQueryVariables } from 'API'
import { useIProcessState } from 'contexts/iProcessContext'
import { defectiveByUnitAndDateTime } from 'graphql/queriesCustom'
import {
  getLocalDateTimeFromUtcDateTime,
  getOneMinuteEarlierForDateTime,
  getUtcDateTimeFromLocalDateTime
} from 'helper/time'
import { checkNextToken, defined } from 'helper/utils'
import { call } from 'services/client'
import { NonEmptyString } from 'shared'

const Schema = z.object({
  startDateTimeUTC: NonEmptyString,
  endDateTimeUTC: NonEmptyString,
  partId: NonEmptyString,
  unitId: NonEmptyString
})

export interface Rejected {
  id: string
  type: string
  timeStamp: string
  productName: string
  productId: string
  typeOfDamage: string
  classification: string
  count: number
  defectiveGrid: string | undefined
  defectiveCause: string | undefined
}

interface FetchRejectedCountProps {
  partId: string | null | undefined
  unitId: string | undefined
  startDateTimeUTC: string | undefined
  endDateTimeUTC: string | undefined
}

const fetchRejectedCount = async (input: FetchRejectedCountProps) => {
  const { startDateTimeUTC, endDateTimeUTC, partId, unitId } = Schema.parse(input)
  const response = await call<DefectiveByUnitAndDateTimeQuery, DefectiveByUnitAndDateTimeQueryVariables>(
    defectiveByUnitAndDateTime,
    {
      unitId,
      dateTimeUTC: {
        between: [
          // between: applies only for current shift (e.g. Morning shift => from 06:30 to 14:29 )
          startDateTimeUTC,
          endDateTimeUTC
        ]
      },
      filter: {
        partId: { eq: partId },
        deleted: { eq: Bool.no }
      }
    }
  )
  checkNextToken(response.data?.defectiveByUnitIdAndDateTimeUTC?.nextToken, 'FetchRejectedCount')
  const rejectedCount = response.data?.defectiveByUnitIdAndDateTimeUTC?.items.map(
    (item) => defined('useQueryRejectedCount', item).count ?? 0
  ) as Array<number>

  const shouldReadOffSet = true
  const items = response.data?.defectiveByUnitIdAndDateTimeUTC?.items.map(
    (item) =>
      ({
        id: item?.id,
        type: 'rejected',
        timeStamp: getLocalDateTimeFromUtcDateTime(item?.dateTimeUTC, item?.timeZone, shouldReadOffSet),
        productName: item?.part?.name,
        productId: item?.part?.id,
        typeOfDamage: item?.defectiveType,
        classification: item?.defectiveLocation,
        defectiveCause: item?.defectiveCause,
        count: item?.count,
        defectiveGrid: item?.defectiveGrid
      }) as Rejected
  )
  return { rejectedCount, items }
}

interface useQueryRejectedCountProps {
  startDateTime: string | undefined
  endDateTime: string | undefined
  isDisruptionCard?: boolean
  partId: string | null | undefined
}

const useQueryRejectedCount = ({
  startDateTime,
  partId,
  endDateTime,
  isDisruptionCard = false
}: useQueryRejectedCountProps) => {
  const { unitSelected, timeZone, shiftTimeRange, isSorting } = useIProcessState()
  const queryUnitId = unitSelected?.id
  const queryStartDateTime = isDisruptionCard ? shiftTimeRange?.dateTimeStart : startDateTime

  const queryEndDateTime = getOneMinuteEarlierForDateTime(
    defined('queryEndDateTime at useQueryRejectedCount', isDisruptionCard ? shiftTimeRange?.dateTimeEnd : endDateTime),
    'local'
  )

  const input = {
    partId,
    unitId: queryUnitId,
    startDateTimeUTC: getUtcDateTimeFromLocalDateTime(queryStartDateTime, timeZone),
    endDateTimeUTC: getUtcDateTimeFromLocalDateTime(queryEndDateTime, timeZone)
  }

  const response = Schema.safeParse(input)

  return useQuery({
    queryKey: ['FetchRejectedCount', input],
    queryFn: () =>
      fetchRejectedCount(input).then((data) => {
        return {
          rejectedCount:
            data?.rejectedCount.length === 0 ? 0 : data?.rejectedCount.reduce((a: number, b: number) => a + b, 0),
          items: data?.items,
          startDateTime: queryStartDateTime
        }
      }),
    enabled: response.success && response.data.startDateTimeUTC < response.data.endDateTimeUTC && !isSorting,
    meta: {
      input: {
        partId,
        unitId: unitSelected?.id,
        between: {
          startDateTimeUTC: getUtcDateTimeFromLocalDateTime(queryStartDateTime, timeZone),
          endDateTimeUTC: getUtcDateTimeFromLocalDateTime(queryEndDateTime, timeZone)
        }
      },
      errorMessage: '[FetchRejectedCount]'
    }
  })
}

export default useQueryRejectedCount
