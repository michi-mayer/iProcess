import { AppError, defined } from 'iprocess-shared'

import { getMeasureReportItem } from './mapper.js'

export const checkMeasureReportExists = async (id: string) => {
  const response = await getMeasureReportItem(id)

  return defined(response, () => {
    throw new AppError(`Product with ID ${id} doesn't exist!`)
  })
}
