import moment from 'moment'
import { isAssemblyLine } from 'types'
import { Type, UnitType } from 'API'
import {
  ExtendedProduct,
  ExtendedScheduleHour,
  ExtendedUnit,
  Shift,
  ShiftTimeRange,
  UnitConfiguration
} from 'contexts/iProcessContext'
import {
  formLocalTimeFormat,
  globalLocalDateTimeFormat,
  localDateTimeFormatTimePicker,
  localTimeFormat
} from 'helper/time'
import { DefaultItem } from 'lib/form/SelectDropDown'
import { definedArray } from 'shared/types'

enum SpeedModeCycleTime {
  'productionUnit' = 'speedMode',
  'assemblyLine' = 'cycleTime'
}

export const getSpeedModeCycleTime = (unitType: UnitType) => {
  return SpeedModeCycleTime[unitType]
}

export interface ConfigurationUnit {
  shiftModel?: string
  part?: string
  validFrom: string
  validUntil: string
  speedMode?: string
  cycleTime?: string
  output?: string
  hasSameConfigurationItemsAsPrevious?: boolean
  isOutOfTimeRange?: boolean
  isSameTime?: boolean
}

export const mapConfigurations = (
  unitConfigurations: UnitConfiguration[],
  unitSelected: ExtendedUnit | undefined,
  partList: ExtendedProduct[] | undefined,
  defaultItem: DefaultItem
): ConfigurationUnit[] => {
  return unitConfigurations.map((configuration) => {
    const partName = partList?.find((part) => part.id === configuration.partId)?.name
    const partNumber = partList?.find((part) => part.id === configuration.partId)?.partNumber
    const speedModeSelected = unitSelected?.speedModeCollection?.find(
      (speedMode) => configuration?.speedMode === speedMode.value
    )
    const outputValue = configuration.shiftTarget
    const existingValuesFromConfiguration = {
      part: `${partNumber} (${partName})`,
      shiftModel: unitSelected?.shiftModels?.find((shiftModel) => shiftModel.id === configuration.shiftModelId)?.name,
      validFrom: moment(configuration.validFrom).format('HH:mm'),
      validUntil: moment(configuration.validUntil).format('HH:mm')
    }
    if (isAssemblyLine(unitSelected)) {
      return {
        ...existingValuesFromConfiguration,
        cycleTime: speedModeSelected?.name ?? defaultItem.name,
        output: outputValue.toString()
      }
    } else {
      return {
        ...existingValuesFromConfiguration,
        speedMode: speedModeSelected?.name ?? defaultItem.name
      }
    }
  })
}

interface WithScheduleHours {
  scheduleHours: Pick<ExtendedScheduleHour, 'type' | 'shiftType'>[]
}

export const isActiveShift = <I extends WithScheduleHours>(
  shiftModel: I | undefined,
  shiftType: string | undefined
) => {
  if (!shiftModel || shiftModel.scheduleHours.length === 0) {
    return false
  }
  return !definedArray(shiftModel?.scheduleHours).some((_) => _.type === Type.Inactive && _.shiftType === shiftType)
}

export const isOutOfTimeRange = (
  configuration: ConfigurationUnit,
  shiftTimeRange: Partial<ShiftTimeRange> | undefined,
  shift: Shift
) => {
  const validUntil = moment(configuration.validUntil, formLocalTimeFormat)
  const validFrom = moment(configuration.validFrom, formLocalTimeFormat).add(1, 'minute')
  const endTime = moment(shiftTimeRange?.endTime, localTimeFormat)
  const startTime = moment(shiftTimeRange?.startTime, localTimeFormat)

  if (shift === Shift.nightShift) {
    const dateTimeEnd = moment(shiftTimeRange?.dateTimeEnd, globalLocalDateTimeFormat)
    const startDate = shiftTimeRange?.dateTimeStart?.split('T')[0]
    const endDate = shiftTimeRange?.dateTimeEnd?.split('T')[0]
    const midNight = moment('23:59', formLocalTimeFormat)
    const validFromIsBeforeMidNight = validFrom.isBetween(startTime, midNight, undefined, '[]')
    const validUntilIsBeforeMidNight = validUntil.isBetween(startTime, midNight, undefined, '[]')
    const validFromDateTime = moment(
      `${validFromIsBeforeMidNight ? startDate : endDate}T${configuration.validFrom}`,
      localDateTimeFormatTimePicker
    )
    const validUntilDateTime = moment(
      `${validUntilIsBeforeMidNight ? startDate : endDate}T${configuration.validUntil}`,
      localDateTimeFormatTimePicker
    )

    return !validUntilDateTime.isBetween(validFromDateTime, dateTimeEnd, undefined, '[]')
  }
  return !validUntil.isBetween(validFrom, endTime, undefined, '[]')
}
