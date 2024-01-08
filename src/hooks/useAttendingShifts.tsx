import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { RenderValue } from 'types'
import { AttendingShift } from 'API'

const useAttendingShifts = () => {
  const { t } = useTranslation()

  return useMemo(
    () =>
      Object.values(AttendingShift).map((value): RenderValue<AttendingShift> => {
        const name = value.toLowerCase() as Lowercase<`${AttendingShift}`>
        return {
          id: value,
          name: t(`configuration.attendingShift.${name}`),
          value
        }
      }),
    [t]
  )
}

export default useAttendingShifts
