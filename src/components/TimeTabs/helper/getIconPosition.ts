import { Type } from 'API'
import { ExtendedScheduleSlot } from 'contexts/iProcessContext'
import { getTypeOccurrenceFromSchedule } from 'helper/getTypeOccurrenceFromSchedule'

interface getIconPositionProps {
  currentShiftScheduleSlots: ExtendedScheduleSlot[] | undefined
  scheduleIndex: number
}

export const getIconPosition = ({ currentShiftScheduleSlots, scheduleIndex }: getIconPositionProps) => {
  if (currentShiftScheduleSlots) {
    const productionTypeOccurrence = getTypeOccurrenceFromSchedule(currentShiftScheduleSlots, Type.Production)
    const pauseTypeOccurrence = getTypeOccurrenceFromSchedule(currentShiftScheduleSlots, Type.Pause)
    const sizeOfBox = 100 / productionTypeOccurrence
    let iconPausePosition = sizeOfBox * scheduleIndex
    let count: number = 0

    if (pauseTypeOccurrence === 1) {
      return iconPausePosition
    } else {
      if (currentShiftScheduleSlots)
        for (const indexString in currentShiftScheduleSlots) {
          const index = Number.parseInt(indexString)
          const scheduleHour = currentShiftScheduleSlots[index]
          if (scheduleHour?.type === Type.Pause) {
            count += 1

            // TODO: solve this one algorithmically with a for loop
            if (index === scheduleIndex) {
              if (count === 1) {
                iconPausePosition = sizeOfBox * scheduleIndex
              }
              if (count === 2) {
                iconPausePosition = sizeOfBox * (scheduleIndex - 1)
              }
              if (count === 3) {
                iconPausePosition = sizeOfBox * (scheduleIndex - 2)
              }
              if (count === 4) {
                iconPausePosition = sizeOfBox * (scheduleIndex - 3)
              }
              if (count === 5) {
                iconPausePosition = sizeOfBox * (scheduleIndex - 4)
              }
            }
          }
        }
      return iconPausePosition
    }
  }
}
