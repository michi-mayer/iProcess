export const isNumberString = (input: string) => {
  return /^\d+$|^$/.test(input)
}
