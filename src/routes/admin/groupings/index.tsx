import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import GroupingDialog from 'components/Dialogs/Admin/GroupingDialog'
import CustomDialog from 'components/Dialogs/CustomDialog'
import DeleteDialog from 'components/Dialogs/DeleteDialog'
import Pagination from 'components/Sections/Pagination'
import { SectionContainer } from 'components/Sections/SectionContainer'
import { ExtendedGrouping } from 'contexts/iProcessContext'
import { EMPTY_STRING } from 'helper/constants'
import { formatCreatedAtDate } from 'helper/time'
import { parseUnitsAndClassifications } from 'helper/utils'
import useMutateGrouping from 'hooks/services/useMutateGrouping'
import useQueryListGrouping from 'hooks/services/useQueryListGrouping'
import useClearState from 'hooks/useClearState'
import useDialogHandler from 'hooks/useDialogHandler'
import usePagination from 'hooks/usePagination'
import useScreenSize from 'hooks/useScreenSize'
import TableSkeleton from 'lib/animation/TableSkeleton'
import { ActionButtons } from 'lib/ui/Buttons'

const GroupingsSection = () => {
  const { t } = useTranslation('admin')
  const [grouping, setGrouping] = useState<ExtendedGrouping | undefined>()
  const [currentPage, setCurrentPage] = useState<number>(1)

  const { open, handleClickOpen, handleClose } = useDialogHandler('admin')
  const {
    open: openDelete,
    handleClickOpen: handleOpenDelete,
    handleClose: handleCloseDelete
  } = useDialogHandler('admin')
  const { data: listGrouping, isPending, isSuccess } = useQueryListGrouping({ showAllGroupings: true })
  const {
    mutate,
    isSuccess: isSucessDelete,
    isPending: isLoadingDelete,
    isError
  } = useMutateGrouping({
    shouldDelete: true
  })

  const screenSize = useScreenSize()
  const { paginatedItems, totalOfPages } = usePagination(listGrouping?.items, currentPage)
  const setDialogTitle = grouping
    ? t('groupingsSection.dialogTitleEditGrouping')
    : t('groupingsSection.dialogTitleNewGrouping')

  useClearState(() => {
    setGrouping(undefined)
  })

  const handleClickEdit = (groupingData: ExtendedGrouping) => {
    groupingData.selectedUnits = grouping?.units?.map(({ id, shortName, name, type }) => ({
      id,
      shortName: shortName ?? EMPTY_STRING,
      name,
      type
    }))

    setGrouping(groupingData)
    handleClickOpen()
  }

  const handleClickDelete = (groupingData: ExtendedGrouping): void => {
    setGrouping(groupingData)
    handleOpenDelete()
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [screenSize])

  return (
    <>
      <SectionContainer
        buttonText={t('groupingsSection.addGroupingButton')}
        onClick={handleClickOpen}
        id='grouping-section-container'
      >
        <TableHead>
          <TableRow>
            <TableCell style={{ minWidth: '6rem' }}>
              <Typography variant='h3'>{t('groupingsSection.name')}</Typography>
            </TableCell>
            <TableCell style={{ minWidth: '10rem' }}>
              <Typography variant='h3'>{t('groupingsSection.units')}</Typography>
            </TableCell>
            <TableCell style={{ minWidth: '10rem' }}>
              <Typography variant='h3'>{t('groupingsSection.access')}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='h3'>{t('groupingsSection.createdAt')}</Typography>
            </TableCell>
            <TableCell />
            {isPending && <TableCell />}
          </TableRow>
        </TableHead>
        <TableBody>
          {isPending && <TableSkeleton columns={4} rows={3} withButtons />}
          {isSuccess &&
            paginatedItems &&
            paginatedItems?.map((grouping: ExtendedGrouping) => {
              return (
                <TableRow key={grouping.id} id='data-table-row-grouping'>
                  <TableCell id='grouping-name-cell' style={{ minWidth: '6rem' }}>
                    <Typography variant='inherit' id='grouping-table-description'>
                      {grouping.name}
                    </Typography>
                  </TableCell>
                  <TableCell id='unit-cell' style={{ minWidth: '10rem' }}>
                    <Typography variant='inherit' id='grouping-table-unit'>
                      {parseUnitsAndClassifications({ units: grouping.units })}
                    </Typography>
                  </TableCell>
                  <TableCell style={{ minWidth: '10rem' }}>
                    <Typography variant='inherit' id='grouping-table-unit'>
                      {grouping.selectedSubDepartments?.join(', ')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='inherit' id='createdAt-cell'>
                      {formatCreatedAtDate(grouping?.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <ActionButtons
                      editButtonId='update-grouping-button'
                      deleteButtonId='delete-grouping-button'
                      onClickEdit={() => handleClickEdit(grouping)}
                      onClickDelete={() => handleClickDelete(grouping)}
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
        maxWidth='sm'
        onClose={handleClose}
        title={setDialogTitle}
        stackStyle={{ marginTop: 0 }}
      >
        <GroupingDialog
          onClose={handleClose}
          listGrouping={listGrouping?.items}
          groupingData={{
            ...grouping,
            selectedUnits: grouping?.units?.map(({ id, shortName, name, type }) => ({ id, shortName, name, type }))
          }}
        />
      </CustomDialog>
      <DeleteDialog
        openDialog={openDelete}
        onCloseDialog={handleCloseDelete}
        onClickDelete={() => mutate(grouping)}
        confirmToDeleteText={t('deleteDialog.confirmToDelete')}
        itemName={grouping?.name}
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

export default GroupingsSection
