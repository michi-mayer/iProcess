import { useEffect } from 'react'
import { useIProcessDispatch, useIProcessState } from 'contexts/iProcessContext'

// * Requires that 'useConfigurator' is declared before
const useCurrentConfiguration = () => {
  const { currentShiftScheduleSlots, selectedShiftTab } = useIProcessState()
  const dispatch = useIProcessDispatch()

  useEffect(() => {
    const currentScheduleSlot = currentShiftScheduleSlots?.[selectedShiftTab]
    const productSelected = currentScheduleSlot?.partByScheduleSlot
    const shiftModelSelected = currentScheduleSlot?.shiftModel

    dispatch({ type: 'productSelected', productSelected: productSelected ?? {} })
    dispatch({ type: 'shiftModelSelected', shiftModelSelected })

    if (shiftModelSelected) {
      dispatch({ type: 'timeZone', timeZone: shiftModelSelected.timeZone })
    }
  }, [currentShiftScheduleSlots, selectedShiftTab]) // eslint-disable-line react-hooks/exhaustive-deps
}

export default useCurrentConfiguration
