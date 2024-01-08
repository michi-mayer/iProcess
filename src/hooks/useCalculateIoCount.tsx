import { useEffect, useState } from 'react'
import { ExtendedProduct, ExtendedUnit } from '../contexts/iProcessContext'

interface useCalculateIoCountProps {
  actualCount: number | undefined
  rejectedCount: number | undefined
  partSelected: ExtendedProduct
  unitSelected: ExtendedUnit
  selectedShiftTab: number
  startDateTime: string
}

const useCalculateIoCount = ({
  rejectedCount,
  actualCount,
  partSelected,
  unitSelected,
  selectedShiftTab,
  startDateTime
}: useCalculateIoCountProps) => {
  const [ioCount, setIoCount] = useState<number | undefined>()
  useEffect(() => {
    console.debug('[useCalculateIoCount]', {
      ioCount,
      rejectedCount,
      actualCount,
      startDateTime
    })
    if (actualCount && actualCount >= 0 && rejectedCount && rejectedCount >= 0) {
      setIoCount(actualCount - rejectedCount)
    } else {
      setIoCount(actualCount ?? 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rejectedCount, actualCount, partSelected, unitSelected, selectedShiftTab, startDateTime])

  return { ioCount, startDateTime }
}

export default useCalculateIoCount
