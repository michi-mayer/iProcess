export const assertNever = (value: never): never => {
  console.error(`[assertNever]: This function expect to return "never" and it returned "${value}"`)
  return value
}
