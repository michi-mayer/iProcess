import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid, Typography } from '@mui/material'
import useMutateDeleteConfiguration from 'hooks/services/useMutateDeleteConfiguration'
import useCloseDialog from 'hooks/useCloseDialog'
import { GroupUIDiscardButton, GroupUILayout, GroupUISubmitButton } from 'lib/ui/Buttons'

interface ResetConfigDialogProps {
  onClose: () => void | undefined
  changeDialogTitle: Dispatch<SetStateAction<boolean>>
}

const ResetConfigDialog = ({ onClose, changeDialogTitle }: ResetConfigDialogProps) => {
  const { mutate: deleteConfiguration, isSuccess, isPending } = useMutateDeleteConfiguration()
  const { t } = useTranslation()

  useCloseDialog(isSuccess, onClose)

  const handleDeleteConfiguration = () => {
    deleteConfiguration()
  }

  const handleCancelReset = () => {
    changeDialogTitle(false)
  }

  return (
    <Grid container item xs={12} paddingTop={2}>
      <Grid container item xs={12}>
        <Typography variant='body2'>{t('configuration.resetMessage')}</Typography>
      </Grid>
      <GroupUILayout>
        <GroupUIDiscardButton id='discard-button' onClick={handleCancelReset}>
          {t('buttons.cancel')}
        </GroupUIDiscardButton>
        <GroupUISubmitButton
          id='confirm-reset-configuration'
          icon={!isPending ? 'save-24' : 'icon-empty-24'}
          isLoading={isPending}
          onClick={handleDeleteConfiguration}
        >
          {t('configuration.resetConfigConfirmation')}
        </GroupUISubmitButton>
      </GroupUILayout>
    </Grid>
  )
}

export default ResetConfigDialog
