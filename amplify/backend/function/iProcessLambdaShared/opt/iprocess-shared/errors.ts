/* c8 ignore start */
export class AppError extends Error {
  override message: string
  statusCode: number
  errorData?: unknown

  constructor(message: string, errorData?: unknown)
  constructor(message: string, statusCode: number = 400, errorData?: unknown) {
    super(message)

    this.message = message
    this.statusCode = statusCode
    this.errorData = errorData
  }

  static fromError(message: string, additionalInfo?: unknown): AppError {
    throw new AppError(message, additionalInfo)
  }
}

export class DatabaseError extends Error {
  override message: string
  statusCode: number

  constructor(message: string, errorInfo?: string[], statusCode: number = 400) {
    super(message)

    this.statusCode = statusCode
    this.message = JSON.stringify({ message, errors: errorInfo })
  }
}
/* c8 ignore stop */
