import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useMatches, useNavigate } from 'react-router'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import {
  CircularProgress,
  Grid,
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { ROUTER } from 'routes/routing'
import { IShiftModel } from 'components/Dialogs/Admin/ShiftModelForm'
import DeleteDialog from 'components/Dialogs/DeleteDialog'
import { formatCreatedAtDate } from 'helper/time'
import useMutateShiftModel from 'hooks/services/useMutateShiftModel'
import useQueryListShiftModels from 'hooks/services/useQueryListShiftModels'
import useClearState from 'hooks/useClearState'
import useDialogHandler from 'hooks/useDialogHandler'
import usePagination from 'hooks/usePagination'
import useScreenSize from 'hooks/useScreenSize'
import TableSkeleton from 'lib/animation/TableSkeleton'
import { ActionButtons } from 'lib/ui/Buttons'
import Pagination from '../../../components/Sections/Pagination'
import { SectionContainer } from '../../../components/Sections/SectionContainer'

const ShiftModelSection = () => {
  const { t } = useTranslation('admin')
  const matches = useMatches()
  const navigate = useNavigate()
  const [shiftModelId, setShiftModelId] = useState<string | undefined>()
  const [shiftModel, setShiftModel] = useState<IShiftModel | undefined>()
  const [currentPage, setCurrentPage] = useState<number>(1)

  const {
    open: openDelete,
    handleClickOpen: handleOpenDelete,
    handleClose: handleCloseDelete
  } = useDialogHandler('admin')
  const { data: listShiftModels, isPending, isSuccess } = useQueryListShiftModels()
  const queryClient = useQueryClient()
  const { mutate, isPending: isLoadingCopy, isSuccess: isSuccessCopy } = useMutateShiftModel({ operation: 'duplicate' })
  const {
    isError,
    isSuccess: isSucessDelete,
    isPending: isLoadingDelete,
    mutate: deleteShiftModel
  } = useMutateShiftModel({ operation: 'delete' })

  const screenSize = useScreenSize()
  const { paginatedItems, totalOfPages } = usePagination(listShiftModels?.items, currentPage)

  useClearState(() => {
    setShiftModel(undefined)
    queryClient.invalidateQueries({
      queryKey: ['ListShiftModels']
    })
  })

  const handleClickDelete = (shiftModel: IShiftModel): void => {
    setShiftModel(shiftModel)
    handleOpenDelete()
  }

  /** A COPY refers to a ShiftModel copy */
  const handleClickCopy = ({ id }: IShiftModel) => {
    mutate({ id })
    setShiftModelId(id)
  }

  useEffect(() => {
    if (isSuccessCopy) {
      setShiftModelId(undefined)
    }
  }, [isSuccessCopy])

  useEffect(() => {
    setCurrentPage(1)
  }, [screenSize])

  if (matches.some((route) => route.pathname.includes('create') || route.pathname.includes('update'))) {
    return <Outlet />
  }

  return (
    <Grid container>
      <SectionContainer
        buttonText={t('shiftModelsSection.addShiftModelButton')}
        to={ROUTER.ADMIN_CREATE_SHIFT_MODEL_PATH}
        id='schedule-section-container'
      >
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant='h3' style={{ minWidth: '6rem' }}>
                {t('shiftModelsSection.name')}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant='h3' style={{ minWidth: '23rem' }}>
                {t('shiftModelsSection.units')}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant='h3'>{t('shiftModelsSection.status')}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='h3'>{t('shiftModelsSection.createdAt')}</Typography>
            </TableCell>
            <TableCell />
            {isPending && <TableCell />}
          </TableRow>
        </TableHead>
        <TableBody>
          {isPending && <TableSkeleton columns={4} rows={4} withButtons />}
          {isSuccess &&
            paginatedItems &&
            paginatedItems?.map((shiftModel) => {
              const { id, name, selectedUnits, isActive, createdAt } = shiftModel
              const selectedUnitShortNames = selectedUnits.map((_) => _.shortName).join(', ')
              return (
                <TableRow key={id} id='data-table-row-shiftModel'>
                  <TableCell id='shiftModel-name'>
                    <Typography variant='inherit' id={`shiftModelName-cell-${name}`}>
                      {name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='inherit' id={`units-cell-${selectedUnitShortNames}`}>
                      {selectedUnitShortNames}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='inherit' id={`shiftModelStatus-cell-${name}`}>
                      {isActive ? t('shiftModelsSection.statusActive') : t('shiftModelsSection.statusNotActive')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='inherit'>{formatCreatedAtDate(createdAt)}</Typography>
                  </TableCell>
                  <TableCell>
                    <ActionButtons
                      childrenPosition='left'
                      editButtonId={`update-shiftModel-button-${name}`}
                      deleteButtonId={`delete-shiftModel-button-${name}`}
                      onClickDelete={() => handleClickDelete(shiftModel)}
                      onClickEdit={() => navigate(`${ROUTER.ADMIN_SHIFT_MODEL_UPDATE_PATH}/${id}`, { replace: true })}
                    >
                      <IconButton
                        disabled={isLoadingCopy}
                        onClick={() => handleClickCopy(shiftModel)}
                        id={`copy-shiftModel-button-${name}`}
                        size='large'
                      >
                        {isLoadingCopy && shiftModelId === id ? (
                          <CircularProgress size={25} />
                        ) : (
                          <ContentCopyIcon color='primary' />
                        )}
                      </IconButton>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </SectionContainer>
      {totalOfPages && totalOfPages > 1 && (
        <Pagination onChangePage={setCurrentPage} page={currentPage} totalOfPages={totalOfPages} />
      )}
      <DeleteDialog
        openDialog={openDelete}
        onCloseDialog={handleCloseDelete}
        onClickDelete={() => deleteShiftModel({ id: shiftModel?.id })}
        confirmToDeleteText={t('deleteDialog.confirmToDelete')}
        itemName={shiftModel?.name}
        deleteButtonText={t('deleteDialog.deleteButton')}
        discardButtonText={t('deleteDialog.discardDeleteButton')}
        isLoading={isLoadingDelete}
        isSuccess={isSucessDelete}
        isError={isError}
        onClickDiscard={handleCloseDelete}
        title={t('deleteDialog.deleteItemTitle')}
        deleteButtonId='delete-unit-dialog-submit-button'
      />
    </Grid>
  )
}

export default ShiftModelSection
