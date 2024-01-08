import { fromEnvironment, getCurrentDateTime } from 'iprocess-shared'
import { actualCount as TimeSlot, Unit, UnitType, UpdateActualCountInput, VehicleNumber } from 'iprocess-shared/graphql/API.js'

import { ScanOperation, ScriptInfo, UpdateOperation, client, updateTableBuilder } from './base.js'
import { Nullable } from 'vitest'

const TABLE_NAME = fromEnvironment('API_ERFASSUNGSAPP_ACTUALCOUNTTABLE_NAME')
const UNIT_TABLE_NAME = fromEnvironment('API_ERFASSUNGSAPP_UNITTABLE_NAME')

const scriptInfo: ScriptInfo = {
  tableName: TABLE_NAME,
  version: 'v23.8.1-5',
  updatedAt: '2023-05-11'
}

interface LegacyTimeSlot extends TimeSlot {
  ioVehicle?: Nullable<number>
}

interface UpdateTimeSlotWithIndexesInput extends UpdateActualCountInput {
  ioVehicle?: Nullable<number>
}

const scanTimeSlots: ScanOperation<LegacyTimeSlot> = async () => await client.scan({ TableName: TABLE_NAME })

const getUnitType = async (id: string) => {
  const unit = await client.get<Unit>({ TableName: UNIT_TABLE_NAME, Key: { id } })
  return unit?.type
}

const toValidItem = ({ ...rest }: LegacyTimeSlot): UpdateTimeSlotWithIndexesInput => ({
  ...rest
})

const updateTimeSlotItem: UpdateOperation<LegacyTimeSlot> = async (slot) => {
  const { id, unitId, actualCount, ioVehicle, vehicleNumber } = toValidItem(slot)
  const unitType = unitId ? await getUnitType(unitId) : undefined

  if (unitType === UnitType.assemblyLine) {
    if (ioVehicle) {
      await client.update({ TableName: TABLE_NAME, Key: { id }, UpdateExpression: 'remove ioVehicle' })

      await client.update({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set actualCount=:actualCount',
        ExpressionAttributeValues: {
          ':actualCount': ioVehicle
        }
      })
    }

    if (actualCount) {
      await client.update({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set vehicleNumber=:vehicleNumber',
        ExpressionAttributeValues: {
          ':vehicleNumber': actualCount
        }
      })
    }

    if (!!vehicleNumber && typeof vehicleNumber === 'number') {
      const newVehicleNumber: VehicleNumber = { __typename: 'VehicleNumber', from: undefined, until: vehicleNumber }

      await client.update({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set vehicleNumber=:vehicleNumber, #updatedAt=:updatedAt',
        ExpressionAttributeNames: {
          '#updatedAt': 'updatedAt'
        },
        ExpressionAttributeValues: {
          ':vehicleNumber': newVehicleNumber,
          ':updatedAt': getCurrentDateTime({ utc: true }).toISOString()
        }
      })
    }
  }
}

export const updateTimeSlotTable = async (persistToDB: boolean) => await updateTableBuilder(scriptInfo, scanTimeSlots, (_) => updateTimeSlotItem(_, persistToDB))
