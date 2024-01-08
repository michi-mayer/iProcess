import { useQuery } from '@tanstack/react-query'
import { sortBy } from 'remeda'
import { z } from 'zod'
import { IssueSchema } from 'zodSchemas'
import { GetIssuesByIdQuery, GetIssuesByIdQueryVariables, IssueInput } from 'API'
import { getIssuesById } from 'graphql/queriesCustom'
import { call } from 'services/client'
import { NonEmptyString } from 'shared'

const fetchIssues = async (data: string | undefined) => {
  const id = NonEmptyString.parse(data)
  const response = await call<GetIssuesByIdQuery, GetIssuesByIdQueryVariables>(getIssuesById, { id })
  const parsedData = z.array(IssueSchema).safeParse(response.data?.getDisruption?.issues || [])
  if (parsedData.success) {
    return sortBy(parsedData.data, (_) => _.index)
  }
  console.error(parsedData.error, response.data?.getDisruption?.issues)
  return sortBy(response.data?.getDisruption?.issues || [], (_) => _.index) as IssueInput[]
}

const useQueryIssues = (id: string | undefined) => {
  const parsedId = NonEmptyString.safeParse(id)
  return useQuery({
    queryKey: ['FetchIssues', { id }],
    queryFn: () => fetchIssues(id),
    enabled: parsedId.success,
    initialData: []
  })
}

export default useQueryIssues
