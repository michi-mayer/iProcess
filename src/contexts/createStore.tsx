import { createContext, ReactElement, ReactNode, useCallback, useContext, useRef, useSyncExternalStore } from 'react'
import { useSearchParams } from 'react-router-dom'
import { QueryParam } from 'routes/routing'

interface Props<TStore> {
  initialState: TStore
  useURLParams?: boolean
  parameterName?: QueryParam
}

type Selector<TStore, SelectorOutput> = (store: TStore) => SelectorOutput

interface ReturnStore<TStore> {
  Provider: ({ children }: { children: ReactNode }) => ReactElement
  useStore: <SelectorOutput>(
    selector: Selector<TStore, SelectorOutput>
  ) => [SelectorOutput, (value: Partial<TStore>) => void]
}

/**
 * Returns Provider and useStore where to get and initialize the state
 * @typeParam Store - Type of objects that will define the state
 * @param {TStore} initialState Initial state that you would like to initialize your Store with
 * @param {boolean} [useURLParams=false] It adds the state in the URL browser and it helps you to keep a persistent state or share the state between different users
 * @param {string} [parameterName=filter] This is used to set the search param name. By default is set to "filter", so the url would look like: https://develop.dpp-poc.de/production?filter=(values-of-your-state)
 * @returns {
 * Provider: ({ children }: { children: ReactNode }) => ReactElement,
 * useStore: <SelectorOutput>(selector: (store: Store) => SelectorOutput) => [SelectorOutput, (value: Partial<Store>) => void]
 * }
 */
export default function createStore<TStore>({
  initialState,
  useURLParams = false,
  parameterName = 'filter'
}: Props<TStore>): ReturnStore<TStore> {
  function useStoreData(): {
    get: () => TStore
    set: (value: Partial<TStore>) => void
    subscribe: (callback: () => void) => () => void
  } {
    const [searchParams, setSearchParams] = useSearchParams()
    const searchParamsResult = searchParams.get(parameterName)
    const urlState = typeof searchParamsResult === 'string' ? (JSON.parse(searchParamsResult) as TStore) : undefined
    const state = useURLParams ? urlState || initialState : initialState
    const store = useRef(state)

    const get = useCallback(() => store.current, [])

    const subscribers = useRef(new Set<() => void>())

    const set = useCallback(
      (value: Partial<TStore>) => {
        store.current = { ...store.current, ...value }
        // eslint-disable-next-line unicorn/no-array-for-each
        subscribers.current.forEach((callback) => callback())
        if (useURLParams) {
          const urlSearchParams = JSON.stringify(store.current)
          setSearchParams([[parameterName, urlSearchParams]], {
            replace: true
          })
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [useURLParams]
    )

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback)
      return () => subscribers.current.delete(callback)
    }, [])

    return {
      get,
      set,
      subscribe
    }
  }

  type UseStoreDataReturnType = ReturnType<typeof useStoreData>

  const StoreContext = createContext<UseStoreDataReturnType | undefined>(undefined)

  function Provider({ children }: { children: ReactNode }) {
    return <StoreContext.Provider value={useStoreData()}>{children}</StoreContext.Provider>
  }

  /**
   * Returns and array where the first position is your state and the second position is the setter
   * @typeParam SelectorOutput - Value you want to get from the state
   * @param {(store: TStore) => SelectorOutput} initialState Initial state that you would like to initialize your Store with
   * @returns {[SelectorOutput, (value: Partial<TStore>) => void]}
   */
  function useStore<SelectorOutput>(
    selector: Selector<TStore, SelectorOutput>
  ): [SelectorOutput, (value: Partial<TStore>) => void] {
    const store = useContext(StoreContext)
    if (!store) {
      throw new Error('useStore must be used within the Provider')
    }

    const state = useSyncExternalStore(
      store.subscribe,
      () => selector(store.get()),
      () => selector(initialState)
    )

    return [state, store.set]
  }

  return {
    Provider,
    useStore
  }
}
