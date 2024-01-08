import { AppError, defined } from 'iprocess-shared'

import { getProductItem } from './mapper.js'

export const checkProductExists = async (id: string) => {
  const response = await getProductItem(id)

  return defined(response, () => {
    throw new AppError(`Product with ID ${id} doesn't exist!`)
  })
}
