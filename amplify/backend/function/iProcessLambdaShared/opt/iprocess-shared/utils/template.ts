import log from 'loglevel'
import type { Handler } from 'aws-lambda'

import { AppError } from '../errors.js'

type OnError = (lambdaHandlerName: string, error: unknown, inputEvent: unknown) => never

export const throwOnError: OnError = (lambdaHandlerName, error, inputEvent) => {
  if (error instanceof Error) {
    throw AppError.fromError(`Error in ${lambdaHandlerName}`, { error, inputEvent })
  } else {
    throw AppError.fromError(`Unknown failure in ${lambdaHandlerName}`, { error, inputEvent })
  }
}

export type LambdaArguments<T> = { arguments: T }
export type LambdaInput<T> = LambdaArguments<{ input: T }>

// prettier-ignore
export const lambdaHandlerBuilder = <O, I extends object>(
  lambdaHandlerName: string,
  handler: Handler<I, O>,
  onError: OnError = throwOnError
) => {
  const wrapper: Handler<I, O | void> = async (inputEvent, context, callback) => {
    log.debug('Input event:', JSON.stringify(inputEvent))

    try {
      return await handler(inputEvent, context, callback)
    } catch (error) {
      if (error instanceof Error) {
        throw AppError.fromError(`Error in ${lambdaHandlerName}`, { error, inputEvent })
      } else {
        onError(lambdaHandlerName, error, inputEvent)
      }
    }
  }

  return wrapper
}
