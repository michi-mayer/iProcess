import { useTranslation } from 'react-i18next'
import { Disruption } from 'types'
import DeleteDialog from 'components/Dialogs/DeleteDialog'
import useMutateDeleteDisruption from 'hooks/services/useMutateDeleteDisruption'

interface ReportedDisruptionsDeleteDialog {
  open: boolean
  handleClose: () => void
  disruptionSelected: Disruption | undefined
}

const ReportedDisruptionsDeleteDialog = ({
  open,
  handleClose,
  disruptionSelected
}: ReportedDisruptionsDeleteDialog) => {
  const { t } = useTranslation('admin')
  const { mutate: deleteDisruption, isSuccess } = useMutateDeleteDisruption('FetchDisruptionsByTime')

  const deleteItem = () => {
    if (disruptionSelected) {
      deleteDisruption(disruptionSelected)
    }
  }

  return (
    <DeleteDialog
      title={t('deleteDialog.deleteItemTitle')}
      openDialog={open}
      itemName={disruptionSelected?.description}
      deleteButtonText={t('deleteDialog.deleteButton')}
      discardButtonText={t('deleteDialog.discardDeleteButton')}
      onCloseDialog={handleClose}
      onClickDiscard={handleClose}
      onClickDelete={deleteItem}
      isSuccess={isSuccess}
      confirmToDeleteText={t('deleteDialog.confirmToDelete')}
    />
  )
}

export default ReportedDisruptionsDeleteDialog
