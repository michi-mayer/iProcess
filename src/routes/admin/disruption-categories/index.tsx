import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { DisruptionClassification } from 'APIcustom'
import DisruptionsDialog from 'components/Dialogs/Admin/DisruptionsDialog'
import CustomDialog from 'components/Dialogs/CustomDialog'
import DeleteDialog from 'components/Dialogs/DeleteDialog'
import { Classification } from 'contexts/iProcessContext'
import { formatCreatedAtDate } from 'helper/time'
import { truncateText } from 'helper/truncateText'
import { parseUnitsAndClassifications } from 'helper/utils'
import useMutateDisruptionsClassification from 'hooks/services/useMutateDisruptionsClassification'
import useQueryListDisruptionsClassification from 'hooks/services/useQueryListDisruptionsClassification'
import useClearState from 'hooks/useClearState'
import useDialogHandler from 'hooks/useDialogHandler'
import usePagination from 'hooks/usePagination'
import useScreenSize from 'hooks/useScreenSize'
import TableSkeleton from 'lib/animation/TableSkeleton'
import { ActionButtons } from 'lib/ui/Buttons'
import { definedArray } from 'shared'
import Pagination from '../../../components/Sections/Pagination'
import { SectionContainer } from '../../../components/Sections/SectionContainer'

const DisruptionsSection = () => {
  const { t } = useTranslation('admin')
  const [disruption, setDisruption] = useState<DisruptionClassification>({})
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { open, handleClickOpen, handleClose } = useDialogHandler('admin')
  const {
    open: openDelete,
    handleClickOpen: handleOpenDelete,
    handleClose: handleCloseDelete
  } = useDialogHandler('admin')
  const { data: listDisruptions, isPending, isSuccess } = useQueryListDisruptionsClassification()
  const {
    mutate,
    isSuccess: isSucessDelete,
    isPending: isLoadingDelete,
    isError
  } = useMutateDisruptionsClassification({
    shouldDelete: true
  })
  const screenSize = useScreenSize()
  const { paginatedItems, totalOfPages } = usePagination(listDisruptions?.items, currentPage)

  const usedUnitIds = definedArray(listDisruptions?.items?.flatMap((_) => _.units?.map((_) => _.id)))

  useClearState(() => {
    setDisruption({})
  })

  const handleClickEdit = (data: DisruptionClassification) => {
    setDisruption({
      ...data,
      selectedUnits: data.units,
      classificationPath: JSON.parse(data?.classification ?? '[]') as Classification[]
    })
    handleClickOpen()
  }

  const handleClickDelete = (disruptionData: DisruptionClassification): void => {
    setDisruption(disruptionData)
    handleOpenDelete()
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [screenSize])

  return (
    <>
      <SectionContainer
        buttonText={t('disruptionsSection.addDisruptionButton')}
        onClick={handleClickOpen}
        id='disruption-section-container'
      >
        <TableHead>
          <TableRow>
            <TableCell style={{ minWidth: '6rem' }}>
              <Typography variant='h3'>{t('disruptionsSection.unit')}</Typography>
            </TableCell>
            <TableCell style={{ minWidth: '35rem' }}>
              <Typography variant='h3'>{t('disruptionsSection.category')}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='h3'>{t('disruptionsSection.createdAt')}</Typography>
            </TableCell>
            <TableCell />
            {isPending && <TableCell />}
          </TableRow>
        </TableHead>
        <TableBody>
          {isPending && <TableSkeleton columns={4} rows={3} withButtons />}
          {isSuccess &&
            paginatedItems &&
            paginatedItems?.map((disruption) => {
              return (
                <TableRow key={disruption.id} id='data-table-row-disruption'>
                  <TableCell id='disruption-units' style={{ minWidth: '6rem' }}>
                    <Typography variant='inherit' id='disruption-table-units'>
                      {parseUnitsAndClassifications({
                        units: disruption.units
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell style={{ minWidth: '35rem' }}>
                    <Typography variant='inherit' id='disruption-table-classifications'>
                      {truncateText({
                        maxTextLength: 65,
                        text: parseUnitsAndClassifications({
                          disruptions: disruption.classification
                        })
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='inherit'>{formatCreatedAtDate(disruption?.createdAt)}</Typography>
                  </TableCell>
                  <TableCell>
                    <ActionButtons
                      editButtonId='update-disruption-button'
                      deleteButtonId='delete-disruption-button'
                      onClickEdit={() => handleClickEdit(disruption)}
                      onClickDelete={() => handleClickDelete(disruption)}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </SectionContainer>
      {totalOfPages && totalOfPages > 1 ? (
        <Pagination onChangePage={setCurrentPage} page={currentPage} totalOfPages={totalOfPages} />
      ) : undefined}
      <CustomDialog
        open={open}
        fullWidth={true}
        maxWidth='lg'
        onClose={handleClose}
        title={
          !disruption
            ? t('disruptionsSection.dialogTitleNewDisruption')
            : t('disruptionsSection.dialogTitleEditDisruption')
        }
      >
        <DisruptionsDialog onClose={handleClose} data={disruption} usedUnitIds={usedUnitIds} />
      </CustomDialog>
      <DeleteDialog
        openDialog={openDelete}
        onCloseDialog={handleCloseDelete}
        onClickDelete={() => mutate(disruption)}
        confirmToDeleteText={t('deleteDialog.confirmToDelete')}
        itemName={`${t('deleteDialog.deleteCatergoriesForUnits')} ${parseUnitsAndClassifications({
          units: disruption?.units
        })}`}
        deleteButtonText={t('deleteDialog.deleteButton')}
        discardButtonText={t('deleteDialog.discardDeleteButton')}
        isLoading={isLoadingDelete}
        isSuccess={isSucessDelete}
        isError={isError}
        onClickDiscard={handleCloseDelete}
        title={t('deleteDialog.deleteItemTitle')}
        deleteButtonId='delete-unit-dialog-submit-button'
      />
    </>
  )
}

export default DisruptionsSection
