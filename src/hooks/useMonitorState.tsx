/* eslint-disable @typescript-eslint/no-explicit-any */
// __REDUX_DEVTOOLS_EXTENSION__ does not exist in the window instance but still it is needed to track the state in the redux tool
import { Dispatch, useEffect, useRef } from 'react'

const isDevelopmentEnvironment = process.env.NODE_ENV === 'development'

const useMonitorState = <TState,>(
  context: string,
  state: TState,
  dispatch: Dispatch<{ type: 'reduxDevtools'; state: TState }>
) => {
  const withDevelopmentTools = typeof window !== 'undefined' && (window as any)?.__REDUX_DEVTOOLS_EXTENSION__
  const connection = useRef(withDevelopmentTools)
  const eventFromDevtools = useRef(false)

  useEffect(() => {
    if (withDevelopmentTools && isDevelopmentEnvironment) {
      connection.current = (window as any)?.__REDUX_DEVTOOLS_EXTENSION__?.connect()

      connection.current?.subscribe((event: { type: string; state: string }) => {
        if (event.type === 'DISPATCH') {
          eventFromDevtools.current = true
          const newState = JSON.parse(event.state) as TState
          dispatch({ type: 'reduxDevtools', state: newState })
          eventFromDevtools.current = false
        }
      })
      connection.current?.init()
    }
    return () => {
      ;(window as any)?.__REDUX_DEVTOOLS_EXTENSION__?.disconnect()
    }
  }, [dispatch, withDevelopmentTools])

  useEffect(() => {
    if (!eventFromDevtools.current && isDevelopmentEnvironment) {
      connection.current?.send(context, state)
    }
  }, [context, state])
}

export default useMonitorState
