import { useQuery } from '@tanstack/react-query'
import type { GetQuickSightURLQuery, GetQuickSightURLQueryVariables } from 'API'
import { getQuickSightURL } from 'graphql/queries'
import { call } from 'services/client'
import { defined, NonEmptyString, parse } from 'shared'

interface Input {
  dashboardId: string
}

const Schema = parse<Input>().with({
  dashboardId: NonEmptyString
})

const fetchQuickSightURL = async (input: Partial<Input>): Promise<string> => {
  const { dashboardId } = Schema.parse(input)

  const response = await call<GetQuickSightURLQuery, GetQuickSightURLQueryVariables>(getQuickSightURL, {
    input: {
      initialDashboardId: dashboardId
    }
  })

  return defined(response?.data?.getQuickSightURL)
}

interface UseQueryGetQuickSightURLProps {
  dashboardId: string | undefined
}

const useQueryGetQuickSightUrl = ({ dashboardId }: UseQueryGetQuickSightURLProps) => {
  return useQuery({
    queryKey: ['FetchQuickSightURL', dashboardId],
    queryFn: () => fetchQuickSightURL({ dashboardId }),
    enabled: Schema.safeParse({ dashboardId }).success,
    refetchOnWindowFocus: false
  })
}

export default useQueryGetQuickSightUrl
