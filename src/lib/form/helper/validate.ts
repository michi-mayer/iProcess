export const findDuplicates = <T>(array: T[]) => array.filter((item, index) => array.indexOf(item) !== index)

export const multipleIndexOf = <T>(array: T[], element: T) => {
  const indexes = []
  for (let index = array.length - 1; index >= 0; index--) {
    if (array[index] === element) {
      indexes.unshift(index)
    }
  }
  return indexes
}

export const validateDuplicatedNames = <T extends { name: string }>(array: T[], callback: (index: number) => void) => {
  const names = array?.map((_) => _.name.toLocaleLowerCase()) || []
  const duplicatedNames = findDuplicates(names)
  for (const name of duplicatedNames) {
    const indexes = multipleIndexOf(names, name)
    if (indexes.length > 0) {
      for (const index of indexes) {
        callback(index)
      }
    }
  }
}
