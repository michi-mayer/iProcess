export const calculateTotalQuota = <T extends { target?: number | null }>(configurations: T[] | undefined) => {
  return configurations?.reduce((previous, current) => previous + (current?.target ?? 0), 0) || 0
}
