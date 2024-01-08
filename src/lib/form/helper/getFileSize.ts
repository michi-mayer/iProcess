import { Storage } from '@aws-amplify/storage'

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const getSizeFromStorageKey = async (key: string) => {
  const response = await Storage.list(key)
  if (response.results[0]?.size && response.results[0].size > 0) {
    return formatBytes(response.results[0].size)
  }
}
