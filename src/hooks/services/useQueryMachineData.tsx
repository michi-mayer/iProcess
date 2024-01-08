import { useQuery } from '@tanstack/react-query'
import { NIL } from 'uuid'
import { GetAvailableMachinesQuery } from 'API'
import { getAvailableMachines } from 'graphql/queries'
import { call } from 'services/client'
import { definedArray } from 'shared'

const fetchAvailableMachines = async () => {
  const response = await call<GetAvailableMachinesQuery>(getAvailableMachines)
  return definedArray(response.data?.getAvailableMachines).map((_) => ({ machineId: _ }))
}

export type MachineData = Awaited<ReturnType<typeof fetchAvailableMachines>>[number]

const getAllAvailableMachines = async ({ machineId }: Partial<MachineData>) => {
  const availableMachines = await fetchAvailableMachines()
  if (machineId) {
    availableMachines.push({ machineId })
  }
  return availableMachines.filter((_) => _.machineId !== NIL) // ? Do this in the lambda
}

const useMachineData = (connectedMachine: Partial<MachineData>) => {
  return useQuery({
    queryKey: ['listAvailableMachines', connectedMachine],
    initialData: [],
    queryFn: () => getAllAvailableMachines(connectedMachine)
  })
}

export default useMachineData
