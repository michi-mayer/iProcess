import { Type } from 'API'
import { ExtendedScheduleSlot } from 'contexts/iProcessContext'

export const defaultMinRange = 1
export const defaultMaxRange = 999

/**
 *
 * @param value - Value you want to check
 * @param min - Min number you want to compare it with. Default number is 1
 * @param max - Max number you want to compare it with. Default number is 999
 * @returns {boolean} Boolean
 */
export const isBetweenRange = (value: number, min: number = defaultMinRange, max: number = defaultMaxRange) => {
  return value >= min && value <= max
}

interface CalculateActualCountProps {
  from: number | undefined
  until: number | undefined
  minRange: number
  maxRange: number
}

export const calculateActualCount = ({ from, until, minRange, maxRange }: CalculateActualCountProps) => {
  if (from && until && isBetweenRange(from, minRange, maxRange) && isBetweenRange(until, minRange, maxRange)) {
    switch (true) {
      case from === until:
        return 0
      case from < until:
        return until - from
      default:
        return maxRange - from + (until - minRange + 1)
    }
  } else {
    return undefined
  }
}

export type PickScheduleSlot = Pick<ExtendedScheduleSlot, 'id' | 'type'>

export const findPreviousProductionSlot = <T extends PickScheduleSlot>(
  scheduleSlots: T[] | undefined,
  selectedShiftTab: number,
  findSecond: boolean = false
) => {
  let index = selectedShiftTab - 1
  let totalProduction = 0

  if (!scheduleSlots) return

  while (index >= 0) {
    if (findSecond) {
      if (scheduleSlots[index]?.type === Type.Production) {
        totalProduction += 1
        if (totalProduction === 2) {
          return scheduleSlots[index]
        }
      }
    } else {
      if (scheduleSlots[index]?.type === Type.Production) {
        return scheduleSlots[index]
      }
    }
    index -= 1
  }
}

export const findNextProductionSlot = <T extends PickScheduleSlot>(
  scheduleSlots: T[] | undefined,
  selectedShiftTab: number
) => {
  let index = selectedShiftTab + 1
  if (scheduleSlots) {
    while (index <= scheduleSlots.length - 1) {
      if (scheduleSlots[index]?.type === Type.Production) {
        return scheduleSlots[index]
      }
      index += 1
    }
  }
}
