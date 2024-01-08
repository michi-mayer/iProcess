import { NIL } from 'uuid'
import { ExtendedUnit } from 'contexts/iProcessContext'

export const isUnitConnectedToMachine = (unit: ExtendedUnit) => unit.machineId !== NIL
