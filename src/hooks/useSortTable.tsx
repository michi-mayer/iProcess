import { MouseEvent, useState } from 'react'
// Helpers
import { getComparator, Order } from 'helper/sortData'

export interface UseSortTableProps<T extends object> {
  orderByDefault: keyof T
  orderDirection?: Order
}

const useSortTable = <T extends object>({ orderByDefault, orderDirection = 'asc' }: UseSortTableProps<T>) => {
  const [order, setOrder] = useState<Order>(orderDirection)
  const [orderBy, setOrderBy] = useState<keyof T>(orderByDefault)

  const handleRequestSort = (_event: MouseEvent<unknown>, property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  // eslint-disable-next-line unicorn/prefer-spread
  const sortWrapper = (_: T[]) => _.slice().sort(getComparator<T, keyof T>(order, orderBy))

  return { order, orderBy, handleRequestSort, sortWrapper }
}

export default useSortTable
