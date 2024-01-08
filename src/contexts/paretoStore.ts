import { MustCalculateDisruptionKPIsInput } from 'APIcustom'
import { DATE_FORMAT } from 'shared'
import { dayjs } from 'shared/datetime'
import createStore from './createStore'

const getInitialState = (now = dayjs()): Readonly<MustCalculateDisruptionKPIsInput> => ({
  startDate: now.subtract(1, 'weeks').format(DATE_FORMAT),
  endDate: now.format(DATE_FORMAT),
  unitIds: [],
  shifts: [],
  disruptionCategories: [],
  disruptionDescriptions: [],
  disruptionTypes: []
})

const { Provider: ParetoProvider, useStore } = createStore({ initialState: getInitialState(), useURLParams: true })

export const useStorePareto = useStore
export default ParetoProvider
