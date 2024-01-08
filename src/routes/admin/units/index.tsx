import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { UnitType } from 'API'
import UnitsDialog from 'components/Dialogs/Admin/UnitsDialog'
import CustomDialog from 'components/Dialogs/CustomDialog'
import DeleteDialog from 'components/Dialogs/DeleteDialog'
import type { ExtendedUnit } from 'contexts/iProcessContext'
import { EMPTY_STRING } from 'helper/constants'
import { formatCreatedAtDate } from 'helper/time'
import { truncateText } from 'helper/truncateText'
import { isUnitConnectedToMachine } from 'helper/units'
import { defined } from 'helper/utils'
import useMutateUnit from 'hooks/services/useMutateUnit'
import useQueryListUnits from 'hooks/services/useQueryListUnits'
import useClearState from 'hooks/useClearState'
import useDialogHandler from 'hooks/useDialogHandler'
import usePagination from 'hooks/usePagination'
import useScreenSize from 'hooks/useScreenSize'
import TableSkeleton from 'lib/animation/TableSkeleton'
import { ActionButtons } from 'lib/ui/Buttons'
import Pagination from '../../../components/Sections/Pagination'
import { SectionContainer } from '../../../components/Sections/SectionContainer'

const maxTextLength = 16

const UnitsSection = () => {
  const { t } = useTranslation('admin')
  const [unit, setUnit] = useState<ExtendedUnit | undefined>()
  const [currentPage, setCurrentPage] = useState<number>(1)

  const { open, handleClickOpen, handleClose } = useDialogHandler('admin')
  const {
    open: openDelete,
    handleClickOpen: handleOpenDelete,
    handleClose: handleCloseDelete
  } = useDialogHandler('admin')
  const { data: listUnits, isPending, isSuccess } = useQueryListUnits()
  const {
    mutate,
    isSuccess: isSucessDelete,
    isPending: isLoadingDelete,
    isError
  } = useMutateUnit({ shouldDelete: true })
  const screenSize = useScreenSize()
  const { paginatedItems, totalOfPages } = usePagination(listUnits?.items, currentPage)

  useClearState(() => {
    setUnit(undefined)
  })

  const handleClickEdit = (unitData: ExtendedUnit): void => {
    setUnit(unitData)
    handleClickOpen()
  }

  const handleClickDelete = (unitData: ExtendedUnit): void => {
    setUnit(unitData)
    handleOpenDelete()
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [screenSize])

  return (
    <>
      <SectionContainer
        buttonText={t('unitsSection.addUnitButton')}
        onClick={handleClickOpen}
        id='unit-section-container'
      >
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant='h3'>{t('unitsSection.abbreviation')}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='h3'>{t('unitsSection.name')}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='h3'>{t('unitsSection.type')}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='h3'>{t('unitsSection.manufacturer')}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='h3'>{t('unitsSection.machineId')}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='h3'>{t('unitsSection.createdAt')}</Typography>
            </TableCell>
            <TableCell />
            {isPending && <TableCell />}
          </TableRow>
        </TableHead>
        <TableBody>
          {isPending && <TableSkeleton columns={5} rows={5} withButtons />}
          {isSuccess &&
            paginatedItems &&
            paginatedItems?.map((unit: ExtendedUnit) => {
              const type =
                unit.type === UnitType.assemblyLine ? t('unitsSection.assemblyLine') : t('unitsSection.productionUnit')
              return (
                <TableRow key={unit.id} id='data-table-row-unit'>
                  <TableCell id={`shortName-cell-${unit.shortName}`}>
                    <Typography variant='inherit'>{unit.shortName}</Typography>
                  </TableCell>
                  <TableCell id={`name-cell-${unit.name}`}>
                    <Typography variant='inherit'>{truncateText({ maxTextLength, text: unit.name })}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='inherit' id={`type-cell-${unit.type}`}>
                      {truncateText({ maxTextLength, text: type })}
                    </Typography>
                  </TableCell>
                  <TableCell id={`manufacturer-cell-${unit.manufacturer}`}>
                    <Typography variant='inherit'>
                      {truncateText({ maxTextLength, text: unit.manufacturer })}
                    </Typography>
                  </TableCell>
                  <TableCell id={`machineId-cell-${unit.machineId}`}>
                    <Typography variant='inherit'>
                      {isUnitConnectedToMachine(unit)
                        ? truncateText({ maxTextLength, text: unit.machineId })
                        : EMPTY_STRING}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='inherit' id={`createdAt-cell-${unit.createdAt}`}>
                      {formatCreatedAtDate(unit?.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <ActionButtons
                      editButtonId={`update-unit-button-${unit.shortName}`}
                      deleteButtonId={`delete-unit-button-${unit.shortName}`}
                      onClickEdit={() => handleClickEdit(unit)}
                      onClickDelete={() => handleClickDelete(unit)}
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
        maxWidth='md'
        onClose={handleClose}
        title={!unit ? t('unitsSection.dialogTitleNewUnit') : t('unitsSection.dialogTitleEditUnit')}
      >
        <UnitsDialog onClose={handleClose} unitData={unit} />
      </CustomDialog>
      <DeleteDialog
        openDialog={openDelete}
        onCloseDialog={handleCloseDelete}
        onClickDelete={() => mutate({ id: defined('unitId at Delete Unit mutation', unit?.id) })}
        confirmToDeleteText={t('deleteDialog.confirmToDelete')}
        itemName={unit?.name}
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

export default UnitsSection
