import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'

interface UseLocalStorageStateProps<TDefault> {
  key: string
  defaultValue?: TDefault
  options?: {
    serialize: JSON['stringify'] | ((value: unknown) => string)
    deserialize: JSON['parse'] | ((value: string) => unknown)
  }
}

const useLocalStorageState = <TDefault,>({
  key,
  defaultValue,
  options = { serialize: JSON.stringify, deserialize: JSON.parse }
}: UseLocalStorageStateProps<TDefault>): [TDefault, Dispatch<SetStateAction<TDefault>>] => {
  const [state, setState] = useState<TDefault>(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      // the try/catch is here in case the localStorage value was set before
      try {
        return options.deserialize(valueInLocalStorage)
      } catch {
        window.localStorage.removeItem(key)
      }
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const previousKeyRef = useRef(key)

  useEffect(() => {
    const previousKey = previousKeyRef.current
    if (previousKey !== key) {
      window.localStorage.removeItem(previousKey)
    }
    previousKeyRef.current = key
    window.localStorage.setItem(key, options.serialize(state))
  }, [key, state, options])

  return [state, setState]
}

export default useLocalStorageState
