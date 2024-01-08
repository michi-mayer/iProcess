import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import type { AmplifyUser } from '@aws-amplify/ui'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { Role } from 'types'
import { definedArray } from 'shared/types'
import { getRoles } from './utils'

export const authConfig = {
  region: process.env.VITE_AUTH_AWS_REGION,
  userPoolId: process.env.VITE_AUTH_USER_POOL_ID,
  userPoolWebClientId: process.env.VITE_AUTH_USER_POOL_WEB_CLIENT_ID,
  oauth: {
    domain: process.env.VITE_AUTH_OAUTH_DOMAIN,
    scope: ['email', 'openid', 'profile'],
    redirectSignIn: process.env.VITE_AUTH_REDIRECT,
    redirectSignOut: process.env.VITE_AUTH_REDIRECT,
    responseType: 'code'
  }
}

interface UserAttributes {
  'custom:subdepartment': string | undefined
  id: string | undefined
  email: string | undefined
  cognitoUserName: string | undefined
  name: string | undefined
  preferred_username: string | undefined
  sub: string | undefined
}

export interface AuthInfo {
  roles: Role[]
  authDate?: Date
  iatDate?: Date
  expDate?: Date
  userName?: string
  userEmail?: string
  userGroup?: string[]
  userGroupVW?: string
  userGroupsCloudIDP?: string[]
  userAttributes?: AmplifyUser['attributes'] | UserAttributes
  signOutFunction?: () => void
}

interface AuthState {
  authInfo?: AuthInfo
  signOutFunction?: () => void
}

interface Props {
  children: ReactNode
}

const AuthContext = createContext<AuthState | undefined>(undefined)

const parseEmail = (email: string) => {
  const splittedMail = email.split('@')[0]?.split('.')
  const names = splittedMail?.map((x: string) => x.replace(/\b\w/g, (c) => c.toUpperCase()))
  const joinedNames = names?.join(' ')

  return joinedNames
}

// eslint-disable-next-line unicorn/prefer-spread
const concatNames = (givenName: string, familyName: string) => givenName.concat(' ', familyName)

interface TokenPayload {
  profile?: string
  given_name?: string
  family_name?: string
  preferred_username?: string
  emails?: string
  email?: string
  'cognito:groups'?: string[]
  'custom:subdepartment'?: string
  sub?: string
  userEmail?: string
  userName?: string
}

export interface CognitoUserWithAuthInfo {
  signInUserSession?: {
    accessToken?: {
      jwtToken?: string
      payload?: {
        auth_time?: number
        iat?: number
        exp?: number
      }
    }
    idToken?: {
      payload?: TokenPayload
    }
  }
}

const getIDTokenPayload = (token: object) => (token as CognitoUserWithAuthInfo)?.signInUserSession?.idToken?.payload

const getAccessTokenPayload = (token: object) =>
  (token as CognitoUserWithAuthInfo)?.signInUserSession?.accessToken?.payload

const getPreferredUserName = (payload: TokenPayload | undefined) => {
  try {
    if (payload?.given_name && payload?.family_name) {
      return concatNames(payload.given_name, payload.family_name) as AuthInfo['userName']
    }

    if (payload?.emails) {
      return parseEmail(payload.emails) as AuthInfo['userName']
    }

    if (payload?.preferred_username) {
      return payload.preferred_username as AuthInfo['userName']
    }
  } catch (error) {
    console.warn('[getPreferredUserName] No Name Info from CloudIDP', payload, error)
  }
}

const getUserAttributes = (token?: TokenPayload): UserAttributes => {
  return {
    'custom:subdepartment': token?.['custom:subdepartment'],
    id: token?.sub,
    email: token?.userEmail,
    cognitoUserName: token?.preferred_username,
    name: token?.userName,
    preferred_username: token?.preferred_username,
    sub: token?.sub
  }
}

const parseCloudIDPGroups = (payload: TokenPayload | undefined): string[] | undefined => {
  try {
    if (payload?.profile) {
      return payload.profile
        .replace('[', '')
        .replace(']', '')
        .replace(/["']/g, '')
        .split(',') as AuthInfo['userGroupsCloudIDP']
    }
  } catch (error) {
    console.warn('[getPreferredUserName] No Name Info from CloudIDP', error)
  }
}

const handleDate = (value?: number) => (value ? new Date(value * 1000) : undefined)

export const AuthProvider = ({ children }: Props) => {
  const context = useAuthenticator(({ user }) => [user])
  const token = context.user as CognitoUserWithAuthInfo
  const [authInfo, setAuthInfo] = useState<AuthInfo | undefined>()

  useEffect(() => {
    if (context.user) {
      try {
        const authStatus = context.authStatus

        const accessToken = getAccessTokenPayload(token)
        const idToken = getIDTokenPayload(token)
        const userGroups = definedArray(idToken?.['cognito:groups'])
        const userGroupsCloudIDP = parseCloudIDPGroups(idToken)

        const authInfo: AuthInfo = {
          authDate: handleDate(accessToken?.auth_time),
          iatDate: handleDate(accessToken?.iat),
          expDate: handleDate(accessToken?.exp),
          userEmail: idToken?.email,
          // prefer given and family name > parsed email
          userName: getPreferredUserName(idToken),
          userGroup: idToken?.['cognito:groups'],
          userGroupsCloudIDP,
          roles: getRoles(userGroups, userGroupsCloudIDP),
          userAttributes: context.user.attributes ?? getUserAttributes(idToken)
        }

        setAuthInfo(authInfo)
        console.debug('[authContext]', authStatus, token, authInfo)
      } catch (error) {
        console.error('[authContext] Token No active user session', authInfo)
        console.error(error)
      }
    } else {
      setAuthInfo(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.authStatus])

  return <AuthContext.Provider value={{ authInfo }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const state = useContext(AuthContext)
  if (!state) {
    throw new Error('[authContext] useAuth must be used within a AuthContextProvider')
  }
  return state
}
