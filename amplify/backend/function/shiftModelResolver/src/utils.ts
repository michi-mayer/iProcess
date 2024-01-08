import { AppError } from 'iprocess-shared'

import { getShiftModelItem } from './mapper.js'

export const checkShiftModelExists = async (id: string) => {
  const response = await getShiftModelItem(id)

  if (response) {
    return response
  } else {
    throw new AppError(`ShiftModel with ID ${id} doesn't exist!`)
  }
}
