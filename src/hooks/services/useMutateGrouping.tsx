import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import {
  CreateGroupingCustomMutationVariables,
  DeleteGroupingCustomMutationVariables,
  LambdaGroupingInput,
  UpdateGroupingCustomMutationVariables
} from 'API'
import { ExtendedGrouping } from 'contexts/iProcessContext'
import { createGroupingCustom, deleteGroupingCustom, updateGroupingCustom } from 'graphql/mutations'
import { EMPTY_STRING } from 'helper/constants'
import { call } from 'services/client'
import { arrayOf, NonEmptyString, parse } from 'shared'

const Schema = parse<LambdaGroupingInput>().with({
  id: z.string().optional(),
  name: NonEmptyString,
  unitsIds: arrayOf(NonEmptyString),
  subDepartmentIds: arrayOf(NonEmptyString)
})

const mutateGrouping = async (input: Partial<LambdaGroupingInput>) => {
  const put = Schema.parse(input)

  if (put.id) {
    return await call<unknown, UpdateGroupingCustomMutationVariables>(updateGroupingCustom, { put })
  }

  return await call<unknown, CreateGroupingCustomMutationVariables>(createGroupingCustom, { put })
}

const removeGrouping = async (id: string) =>
  await call<unknown, DeleteGroupingCustomMutationVariables>(deleteGroupingCustom, { delete: { id } })

interface UseMutateGroupingProps {
  shouldDelete?: boolean
}

const useMutateGrouping = ({ shouldDelete = false }: UseMutateGroupingProps = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      selectedUnits: selectedGroupingUnits,
      selectedSubDepartments,
      ...data
    }: ExtendedGrouping = {}) => {
      switch (true) {
        case data && data.id && shouldDelete:
          return await removeGrouping(data.id)
        case !!data:
          return await mutateGrouping({
            ...data,
            unitsIds: selectedGroupingUnits?.map((_) => _.id ?? EMPTY_STRING),
            subDepartmentIds: selectedSubDepartments
          })
        default:
          return await Promise.resolve(console.warn('Grouping data is not defined'))
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ListGrouping']
      })
    }
  })
}

export default useMutateGrouping
