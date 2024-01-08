import { Navigate, useRouteError } from 'react-router'
import { ROUTER } from 'routes/routing'

export const ShiftModelErrorBoundary = () => {
  const error = useRouteError()
  console.error(error)
  return <Navigate to={ROUTER.ADMIN_SHIFT_MODEL_PATH} replace />
}
