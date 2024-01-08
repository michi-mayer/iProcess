import { useTranslation } from 'react-i18next'
import { Grid, Typography } from '@mui/material'

interface Props {
  hasSameConfigurationItemsAsPreviousValidation: boolean
  isOutOfTimeRangeValidation: boolean
  isSameTime: boolean
}

const ValidationWarning = ({
  hasSameConfigurationItemsAsPreviousValidation,
  isOutOfTimeRangeValidation,
  isSameTime
}: Props) => {
  const { t } = useTranslation()
  const errorMessage = isSameTime ? t('configuration.isSameTime') : t('configuration.isOutOfTimeRangeValidation')
  const [firstErrorMessage] = errorMessage.split('.')
  return (
    <>
      {hasSameConfigurationItemsAsPreviousValidation && isOutOfTimeRangeValidation ? (
        <Grid item>
          <Typography variant='subtitle2'>
            {t('configuration.isOutOfTimeRangeAndHasSameConfigurationItemsAsPreviousValidation', {
              firstErrorMessage,
              interpolation: { escapeValue: false }
            })}
          </Typography>
        </Grid>
      ) : (
        <>
          {hasSameConfigurationItemsAsPreviousValidation && (
            <Grid item>
              <Typography variant='subtitle2'>
                {t('configuration.hasSameConfigurationItemsAsPreviousValidation')}
              </Typography>
            </Grid>
          )}

          {isOutOfTimeRangeValidation &&
            (isSameTime ? (
              <Grid item>
                <Typography variant='subtitle2'>{t('configuration.isSameTime')}</Typography>
              </Grid>
            ) : (
              <Grid item>
                <Typography variant='subtitle2'>{t('configuration.isOutOfTimeRangeValidation')}</Typography>
              </Grid>
            ))}
        </>
      )}
    </>
  )
}

export default ValidationWarning
