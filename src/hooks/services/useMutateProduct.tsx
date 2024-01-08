import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ExtendedProductWithUnits } from 'APIcustom'
import { TargetCycleTimeInputSchema } from 'zodSchemas'
import { Bool, MutateProductMutationVariables, ProductInput, UnitType } from 'API'
import { getQualityIssueConfig } from 'contexts/iProcessContext'
import { mutateProduct } from 'graphql/mutations'
import { convertBooleanToBool } from 'helper/utils'
import { call } from 'services/client'
import { arrayOf, NonEmptyString, parse } from 'shared'

const Schema = parse<ProductInput>().with({
  id: NonEmptyString.nullish(),
  name: NonEmptyString,
  number: NonEmptyString,
  qualityIssueConfig: NonEmptyString.nullish(),
  unitsConfig: arrayOf(TargetCycleTimeInputSchema)
})

const createOrUpdateProduct = async ({
  partNumber,
  hasQualityIssueConfig,
  nioClassificationDamageType,
  nioClassificationErrorSource,
  nioClassificationLocation,
  partImageKeyFront,
  partImageKeyBack,
  ...input
}: ExtendedProductWithUnits) => {
  const selectedUnitType = input.selectedUnits?.[0]?.type
  const continueToQualityIssueConfig = convertBooleanToBool(
    hasQualityIssueConfig === Bool.yes && selectedUnitType === UnitType.productionUnit
  )

  const put = Schema.parse({
    ...input,
    number: partNumber,
    qualityIssueConfig: getQualityIssueConfig({
      hasQualityIssueConfig: continueToQualityIssueConfig,
      nioClassificationDamageType,
      nioClassificationErrorSource,
      nioClassificationLocation,
      partImageKeyFront,
      partImageKeyBack
    })
  })

  return await call<unknown, MutateProductMutationVariables>(mutateProduct, { put })
}

const removeProduct = async (id: string) => {
  await call<unknown, MutateProductMutationVariables>(mutateProduct, { delete: { id } })
}

interface UseMutateProductProps {
  shouldDelete?: boolean
}

type Data = Omit<ProductInput, 'qualityIssueConfig' | 'number'> &
  Pick<ExtendedProductWithUnits, 'partNumber' | 'selectedUnits'>

const useMutateProduct = ({ shouldDelete = false }: UseMutateProductProps = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<Data> = {}) => {
      switch (true) {
        case data.id && shouldDelete:
          return await removeProduct(data.id)
        case !!data:
          return await createOrUpdateProduct(data)
        default:
          return await Promise.resolve(console.warn('Product data is not defined'))
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ListParts']
      })
    }
  })
}

export default useMutateProduct
