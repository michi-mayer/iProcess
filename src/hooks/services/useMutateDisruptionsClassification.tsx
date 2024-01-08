import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DisruptionClassification, DisruptionDialogForm } from 'APIcustom'
import { z } from 'zod'
import {
  CreateUnitProblemClassificationCustomMutationVariables,
  DeleteUnitProblemClassificationCustomMutationVariables,
  UnitProblemClassificationInput,
  UpdateUnitProblemClassificationCustomMutationVariables
} from 'API'
import {
  createUnitProblemClassificationCustom,
  deleteUnitProblemClassificationCustom,
  updateUnitProblemClassificationCustom
} from 'graphql/mutations'
import { call } from 'services/client'
import { NonEmptyString, parse } from 'shared'

const Schema = parse<UnitProblemClassificationInput>().with({
  id: NonEmptyString.optional(),
  classification: NonEmptyString,
  unitsIds: z.array(NonEmptyString)
})

const createOrUpdate = async ({
  classificationPath,
  selectedUnits,
  id
}: DisruptionClassification | DisruptionDialogForm) => {
  const input = Schema.parse({
    id,
    unitsIds: selectedUnits?.map((_) => _.id),
    classification: JSON.stringify(classificationPath)
  } satisfies Record<keyof UnitProblemClassificationInput, unknown>)

  if (input.id) {
    await call<unknown, UpdateUnitProblemClassificationCustomMutationVariables>(updateUnitProblemClassificationCustom, {
      input
    })
  } else {
    await call<unknown, CreateUnitProblemClassificationCustomMutationVariables>(createUnitProblemClassificationCustom, {
      input
    })
  }
}

const remove = async (id: string) => {
  await call<unknown, DeleteUnitProblemClassificationCustomMutationVariables>(deleteUnitProblemClassificationCustom, {
    id
  })
}

interface MutateDisruptionProps {
  shouldDelete?: boolean
}

const useMutateDisruptionsClassification = ({ shouldDelete = false }: MutateDisruptionProps = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: DisruptionClassification | DisruptionDialogForm) => {
      switch (true) {
        case shouldDelete && !!data?.id:
          return await remove(data.id)
        case !!data:
          return await createOrUpdate(data)
        default:
          return await Promise.resolve(console.warn('DisruptionClassification data is not defined'))
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ListDisruptions']
      })
    },
    onError: (error, data) => console.error(error, data)
  })
}

export default useMutateDisruptionsClassification
