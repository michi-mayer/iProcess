import { suite, expect, assert, it } from 'vitest'
import { mock } from 'vitest-mock-extended'
import type { Context } from 'aws-lambda'

import { AppError } from '../errors.js'
import { lambdaHandlerBuilder } from '../utils/template.js'

suite('lambdaHandlerBuilder', () => {
  const context = mock<Context>()

  it('should generate a lambda handler that runs seamlessly', async () => {
    const runner = lambdaHandlerBuilder('test', async (_: { arguments: number }) => await Promise.resolve(_.arguments))

    assert.strictEqual(await runner({ arguments: 123 }, context, () => {}), 123)
  })

  it('should throw an error if there is a failure in the handler', async () => {
    const runner = lambdaHandlerBuilder('test', (_: { arguments: number }) => {
      throw new Error('nonsense error!')
    })

    await expect(runner({ arguments: 123 }, context, () => {})).rejects.toBeInstanceOf(AppError)
  })
})
