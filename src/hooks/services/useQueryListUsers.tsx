import { useQuery } from '@tanstack/react-query'
import { uniq } from 'remeda'
import { ListCognitoUsersQuery, ListCognitoUsersQueryVariables } from 'API'
import { listCognitoUsers } from 'graphql/queries'
import { call } from 'services/client'
import { CognitoAttributes, OutputEventItem } from 'shared/types'

export const getSubDepartments = (userAttributes: OutputEventItem[]) => {
  const resultValues: string[] = []

  for (const attribute of userAttributes) {
    if (attribute['custom:subdepartment']) {
      resultValues.push(attribute['custom:subdepartment'])
    }
  }

  return uniq(resultValues)
}

const fetchUsers = async (attributes: CognitoAttributes[]) => {
  const response = await call<ListCognitoUsersQuery, ListCognitoUsersQueryVariables>(listCognitoUsers, {
    input: {
      attributes
    }
  })

  const items = JSON.parse(response?.data?.listCognitoUsers ?? '[]') as OutputEventItem[]
  return getSubDepartments(items)
}

export type UseQueryListUsersReturn = Awaited<ReturnType<typeof fetchUsers>>

const useQueryListUsers = (attributes: CognitoAttributes[]) => {
  return useQuery({
    queryKey: ['FetchUsers', attributes],
    queryFn: () => fetchUsers(attributes),
    initialData: []
  })
}

export default useQueryListUsers
