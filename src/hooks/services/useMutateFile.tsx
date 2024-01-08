import { Storage } from '@aws-amplify/storage'
import { useMutation } from '@tanstack/react-query'
import { isFile } from 'types'

type ProgressCallback = (progress: ProgressEvent) => void

const storeFile = async (file: File, progressCallback?: ProgressCallback) => {
  return await Storage.put(file.name, file, {
    contentType: file.type,
    progressCallback
  })
}

const removeFile = async (key: File['name']) => {
  return await Storage.remove(key)
}

type MutationData = File | File['name']

const mutateFile = async (data: MutationData, progressCallback?: ProgressCallback) => {
  return isFile(data) ? await storeFile(data, progressCallback) : await removeFile(data)
}

const useMutateFile = (progressCallback?: ProgressCallback) => {
  return useMutation({
    mutationFn: (data: MutationData) => mutateFile(data, progressCallback),
    onError: (error) =>
      console.warn('[Amplify Storage]: Something went wrong! The file has not been processed correctly', error)
  })
}

export default useMutateFile
