import { defined } from "iprocess-shared"

import { createProductItem, createPartUnitItem } from "../mapper.js"
import { CreateEvent } from "../types.js"

export const createProduct = async ({ put: { unitsConfig, number, ...product } }: CreateEvent) => {
  const partId = await createProductItem({ ...product, partNumber: number })

  await Promise.all(
    unitsConfig.map(async ({ unitId, ..._ }) => await createPartUnitItem({ ..._, partId, unitId: defined(unitId) }))
  )

  return partId
}
