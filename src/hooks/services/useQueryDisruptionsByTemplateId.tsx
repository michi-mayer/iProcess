import { useQuery } from '@tanstack/react-query'
import { Get } from 'type-fest'
import { z } from 'zod'
import { Bool, DisruptionsByTemplateQuery, DisruptionsByTemplateQueryVariables } from 'API'
import { useIProcessState } from 'contexts/iProcessContext'
import { disruptionsByTemplate } from 'graphql/queriesCustom'
import { previousShiftFirstHour } from 'helper/time'
import { scan } from 'services/client'
import { NonEmptyString } from 'shared'

const Schema = z.object({
  templateId: NonEmptyString,
  dateTimeStartUTC: NonEmptyString,
  dateTimeEndUTC: NonEmptyString,
  previousShiftFirstHourUTC: NonEmptyString,
  unitId: NonEmptyString,
  teamId: NonEmptyString.optional()
})

type FetchDisruptionsByTemplateIdProps = Partial<z.infer<typeof Schema>>

type DisruptionCount = NonNullable<
  Get<DisruptionsByTemplateQuery, ['disruptionByTemplateIdAndStartTimeDateUTC', 'items', '0']>
>

const fetchDisruptionsByTemplateId = async (input: FetchDisruptionsByTemplateIdProps) => {
  const { dateTimeStartUTC, dateTimeEndUTC, templateId, previousShiftFirstHourUTC, unitId, teamId } =
    Schema.parse(input)

  const response = await scan<DisruptionCount, DisruptionsByTemplateQueryVariables>(disruptionsByTemplate, {
    startTimeDateUTC: { between: [previousShiftFirstHourUTC, dateTimeEndUTC] },
    templateId,
    endTimeDateUTC: { gt: dateTimeStartUTC },
    deleted: Bool[Bool.no],
    unitId
  })

  return teamId ? response.filter((_) => _.team?.id === teamId) : response
}

interface UseQueryDisruptionsByTemplateIdProps {
  templateId: string | undefined
  filterByTeam?: boolean
}

const useQueryDisruptionsByTemplateId = ({
  templateId,
  filterByTeam = false
}: UseQueryDisruptionsByTemplateIdProps) => {
  const { timeZone, shiftTimeRange, selectedShift, currentShift, isSorting, unitSelected, selectedTeam } =
    useIProcessState()
  const dateTimeStartUTC = shiftTimeRange?.dateTimeStartUTC
  const previousShiftFirstHourUTC = previousShiftFirstHour(selectedShift, shiftTimeRange, currentShift, timeZone)
  const dateTimeEndUTC = shiftTimeRange?.dateTimeEndUTC

  const input = {
    dateTimeStartUTC,
    dateTimeEndUTC,
    templateId,
    previousShiftFirstHourUTC,
    unitId: unitSelected?.id,
    teamId: filterByTeam ? selectedTeam?.id : undefined
  }

  return useQuery({
    queryKey: ['FetchDisruptionsByTemplateId', input],
    queryFn: () => fetchDisruptionsByTemplateId(input),
    enabled: Schema.safeParse(input).success && !isSorting,
    initialData: [],
    meta: {
      input: { ...input, templateId },
      errorMessage: 'Error disruptionByTemplateIdAndStartTimeDateUTC with templateId:'
    }
  })
}

export default useQueryDisruptionsByTemplateId
