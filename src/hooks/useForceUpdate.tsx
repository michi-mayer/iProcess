import { useCallback, useState } from 'react'

const useForceUpdate = () => {
  const [, setState] = useState(true)
  return useCallback(() => {
    setState((state) => !state)
  }, [])
}

export default useForceUpdate
