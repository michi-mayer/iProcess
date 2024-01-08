import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

/**
 *
 * @deprecated This is used only in the Admin app together with useLegacyForm hook which is also deprecated
 */
const useClearState = (callback?: () => void) => {
  const navigate = useNavigate()
  const [parameter] = useSearchParams()

  useEffect(() => {
    setTimeout(() => {
      callback?.()
    }, 200)
    parameter.delete('closed')
    setTimeout(() => {
      navigate({
        search: parameter.toString()
      })
    }, 50)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, parameter])
}

export default useClearState
