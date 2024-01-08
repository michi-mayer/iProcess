import { useCallback } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { QueryParam } from 'routes/routing'

type Action = {
  parameter: QueryParam
  value?: string
  action: 'set' | 'delete'
}

const useRouterParams = () => {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const useSearch = !!location.search
  const pathName = location?.pathname

  return useCallback(
    (actions: Action[]) => {
      let newUrl = pathName
      for (const { parameter, value, action } of actions) {
        if (useSearch) {
          params[action](parameter, value || '')
        } else {
          if (action === 'set') {
            const regex = new RegExp(`/${parameter}/[a-fA-F0-9-]+`)
            newUrl = newUrl.replace(regex, `/${parameter}/${value}`)
          }
        }
      }

      if (useSearch) {
        return setParams(params)
      }
      navigate(newUrl)
    },
    [navigate, params, pathName, setParams, useSearch]
  )
}

export default useRouterParams
