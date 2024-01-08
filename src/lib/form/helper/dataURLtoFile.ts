import { defined } from 'helper/utils'

// TODO: To convert dataUrl (which we get from our blob) to a a file object
export const dataURLtoFile = (dataurl: string, filename: string) => {
  const array = dataurl.split(',')
  const mime = array[0]?.match(/:(.*?);/)?.[1]
  const bstr = window.atob(defined('dataURLtoFile.array', array[1]))
  let n: number = bstr.length
  const u8array: Uint8Array = new Uint8Array(n)

  // eslint-disable-next-line unicorn/prefer-code-point
  while (n--) u8array[n] = bstr.charCodeAt(n)

  return new File([u8array], filename, { type: mime })
}
