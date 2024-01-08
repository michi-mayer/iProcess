import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Grid } from '@mui/material'
import { ExtendedProductWithUnits } from 'APIcustom'
import { z, ZodIssueCode } from 'zod'
import { TargetCycleTimeInputSchema, UnitBasicInfoSchema } from 'zodSchemas'
import { Bool, UnitType } from 'API'
import { ExtendedUnit, QualityIssueConfig } from 'contexts/iProcessContext'
import ProductInfoForm from 'lib/form/ProductInfoForm'
import QualityIssueForm from 'lib/form/QualityIssueForm'
import { NonEmptyString, parse } from 'shared'

export interface ProductDialogForm extends ExtendedProductWithUnits {
  name: string
  partNumber: string
}

type ProductInfoForm = Omit<
  ProductDialogForm,
  keyof Omit<QualityIssueConfig, 'hasQualityIssueConfig'> | 'units' | 'productUnit'
>

export const ProductInfoFormSchema = parse<ProductInfoForm>()
  .with({
    id: NonEmptyString.optional(),
    name: NonEmptyString,
    partNumber: NonEmptyString,
    createdAt: NonEmptyString.optional(),
    selectedSubDepartments: z.array(NonEmptyString).optional(),
    unitsConfig: z.array(TargetCycleTimeInputSchema).optional(),
    qualityIssueConfig: NonEmptyString.nullish(),
    selectedUnits: z.array(UnitBasicInfoSchema).min(1),
    hasQualityIssueConfig: z.nativeEnum(Bool).optional()
  })
  .superRefine(({ selectedUnits, unitsConfig }, context) => {
    const unitType = selectedUnits?.[0]?.type

    if (unitType === UnitType.productionUnit) {
      if (unitsConfig?.length === 0) {
        context.addIssue({
          code: ZodIssueCode.too_small,
          minimum: selectedUnits.length,
          type: 'array',
          inclusive: true,
          exact: true,
          message: `Please set the target cycle time value for all selected units`,
          path: ['unitsConfig[*].targetCycleTime']
        })
      }

      if (unitsConfig?.some((_) => _.targetCycleTime === 0)) {
        context.addIssue({
          code: ZodIssueCode.too_small,
          minimum: 1,
          type: 'number',
          inclusive: true,
          message: `Please set the target cycle time value higher than 0 for all selected units`,
          path: ['unitsConfig[*].targetCycleTime']
        })
      }
    }
  })

const initialState: Partial<ExtendedProductWithUnits> = {
  partNumber: '',
  name: '',
  selectedUnits: [],
  unitsConfig: []
}

interface ProductsDialogProps {
  product: ExtendedProductWithUnits
  unitsFromProducts: ExtendedUnit[]
  onClose: () => void
}

const ProductDialog = ({ product: { units, ...product }, unitsFromProducts, onClose }: ProductsDialogProps) => {
  const [showBasicInfoForm, setShowBasicInfoForm] = useState(true)

  const methods = useForm<ProductDialogForm>({
    resolver: zodResolver(ProductInfoFormSchema),
    defaultValues: { ...initialState, ...product }
  })

  return (
    <Grid container>
      <FormProvider {...methods}>
        {showBasicInfoForm ? (
          <ProductInfoForm
            alreadySelectedUnits={units}
            unitsFromProducts={unitsFromProducts}
            onClickNextButton={() => setShowBasicInfoForm(false)}
            onClose={onClose}
          />
        ) : (
          <QualityIssueForm product={product} onClickBackButton={() => setShowBasicInfoForm(true)} onClose={onClose} />
        )}
      </FormProvider>
    </Grid>
  )
}

export default ProductDialog
