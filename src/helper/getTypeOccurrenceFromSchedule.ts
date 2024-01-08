import { Type } from '../API'

export const getTypeOccurrenceFromSchedule = <T extends { type?: Type | null }>(array: T[], value: Type) => {
  // Get how many times a type (Pause or Production) is within the array of schedules
  let count = 0
  if (array) for (const item of array) item?.type === value && count++
  return count
}
