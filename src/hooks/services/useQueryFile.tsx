// React-query
import { Storage } from '@aws-amplify/storage'
import { useQuery } from '@tanstack/react-query'

const fetchImageUrl = async (key: string | undefined) => {
  return await Storage.get(key ?? '')
}

const useQueryFile = (key: string | undefined) => {
  return useQuery({ queryKey: ['File', key], queryFn: () => fetchImageUrl(key) })
}

export default useQueryFile
