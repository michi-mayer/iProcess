import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import { Card, CardContent, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import i18n from 'i18next'
import { Application } from 'routes/routing'
import { Role } from 'types'
import ApplicationIcon from 'components/Icons/ApplicationIcon'
import { useAuth } from 'contexts/authContext'
import { fetchGroupingList } from 'hooks/services/useQueryListGrouping'
import { fetchMeasureReportsList } from 'hooks/services/useQueryListReportMeasures'
import useMediaQuery from 'hooks/useMediaQuery'
import { NextTokenProps } from 'services/client'
import { colors } from 'theme'

interface ApplicationCardProps {
  application: Application
}

interface IsAuthorizedProps extends ApplicationCardProps {
  roles: Role[]
}

const isAuthorized = ({ application, roles }: IsAuthorizedProps) => {
  if (application.existsApp) {
    return roles.includes(application.role)
  }
  return false
}

interface CardInfoProps extends ApplicationCardProps {
  isAllowed: boolean
}

const CardInfo = ({ application, isAllowed }: CardInfoProps) => {
  const { t } = useTranslation('landing')
  const [isDesktopWidth] = useMediaQuery('lg')

  const colorWhenNeedsAuth = isAllowed ? colors.blue : colors.gray3

  return (
    <Card
      variant='outlined'
      style={{
        width: isDesktopWidth ? '218px' : undefined,
        height: '250px',
        border: `1px solid ${colors.lightGray}`
      }}
    >
      <CardContent
        style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}
      >
        <div>
          <ApplicationIcon title={application.title} isAllowed={isAllowed} />
          <Typography
            id={`applications-title-${application.title}`}
            fontWeight='bold'
            color={colorWhenNeedsAuth}
            marginBottom='1rem'
            marginTop='0.5rem'
          >
            {i18n.getResource(i18n.resolvedLanguage, 'landing', `applications.${application.title}`)}
          </Typography>
          <Typography variant='body2' color={isAllowed ? colors.gray1 : colors.gray2}>
            {i18n.getResource(i18n.resolvedLanguage, 'landing', `applications.descriptions.${application.description}`)}
          </Typography>
        </div>

        <div style={{ display: 'flex' }}>
          <Typography fontWeight='bold' color={application.existsApp ? colors.blue : colors.gray3}>
            {isAllowed ? t('applications.open') : t('applications.requestAccess')}
          </Typography>
          <ArrowRightAltIcon color={application.existsApp ? 'primary' : 'secondary'} />
        </div>
      </CardContent>
    </Card>
  )
}

const ApplicationCard = ({ application }: ApplicationCardProps) => {
  const queryClient = useQueryClient()
  const { authInfo } = useAuth()
  const isAllowed = isAuthorized({ application, roles: authInfo?.roles || [] })

  const prefetchAppData = (app: Application['title']) => {
    switch (app) {
      case 'production':
        queryClient.prefetchQuery({
          queryKey: ['ListGrouping'],
          queryFn: () => fetchGroupingList()
        })

        break
      case 'measures':
        queryClient.prefetchInfiniteQuery({
          queryKey: ['ListReportMeasures'],
          queryFn: ({ pageParam }) => fetchMeasureReportsList({ nextToken: pageParam }),
          initialPageParam: undefined as NextTokenProps['nextToken']
        })
        break

      default:
        break
    }
  }
  return (
    <>
      {!isAllowed ? (
        <a
          id={`request-access-app-${application.title}`}
          href={`mailto:${process.env.VITE_ADMIN_EMAIL}`}
          target='_blank'
          rel='noreferrer'
          style={{ textDecoration: 'none', display: 'flex' }}
        >
          <CardInfo application={application} isAllowed={isAllowed} />
        </a>
      ) : (
        <Link
          id={`open-app-${application.title}`}
          to={application.path}
          onMouseOver={() => prefetchAppData(application.title)}
          style={
            application.existsApp
              ? {
                  textDecoration: 'none'
                }
              : {
                  textDecoration: 'none',
                  pointerEvents: 'none'
                }
          }
        >
          <CardInfo application={application} isAllowed={isAllowed} />
        </Link>
      )}
    </>
  )
}

export default ApplicationCard
