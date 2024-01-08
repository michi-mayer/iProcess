import { useEffect, useMemo } from 'react'
import { InfiniteData } from '@tanstack/react-query'
import { ScanResult } from 'services/client'

interface Props<O extends object> {
  hasNextPage?: boolean
  fetchNextPage: () => void
  data: InfiniteData<ScanResult<O>> | undefined
}

const useAllInfiniteData = <O extends object>({ hasNextPage, fetchNextPage, data }: Props<O>) => {
  useEffect(() => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, data?.pages])

  return useMemo(() => data?.pages?.flatMap((page) => page?.items), [data?.pages])
}

export default useAllInfiniteData
