import { useQuery } from '@tanstack/react-query'
import { pipe, sortBy } from 'remeda'
import { Get } from 'type-fest'
import {
  actualCount as ActualCount,
  ModelSortDirection,
  ScheduleSlotsByUnitAndDateTimeQuery,
  ScheduleSlotsByUnitAndDateTimeQueryVariables
} from 'API'
import { ExtendedScheduleSlot, QualityIssueConfig, useIProcessState } from 'contexts/iProcessContext'
import { scheduleSlotsByUnitAndDateTime } from 'graphql/queriesCustom'
import { getLocalDateTimeFromUtcDateTime, getTimeRange } from 'helper/time'
import { convertBooleanToBool } from 'helper/utils'
import { scan } from 'services/client'
import { EmptyZodObject, NonEmptyString, objectOf, parse } from 'shared'
import { DateTimeRange, defined, definedArray } from 'shared/types'
import { mapScheduleHours } from './useQueryUnitListByGrouping'

type BaseScheduleSlot = NonNullable<
  Get<ScheduleSlotsByUnitAndDateTimeQuery, ['scheduleSlotByUnitAndDateTimeStart', 'items', '0']>
>

const BaseScheduleSlotSchema = objectOf(EmptyZodObject).withType<ActualCount>()

const ScheduleSlotSchema = BaseScheduleSlotSchema.transform((_): Omit<ExtendedScheduleSlot, 'i'> => {
  const qualityIssueConfig = JSON.parse(_.part?.qualityIssueConfig ?? '{}') as QualityIssueConfig
  const { scheduleHours, ...shiftModel } = defined(_.configuration?.shiftModel)

  return {
    ..._,
    dateTimeStart: getLocalDateTimeFromUtcDateTime(_.dateTimeStartUTC, _.timeZone, true),
    dateTimeEnd: getLocalDateTimeFromUtcDateTime(_.dateTimeEndUTC, _.timeZone, true),
    shiftModel: {
      ...shiftModel,
      scheduleHours: mapScheduleHours(definedArray(scheduleHours?.items))
    },
    partByScheduleSlot: {
      ..._.part,
      qualityIssueConfig: undefined, // TODO: Remove from types. This is only used for API queries / mutations
      targetCycleTimeAndUnitPart: new Map(
        definedArray(_.part?.units?.items).map(({ targetCycleTime }) => [
          NonEmptyString.parse(_.unit?.id),
          targetCycleTime ?? undefined
        ])
      ),
      nioClassificationLocation: qualityIssueConfig.nioClassificationLocation ?? undefined,
      nioClassificationDamageType: qualityIssueConfig.nioClassificationDamageType ?? undefined,
      nioClassificationErrorSource: qualityIssueConfig.nioClassificationErrorSource ?? undefined,
      partImageKeyFront: qualityIssueConfig.partImageKeyFront ?? undefined,
      partImageKeyBack: qualityIssueConfig.partImageKeyBack ?? undefined,
      hasQualityIssueConfig: convertBooleanToBool(!!qualityIssueConfig)
    }
  }
})

interface QueryInput extends Omit<DateTimeRange<string>, 'downtime'> {
  unitId: string
}

const Schema = parse<QueryInput>().with({
  unitId: NonEmptyString,
  dateTimeStartUTC: NonEmptyString,
  dateTimeEndUTC: NonEmptyString
})

export const fetchScheduleSlots = async (input: Partial<QueryInput>) => {
  const { unitId, dateTimeStartUTC, dateTimeEndUTC } = Schema.parse(input)

  const items = await scan<BaseScheduleSlot, ScheduleSlotsByUnitAndDateTimeQueryVariables>(
    scheduleSlotsByUnitAndDateTime,
    {
      unitId,
      dateTimeStartUTC: { between: [dateTimeStartUTC, dateTimeEndUTC] },
      sortDirection: ModelSortDirection.DESC
    }
  )

  return pipe(
    items,
    (slots) => slots.map((_) => ScheduleSlotSchema.parse(_)),
    (slots) => slots.filter((_) => _.shift === slots[0]?.shift),
    (slots) => sortBy(slots, (_) => new Date(_.dateTimeStart).getTime()),
    (slots) => slots.map((_, index): ExtendedScheduleSlot => ({ ..._, i: index }))
  )
}

interface UseQueryScheduleSlotsProps {
  shouldReadPreviousShift?: boolean
}

const useQueryScheduleSlots = ({ shouldReadPreviousShift = false }: UseQueryScheduleSlotsProps = {}) => {
  const { unitSelected, shiftTimeRange, isSorting } = useIProcessState()
  const { dateTimeStartUTC, dateTimeEndUTC } = getTimeRange({ hours: 72, shiftTimeRange, shouldReadPreviousShift })

  const input: Partial<QueryInput> = {
    unitId: unitSelected?.id,
    dateTimeStartUTC,
    dateTimeEndUTC
  }

  return useQuery({
    queryKey: ['FetchCalculationPerScheduleSlot', input],
    queryFn: () => fetchScheduleSlots(input),
    enabled: !isSorting && Schema.safeParse(input).success,
    initialData: [],
    meta: {
      input,
      errorMessage: '[fetchActualCountByUnitAndDateTimeStartUTCPerShift]: error fetching calculated shift target'
    }
  })
}

export default useQueryScheduleSlots
