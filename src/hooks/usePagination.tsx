import { useEffect, useState } from 'react'
import useScreenSize, { ScreenSize } from './useScreenSize'

const calculatePaginationNumbers = <T,>(items: T[], screenSize: ScreenSize) => {
  const heightOutsideTable = 300
  const rowHeight = 61
  const limitOfItemsCalculated = Math.floor((screenSize.windowHeight - heightOutsideTable) / rowHeight)
  const totalPagesCalculated = Math.ceil(items?.length / limitOfItemsCalculated)
  return { limitOfItemsCalculated, totalPagesCalculated }
}

const usePagination = <T,>(items: T[] | undefined, currentPage: number) => {
  const [paginatedItems, setPaginatedItems] = useState<T[]>()
  const [limitOfItems, setLimitOfItems] = useState<number | undefined>()
  const [totalOfPages, setTotalOfPages] = useState<number>(0)
  const screenSize = useScreenSize()

  useEffect(() => {
    let mounted = true
    if (items && limitOfItems && mounted) {
      const indexOfLastItem = currentPage * limitOfItems
      const indexOfFirstItem = indexOfLastItem - limitOfItems
      const currentItemsToDisplay = items?.slice(indexOfFirstItem, indexOfLastItem)
      setPaginatedItems(currentItemsToDisplay)

      console.debug('[usePagination]', { currentItemsToDisplay })
    }
    return () => {
      mounted = false
    }
  }, [currentPage, items, limitOfItems])

  useEffect(() => {
    if (items && screenSize) {
      const { limitOfItemsCalculated, totalPagesCalculated } = calculatePaginationNumbers<T>(items, screenSize)
      setLimitOfItems(limitOfItemsCalculated)
      setTotalOfPages(totalPagesCalculated)
    }
  }, [items, screenSize])

  return { paginatedItems, totalOfPages }
}

export default usePagination
