import { Stack, Typography } from '@mui/material'
import CustomDialog from 'components/Dialogs/CustomDialog'
import SomethingWentWrongMessage from 'components/Error/SomethingWentWrongMessage'
import useCloseDialog from 'hooks/useCloseDialog'
import { GroupUIDiscardButton, GroupUILayout, GroupUISubmitButton } from 'lib/ui/Buttons'

interface Props {
  title: string
  confirmToDeleteText: string
  itemName: string | undefined
  deleteButtonText: string
  discardButtonText: string
  isLoading?: boolean
  isSuccess: boolean
  isError?: boolean
  onClickDelete: () => void
  onClickDiscard: () => void
  onCloseDialog: () => void
  openDialog: boolean
  deleteButtonId?: string
  discardButtonId?: string
}

const DeleteDialog = ({
  openDialog,
  title,
  onCloseDialog,
  isSuccess,
  isError,
  confirmToDeleteText,
  deleteButtonText,
  discardButtonText,
  isLoading,
  itemName,
  onClickDelete,
  onClickDiscard,
  deleteButtonId = 'delete-button',
  discardButtonId
}: Props) => {
  useCloseDialog(isSuccess ?? false, onCloseDialog)

  return (
    <CustomDialog open={openDialog} fullWidth={true} maxWidth='sm' onClose={onCloseDialog} title={title}>
      <Stack>
        <Typography variant='body1' style={{ marginTop: '1rem' }}>
          {confirmToDeleteText}
        </Typography>
        <Typography variant='body1'>"{itemName}"</Typography>
      </Stack>
      <SomethingWentWrongMessage isError={isError ?? false} />
      <GroupUILayout>
        <GroupUIDiscardButton id={discardButtonId} onClick={onClickDiscard}>
          {discardButtonText}
        </GroupUIDiscardButton>
        <GroupUISubmitButton
          id={deleteButtonId}
          icon={!isLoading ? 'delete-24' : 'icon-empty-24'}
          size='m'
          isLoading={isLoading}
          onClick={onClickDelete}
        >
          {deleteButtonText}
        </GroupUISubmitButton>
      </GroupUILayout>
    </CustomDialog>
  )
}

export default DeleteDialog
