const COUNTER_LIMIT = 999_999

export const calculateActualCount = (OverflowCounter: number, initialActualCount: number) => {
  // Most typical case
  if (OverflowCounter >= initialActualCount) {
    return OverflowCounter - initialActualCount
  }

  // Special case where OverflowCounter exceeds COUNTER_LIMIT
  return OverflowCounter + (COUNTER_LIMIT - initialActualCount)
}
