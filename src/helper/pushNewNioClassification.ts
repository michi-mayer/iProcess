import { v4 as uuid } from 'uuid'
import { Classification } from 'contexts/iProcessContext'

export const pushNewNioClassification = (classification: Classification[]): Classification[] => {
  let newClassificationPath: Classification[] | undefined = []
  newClassificationPath = classification
  newClassificationPath?.push({
    id: uuid(),
    value: ''
  })
  return newClassificationPath
}
