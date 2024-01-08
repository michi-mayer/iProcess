// Amplify
// Hooks
import { useTranslation } from 'react-i18next'
import { Auth } from '@aws-amplify/auth'
import { Button, Grid, Heading, useAuthenticator, useTheme, View } from '@aws-amplify/ui-react'
import InfoIcon from '@mui/icons-material/Info'
// MUI
import { Grid as GridMUI, Typography } from '@mui/material'
import { convertEnvironmentToBoolean } from 'helper/utils'
import VolkswagenIcon from '../components/Icons/volkswagen.svg'
import { SubmitButton } from '../lib/ui/Buttons'
// Styles
import { colors } from '../theme'

const showDeveloperLogin = convertEnvironmentToBoolean(process.env.VITE_SHOW_DEVELOPER_LOGIN)

export const Login = {
  Header() {
    return <div style={{ marginTop: '50%' }} />
  },
  SignIn: {
    Header() {
      const { tokens } = useTheme()
      const { t } = useTranslation('iProcess')
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
          className={showDeveloperLogin ? undefined : 'authenticator-header'}
        >
          {t('login.header')}
        </Heading>
      )
    },
    Footer() {
      const { toResetPassword } = useAuthenticator()
      const { t } = useTranslation('iProcess')
      return (
        <View textAlign='center'>
          <Grid
            columnGap='0.5rem'
            rowGap='0.5rem'
            templateColumns='1fr'
            templateRows={showDeveloperLogin ? '1fr 1fr 1fr' : '1fr'}
          >
            <SubmitButton
              onClick={() => Auth.federatedSignIn({ customProvider: process.env.VITE_AUTH_PROVIDER ?? '' })}
              style={{
                width: '87%',
                justifySelf: 'center',
                fontWeight: 'bolder',
                margin: showDeveloperLogin ? undefined : '1rem 0'
              }}
            >
              <img height={32} src={VolkswagenIcon} style={{ marginRight: '0.5rem' }} loading='lazy' />
              {showDeveloperLogin ? 'VW Cloud IDP' : 'Volkswagen Login über Cloud IDP'}
            </SubmitButton>
            {showDeveloperLogin ? (
              <>
                <Typography variant='caption' style={{ fontSize: '18px' }}>
                  {t('login.forgotPasswordText')}
                </Typography>
                <Button fontWeight='normal' onClick={toResetPassword} size='small' variation='link'>
                  <Typography variant='subtitle1' style={{ fontSize: '18px' }}>
                    {t('login.forgotPasswordLink')}
                  </Typography>
                </Button>
              </>
            ) : (
              <GridMUI
                container
                style={{
                  border: `1.5px solid ${colors.blue}`,
                  width: '415px',
                  margin: 'auto',
                  padding: '1rem 1rem',
                  marginBottom: '2rem'
                }}
              >
                <GridMUI container style={{ marginBottom: '0.5rem' }}>
                  <InfoIcon style={{ color: colors.blue }} />
                  <Typography variant='body1' marginLeft='0.5rem'>
                    {t('login.infoMessage')}
                  </Typography>
                  <Typography variant='body1' marginLeft='0.2rem' style={{ fontWeight: 'bold' }}>
                    {t('login.card')}:
                  </Typography>
                </GridMUI>
                <Typography variant='body2' style={{ marginLeft: '2rem', textAlign: 'left' }}>
                  {t('login.message')}
                </Typography>
              </GridMUI>
            )}
          </Grid>
        </View>
      )
    }
  },
  Footer() {
    return <div style={{ marginBottom: '50%' }} />
  }
}
