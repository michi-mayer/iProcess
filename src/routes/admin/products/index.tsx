import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { ExtendedProductWithUnits } from 'APIcustom'
import { Bool } from 'API'
import ProductDialog from 'components/Dialogs/Admin/ProductDialog'
import CustomDialog from 'components/Dialogs/CustomDialog'
import DeleteDialog from 'components/Dialogs/DeleteDialog'
import { ExtendedUnit } from 'contexts/iProcessContext'
import { formatCreatedAtDate } from 'helper/time'
import { parseUnitsAndClassifications } from 'helper/utils'
import useMutateProduct from 'hooks/services/useMutateProduct'
import useQueryListParts from 'hooks/services/useQueryListParts'
import useClearState from 'hooks/useClearState'
import useDialogHandler from 'hooks/useDialogHandler'
import usePagination from 'hooks/usePagination'
import useScreenSize from 'hooks/useScreenSize'
import TableSkeleton from 'lib/animation/TableSkeleton'
import { ActionButtons } from 'lib/ui/Buttons'
import { definedArray } from 'shared'
import { colors } from 'theme'
import Pagination from '../../../components/Sections/Pagination'
import { SectionContainer } from '../../../components/Sections/SectionContainer'
import { selectorProductNameCell, selectorUpdateProduct } from './selector-ids'

const ProductsSection = () => {
  const { t } = useTranslation('admin')
  const [product, setProduct] = useState<ExtendedProductWithUnits>({ unitsConfig: [] })
  const [unitsFromProducts, setUnitsFromProducts] = useState<ExtendedUnit[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)

  const screenSize = useScreenSize()
  const { data: listParts, isLoading, isSuccess } = useQueryListParts()
  const { paginatedItems, totalOfPages } = usePagination(listParts?.items, currentPage)
  const {
    mutate,
    isSuccess: isSucessDelete,
    isPending: isLoadingDelete,
    isError
  } = useMutateProduct({ shouldDelete: true })

  const { open, handleClickOpen, handleClose } = useDialogHandler('admin')
  const {
    open: openDelete,
    handleClickOpen: handleOpenDelete,
    handleClose: handleCloseDelete
  } = useDialogHandler('admin')

  useClearState(() => void setProduct({ unitsConfig: [] }))

  const handleClickEdit = (data: ExtendedProductWithUnits) => {
    setProduct(data)
    handleClickOpen()
  }

  const handleClickDelete = (data: ExtendedProductWithUnits): void => {
    setProduct(data)
    handleOpenDelete()
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [screenSize])

  useEffect(() => {
    const unitsFromParts = listParts?.items?.flatMap((_) => definedArray(_.units))
    setUnitsFromProducts(unitsFromParts ?? [])
  }, [listParts])

  return (
    <>
      <SectionContainer
        buttonText={t('productsSection.addProductButton')}
        onClick={handleClickOpen}
        id='part-section-container'
      >
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant='h3'>{t('productsSection.number')}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='h3'>{t('productsSection.name')}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='h3'>{t('productsSection.unit')}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='h3'>{t('productsSection.withErrorPattern')}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='h3'>{t('productsSection.createdAt')}</Typography>
            </TableCell>
            <TableCell />
            {isLoading && <TableCell />}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && <TableSkeleton columns={4} rows={5} withButtons />}
          {isSuccess &&
            paginatedItems &&
            paginatedItems?.map((item) => (
              <TableRow key={item.id} id='data-table-row-part'>
                <TableCell id='part-number'>
                  <Typography variant='inherit' id={`partNumber-cell-${item.partNumber}`}>
                    {item.partNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='inherit' id={`${item.partNumber}-${selectorProductNameCell}-${item.name}`}>
                    {item.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant='inherit'
                    id={`${item.partNumber}-units-cell-${parseUnitsAndClassifications({
                      units: item.units
                    })}`}
                  >
                    {parseUnitsAndClassifications({ units: item.units })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='inherit'>
                    {item.hasQualityIssueConfig === Bool.yes ? (
                      <CheckIcon style={{ color: colors.blue }} id='part-WQI-icon' />
                    ) : (
                      <CloseIcon style={{ color: colors.blue }} id='part-NQI-icon' />
                    )}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='inherit'>{formatCreatedAtDate(item?.createdAt)}</Typography>
                </TableCell>
                <TableCell>
                  <ActionButtons
                    editButtonId={`${selectorUpdateProduct}-${item.partNumber}`}
                    deleteButtonId={`delete-part-button-${item.partNumber}`}
                    onClickEdit={() => handleClickEdit(item)}
                    onClickDelete={() => handleClickDelete(item)}
                  />
                </TableCell>
              </TableRow>
            ))}
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
        title={!product ? t('productsSection.dialogTitleNewProduct') : t('productsSection.dialogTitleEditProduct')}
      >
        <ProductDialog onClose={handleClose} product={product} unitsFromProducts={unitsFromProducts} />
      </CustomDialog>
      <DeleteDialog
        openDialog={openDelete}
        onCloseDialog={handleCloseDelete}
        onClickDelete={() => mutate(product)}
        confirmToDeleteText={t('deleteDialog.confirmToDelete')}
        itemName={product?.name}
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

export default ProductsSection
