import { GraphQLResult } from '@aws-amplify/api'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { ConfigurationByUnitAndValidFromQuery, ConfigurationByUnitAndValidFromQueryVariables } from 'API'
import { UnitConfiguration, useIProcessState } from 'contexts/iProcessContext'
import { configurationByUnitAndValidFrom } from 'graphql/queries'
import { getLocalDateTimeFromUtcDateTime, getTimeRange } from 'helper/time'
import { call } from 'services/client'

const mapConfigurationByUnitAndValidFrom = (
  configurationByUnitAndValidFrom: GraphQLResult<ConfigurationByUnitAndValidFromQuery>
) => {
  const shouldReadOffSet = true
  return configurationByUnitAndValidFrom.data?.configurationByUnitAndValidFrom?.items.map(
    (item) =>
      ({
        ...item,
        validFromUTC: item?.validFrom,
        validUntilUTC: item?.validUntil,
        validFrom: getLocalDateTimeFromUtcDateTime(item?.validFrom, item?.timeZone, shouldReadOffSet),
        validUntil: getLocalDateTimeFromUtcDateTime(item?.validUntil, item?.timeZone, shouldReadOffSet)
      }) as UnitConfiguration
  )
}

const Schema = z.object({
  unitId: z.string(),
  dateTimeStartUTC: z.string(),
  dateTimeEndUTC: z.string()
})

export interface UseQueryConfigurationByUnitAndValidFromProps {
  unitId: string | undefined
  dateTimeStartUTC?: string | undefined
  dateTimeEndUTC?: string | undefined
}

export const fetchConfigurationByUnitAndValidFrom = async (input: UseQueryConfigurationByUnitAndValidFromProps) => {
  const { unitId, dateTimeEndUTC, dateTimeStartUTC } = Schema.parse(input)
  const response = await call<ConfigurationByUnitAndValidFromQuery, ConfigurationByUnitAndValidFromQueryVariables>(
    configurationByUnitAndValidFrom,
    {
      unitId,
      validFrom: { between: [dateTimeStartUTC, dateTimeEndUTC] }
    }
  )

  return {
    items: mapConfigurationByUnitAndValidFrom(response),
    nextToken: response.data?.configurationByUnitAndValidFrom?.nextToken
  }
}

const useQueryConfigurationByUnitAndValidFrom = ({
  shouldReadPreviousShift = false
}: { shouldReadPreviousShift?: boolean } = {}) => {
  const { unitSelected, shiftTimeRange, isSorting } = useIProcessState()
  const timeRange = getTimeRange({ hours: 8, shiftTimeRange, shouldReadPreviousShift })
  const input: UseQueryConfigurationByUnitAndValidFromProps = { ...timeRange, unitId: unitSelected?.id }

  return useQuery({
    queryKey: ['ValidConfigurationByUnit', input],
    queryFn: () => fetchConfigurationByUnitAndValidFrom(input),
    enabled: Schema.safeParse(input).success && !isSorting,
    meta: {
      input,
      errorMessage: '[fetchConfigurationByUnitAndValidFrom]: error fetching configuration by unit'
    }
  })
}

export default useQueryConfigurationByUnitAndValidFrom
