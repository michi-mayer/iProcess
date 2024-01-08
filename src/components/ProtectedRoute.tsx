import { PropsWithChildren } from 'react'
import { Navigate, Outlet } from 'react-router'
import { Route, ROUTER } from 'routes/routing'
import { Role } from 'types'
import { useAuth } from 'contexts/authContext'

interface Props extends PropsWithChildren {
  allowedRole: Role | undefined
  redirectTo?: Route
}

const ProtectedRoute = ({ children, redirectTo = ROUTER.LANDING, allowedRole }: Props) => {
  const user = useAuth()
  const isAllowed = allowedRole && user.authInfo?.roles.includes(allowedRole)

  if (user.authInfo && !isAllowed) {
    return <Navigate to={redirectTo} replace />
  }
  return <>{children || <Outlet />}</>
}

export default ProtectedRoute
