import { M100RangeInput, Type } from 'API'
import { ExtendedScheduleSlot } from 'contexts/iProcessContext'
import {
  calculateActualCount,
  findNextProductionSlot,
  findPreviousProductionSlot,
  isBetweenRange
} from 'helper/actualCount'
import { VehicleNumber } from '../DisruptionTabs'
import { QuantitiesTable } from './ProductionUnitQuantitiesTab'

type AssemblyQuantitiesTable = Omit<QuantitiesTable, 'reject' | 'io'> // Omit io because here we are using the currentVehicleNumber and previousVehicleNumber

const getLastProductionSlotFromPreviousShiftScheduleSlots = (scheduleSlots: ExtendedScheduleSlot[] | undefined) => {
  const productionScheduleSlots = scheduleSlots?.filter((slot) => slot.type === Type.Production)
  return productionScheduleSlots?.slice(-1)?.[0]
}

interface GetQuantitiesValuesProps {
  currentShiftScheduleSlots: ExtendedScheduleSlot[] | undefined
  previousShiftScheduleSlots: ExtendedScheduleSlot[] | undefined
  selectedShiftTab: number
  vehicleNumberState: VehicleNumber
  maxRange: number
  minRange: number
}

export const getQuantitiesValues = ({
  currentShiftScheduleSlots,
  previousShiftScheduleSlots,
  selectedShiftTab,
  vehicleNumberState,
  maxRange,
  minRange
}: GetQuantitiesValuesProps) => {
  const currentScheduleSlot = currentShiftScheduleSlots?.[selectedShiftTab]
  const nextScheduleSlot = findNextProductionSlot(currentShiftScheduleSlots, selectedShiftTab)
  let previousScheduleSlot = findPreviousProductionSlot(currentShiftScheduleSlots, selectedShiftTab)

  const nextScheduleSlotId = nextScheduleSlot?.id
  const nextVehicleNumber = nextScheduleSlot?.vehicleNumber?.until || undefined
  const currentScheduleSlotId = currentScheduleSlot?.id
  let lastVehicleNumberFromPreviousScheduleSlot: number | undefined

  const lastProductionSlotFromPreviousShiftScheduleSlots =
    getLastProductionSlotFromPreviousShiftScheduleSlots(previousShiftScheduleSlots)

  const firstTabId = currentShiftScheduleSlots?.[0]?.id

  switch (true) {
    case selectedShiftTab === 0:
      previousScheduleSlot = lastProductionSlotFromPreviousShiftScheduleSlots
      lastVehicleNumberFromPreviousScheduleSlot =
        lastProductionSlotFromPreviousShiftScheduleSlots?.vehicleNumber?.until || undefined
      break
    case selectedShiftTab === 1:
      lastVehicleNumberFromPreviousScheduleSlot =
        previousScheduleSlot?.vehicleNumber?.from ||
        lastProductionSlotFromPreviousShiftScheduleSlots?.vehicleNumber?.until ||
        undefined
      break
    case selectedShiftTab === 2 && currentShiftScheduleSlots && currentShiftScheduleSlots[1]?.type === Type.Pause: {
      if (previousScheduleSlot?.id === firstTabId) {
        lastVehicleNumberFromPreviousScheduleSlot =
          previousScheduleSlot?.vehicleNumber?.from ||
          lastProductionSlotFromPreviousShiftScheduleSlots?.vehicleNumber?.until ||
          undefined
      } else {
        lastVehicleNumberFromPreviousScheduleSlot =
          lastProductionSlotFromPreviousShiftScheduleSlots?.vehicleNumber?.until || undefined
      }
      break
    }

    case selectedShiftTab === 2: {
      previousScheduleSlot = findPreviousProductionSlot(currentShiftScheduleSlots, selectedShiftTab)
      lastVehicleNumberFromPreviousScheduleSlot =
        findPreviousProductionSlot(currentShiftScheduleSlots, selectedShiftTab, true)?.vehicleNumber?.until || undefined
      break
    }
    case selectedShiftTab >= 3: {
      // previousScheduleSlot is looking at the previous Production selected tab
      previousScheduleSlot = findPreviousProductionSlot(currentShiftScheduleSlots, selectedShiftTab)
      // lastVehicleNumberFromPreviousScheduleSlot is looking at the second previous Production selected tab
      lastVehicleNumberFromPreviousScheduleSlot =
        findPreviousProductionSlot(currentShiftScheduleSlots, selectedShiftTab, true)?.vehicleNumber?.until || undefined
      break
    }
  }

  const previousScheduleSlotId = previousScheduleSlot?.id

  const vehicleNumber: VehicleNumber = {
    from: currentScheduleSlot?.vehicleNumber?.from || previousScheduleSlot?.vehicleNumber?.until || undefined,
    until: currentScheduleSlot?.vehicleNumber?.until || undefined
  }

  const isVehicleNumberUntilUpdated = vehicleNumber.until === vehicleNumberState.until
  const isVehicleNumberFromUpdated = vehicleNumber.from === vehicleNumberState.from
  const quota = currentScheduleSlot?.quota ?? 0

  const actualCount = calculateActualCount({
    from: vehicleNumberState.from,
    until: vehicleNumberState.until,
    minRange,
    maxRange
  })

  const actualCountPreviousScheduleSlot = calculateActualCount({
    from: lastVehicleNumberFromPreviousScheduleSlot,
    until: vehicleNumberState.from,
    minRange,
    maxRange
  })

  const actualCountNextScheduleSlot = calculateActualCount({
    from: vehicleNumberState.until,
    until: nextVehicleNumber,
    minRange,
    maxRange
  })

  const quantities: AssemblyQuantitiesTable = {
    partId: currentScheduleSlot?.part?.id,
    product: `${currentScheduleSlot?.part?.name} (${currentScheduleSlot?.part?.partNumber})`,
    quota,
    actualCount,
    delta: (actualCount ?? 0) - quota
  }

  return {
    currentScheduleSlotId,
    previousScheduleSlotId,
    nextScheduleSlotId,
    quantities,
    vehicleNumber,
    nextVehicleNumber,
    isVehicleNumberFromUpdated,
    isVehicleNumberUntilUpdated,
    actualCountPreviousScheduleSlot,
    actualCountNextScheduleSlot
  }
}

interface ValidateM100 {
  vehicleNumber: VehicleNumber
  isFromBetweenRange: boolean
  isUntilBetweenRange: boolean
}

export const validateM100 = (
  vehicleNumber: VehicleNumber,
  m100Range: M100RangeInput | undefined,
  callBack: ({ vehicleNumber, isFromBetweenRange, isUntilBetweenRange }: ValidateM100) => void
) => {
  const { from, until } = vehicleNumber
  if (from && until) {
    const fromIsBetweenRange = isBetweenRange(from, m100Range?.min, m100Range?.max)
    const untilIsBetweenRange = isBetweenRange(until, m100Range?.min, m100Range?.max)
    callBack({ isFromBetweenRange: fromIsBetweenRange, isUntilBetweenRange: untilIsBetweenRange, vehicleNumber })
  } else if (until) {
    const vehicleNumberIsBetweenRange = isBetweenRange(until, m100Range?.min, m100Range?.max)
    callBack({ isFromBetweenRange: true, isUntilBetweenRange: vehicleNumberIsBetweenRange, vehicleNumber })
  } else if (from) {
    const vehicleNumberIsBetweenRange = isBetweenRange(from, m100Range?.min, m100Range?.max)
    callBack({ isFromBetweenRange: vehicleNumberIsBetweenRange, isUntilBetweenRange: true, vehicleNumber })
  }
}
