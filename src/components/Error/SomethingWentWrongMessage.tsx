import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'

const SomethingWentWrongMessage = ({ isError }: { isError: boolean }) => {
  const { t } = useTranslation()
  return isError ? <Typography variant='subtitle2'>{t('error.somethingWentWrong')}</Typography> : <></>
}

export default SomethingWentWrongMessage
