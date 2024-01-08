import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { QUERY_PARAMS, ROUTER } from 'routes/routing'
import { assertNever } from 'helper/assertNever'

type App = 'admin' | 'measures'

const useDialogHandler = (app?: App) => {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const [open, setOpen] = useState<boolean>(false)
  const handleClickOpen = (): void => setOpen(true)
  const handleClose = (): void => {
    setOpen(false)
    if (app) {
      switch (app) {
        case 'measures':
          navigate(ROUTER.MEASURES)
          break
        case 'admin':
          params.set(QUERY_PARAMS.closed, 'true')
          setParams(params)
          break

        default:
          assertNever(app)
          break
      }
    }
  }

  return { open, handleClickOpen, handleClose }
}

export default useDialogHandler
