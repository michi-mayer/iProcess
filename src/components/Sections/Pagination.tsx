import { ChangeEvent } from 'react'
import { Grid, Pagination as PaginationMUI } from '@mui/material'

interface PaginationProps {
  onChangePage: (number: number) => void
  totalOfPages: number | undefined
  page: number | undefined
}

const Pagination = ({ onChangePage, totalOfPages, page }: PaginationProps) => {
  const handlePagination = (_event: ChangeEvent<unknown>, page: number) => {
    onChangePage(page)
  }

  return (
    <Grid
      container
      item
      xs={12}
      direction='row'
      justifyContent='flex-end'
      alignItems='center'
      style={{
        marginTop: '1rem',
        marginRight: '1rem',
        width: '200px'
      }}
    >
      <PaginationMUI
        id='pagination'
        itemID='item-pagination'
        color='primary'
        page={page}
        count={totalOfPages}
        showFirstButton={!!(totalOfPages && totalOfPages > 2)}
        showLastButton={!!(totalOfPages && totalOfPages > 2)}
        onChange={handlePagination}
      />
    </Grid>
  )
}

export default Pagination
