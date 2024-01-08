import { GraphQLResult } from '@aws-amplify/api'
import { useQuery } from '@tanstack/react-query'
import { sortBy } from 'remeda'
import { TeamSchema } from 'zodSchemas'
import {
  Bool,
  ShiftModel as ShiftModelAPI,
  UnitsByGroupingIdQuery,
  UnitsByGroupingIdQueryVariables,
  UnitType
} from 'API'
import {
  Classification,
  ExtendedScheduleHour,
  ExtendedShiftModel,
  ExtendedUnit,
  SpeedMode,
  useIProcessState
} from 'contexts/iProcessContext'
import { unitsByGroupingId } from 'graphql/queriesCustom'
import { defaultOptions } from 'helper/templateCategories'
import { getLocalTimeFromISOUtc } from 'helper/time'
import { defined } from 'helper/utils'
import { call } from 'services/client'
import { definedArray } from 'shared/types'

export const mapScheduleHours = (items: ExtendedScheduleHour[]) => {
  const newScheduleHours: ExtendedScheduleHour[] = items.map((_) => ({
    ..._,
    hoursEnd: getLocalTimeFromISOUtc({
      time: _?.hoursEndUTC ?? '',
      timeZone: _?.timeZone ?? '',
      isAdminApp: false,
      shouldReadOffSet: true
    }),
    hoursStart: getLocalTimeFromISOUtc({
      time: _?.hoursStartUTC ?? '',
      timeZone: _?.timeZone ?? '',
      isAdminApp: false,
      shouldReadOffSet: true
    })
  }))

  // sort schedule
  const reponseSchedule = newScheduleHours.sort(function (a, b) {
    const aIndex = a.i ?? 0
    const bIndex = b.i ?? 0

    return aIndex - bIndex
  })
  return reponseSchedule.map((scheduleHour, index) => ({
    ...scheduleHour,
    i: index
  }))
}

const mapActiveShiftModels = (items: ShiftModelAPI[]) => {
  const activeShiftModels: ExtendedShiftModel[] = []

  for (const { isActive, scheduleHours, ...rest } of items) {
    if (isActive === Bool.yes) {
      activeShiftModels.push({
        ...rest,
        isActive,
        scheduleHours: mapScheduleHours(definedArray(scheduleHours?.items))
      })
    }
  }

  return activeShiftModels
}

// Getting All Units
const mapListUnitsQuery = (listUnitsByGrouping: GraphQLResult<UnitsByGroupingIdQuery>, types: UnitType[]) => {
  const results: ExtendedUnit[] = []

  for (const unit of definedArray(listUnitsByGrouping.data?.unitsByGrouping?.items)) {
    if (!!unit.type && types.includes(unit.type)) {
      const shiftModels = definedArray(unit.shiftModels?.items?.map((_) => _?.shiftModel))
      const teams = definedArray(unit.teams?.items.map((team) => TeamSchema.parse(team)))

      results.push({
        id: unit.id,
        name: unit.name,
        type: unit.type,
        groupingId: unit.groupingId ?? undefined,
        shortName: defined('mapListUnitsQuery.shortName in useQueryUnitListByGrouping', unit.shortName),
        shiftModels: mapActiveShiftModels(shiftModels),
        unitDisruptionClassification: unit.unitProblemClassification ?? undefined,
        classificationPath: unit.unitProblemClassification?.classification
          ? (JSON.parse(unit.unitProblemClassification?.classification ?? '[]') as Classification[])
          : defaultOptions,
        speedModeCollection: unit.speedModes ? (JSON.parse(unit?.speedModes) as SpeedMode[]) : [],
        m100Range: unit.m100Range ?? undefined,
        teams: sortBy(teams, (_) => _.index),
        machineId: unit.machineId
      })
    }
  }

  return results
}

export const fetchUnitList = async (groupingId: string | null | undefined, type?: UnitType) => {
  const types = type ? [type] : [UnitType.assemblyLine, UnitType.productionUnit]
  const response = await call<UnitsByGroupingIdQuery, UnitsByGroupingIdQueryVariables>(unitsByGroupingId, {
    groupingId: defined('groupingId at useQueryUnitListByGrouping', groupingId)
  })

  // Sort units before returning
  return mapListUnitsQuery(response, types).sort(function (a, b) {
    const aShortName = a.shortName ?? '?'
    const bShortName = b.shortName ?? '?'
    return aShortName.localeCompare(bShortName)
  })
}

interface UseQueryUnitListByGroupingProps {
  type?: UnitType
}

const useQueryUnitListByGrouping = ({ type }: UseQueryUnitListByGroupingProps = {}) => {
  const { groupingSelected, isSorting } = useIProcessState()

  return useQuery({
    queryKey: ['UnitListByGrouping', { groupingId: groupingSelected?.id, type }],
    queryFn: () => fetchUnitList(groupingSelected?.id, type),
    enabled: !!groupingSelected?.id && !isSorting,
    meta: {
      errorMessage: 'Error fetching machines'
    }
  })
}

export default useQueryUnitListByGrouping
