import { definedArray } from "iprocess-shared"

import { deletePartUnitItem, deleteProductItem } from "../mapper.js"
import { checkProductExists } from "../utils.js"
import { DeleteEvent } from "../types.js"

export const deleteProduct = async ({ delete: { id } }: DeleteEvent) => {
  const product = await checkProductExists(id)

  const partUnitItems = definedArray(product.units?.items)

  await Promise.all(partUnitItems.map(async ({ id }) => await deletePartUnitItem({ id })))
  await deleteProductItem({ id })

  return id
}
