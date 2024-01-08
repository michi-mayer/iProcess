/** @deprecated Please use {@link sortBy} from remeda */
export const sortByDate = <T extends { createdAt?: string | null }>(data: T[] | undefined): T[] => {
  return (
    data?.sort((a, b) => {
      return new Date(b?.createdAt ?? 0).getTime() - new Date(a?.createdAt ?? 0).getTime()
    }) || []
  )
}

export const sortByShortName = <T extends { shortName?: string | null }>(data: T[] | undefined): T[] => {
  return (
    data?.sort((a, b) => {
      if (a.shortName && b.shortName) {
        if (a.shortName < b.shortName) {
          return -1
        }
        if (a.shortName > b.shortName) {
          return 1
        }
      }
      return 0
    }) || []
  )
}

export const sortByName = <T extends { id?: string | null }>(data: T[] | undefined): T[] => {
  return (
    data?.sort((a, b) => {
      if (a.id && b.id) {
        if (a.id < b.id) {
          return -1
        }
        if (a.id > b.id) {
          return 1
        }
      }
      return 0
    }) || []
  )
}

export const sortNewsByDate = <
  T extends {
    date: string
  }
>(
  data: T[] | undefined
) => {
  return data?.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

const descendingComparator = <T>(a: T, b: T, orderBy: keyof T) => {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

export type Order = 'asc' | 'desc'

type RecordKey<T, Key extends keyof T> = Record<Key, T[Key]>
type SortFunction<T, Key extends keyof T> = (a: RecordKey<T, Key>, b: RecordKey<T, Key>) => number

export const getComparator = <T extends object, Key extends keyof T>(
  order: Order,
  orderBy: Key
): SortFunction<T, Key> => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}
