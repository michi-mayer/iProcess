import { AppError, defined } from 'iprocess-shared'

import { getUnitItem } from './mapper.js'

export const checkUnitExists = async (id: string) => {
  const response = await getUnitItem(id)

  return defined(response, () => {
    throw new AppError(`Unit with ID ${id} doesn't exist!`)
  })
}
