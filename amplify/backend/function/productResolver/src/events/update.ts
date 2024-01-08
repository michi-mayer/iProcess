import log from 'loglevel'

import { definedArray, compareItems } from 'iprocess-shared'
import { TargetCycleTimeInput, CreatePartUnitInput, PartUnit, UpdatePartUnitInput } from 'iprocess-shared/graphql/API.js'

import { createPartUnitItem, updatePartUnitItem, deletePartUnitItem, updateProductItem } from '../mapper.js'
import { UpdateEvent } from '../types.js'
import { checkProductExists } from '../utils.js'


interface WithProductID {
  partId: string
}

const addCreateItem = (item: TargetCycleTimeInput, attributes: WithProductID): CreatePartUnitInput => ({
  ...item,
  ...attributes
})

const addUpdateItem = (
  item: TargetCycleTimeInput,
  attributes: WithProductID,
  { id }: PartUnit
): UpdatePartUnitInput => ({ ...item, ...attributes, id })

export const updateProduct = async ({ put: { unitsConfig, number, ...product } }: UpdateEvent) => {
  const productFromDatabase = await checkProductExists(product.id)
  
  const itemsFromDatabase = definedArray(productFromDatabase.units?.items)
  const itemsFromClient = definedArray(unitsConfig)
  const attributes = { partId: product.id }
  const { itemsToCreate, itemsToUpdate, itemsToDelete } = compareItems(
    itemsFromClient,
    itemsFromDatabase,
    attributes,
    addCreateItem,
    addUpdateItem,
    ({ unitId }, items) => items.find((_) => _.unitId === unitId),
  )

  log.debug('PartUnits to create: ', JSON.stringify(itemsToCreate))
  log.debug('PartUnits to update: ', JSON.stringify(itemsToUpdate))
  log.debug('PartUnits to delete: ', JSON.stringify(itemsToDelete))

  await Promise.all([
    ...itemsToCreate.map(createPartUnitItem),
    ...itemsToUpdate.map(updatePartUnitItem),
    ...itemsToDelete.map(deletePartUnitItem),
    updateProductItem({ ...product, partNumber: number })
  ])

  return product.id
}
