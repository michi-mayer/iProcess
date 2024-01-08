import { z, ZodType } from 'zod'

import { momentDateTimeParser, DateTimeParser } from '../shared/time.js'
import { defaultOf } from '../shared/zod.js'

import { dropEmptyStrings } from './utils.js'

export const nullishPositiveNumber = defaultOf(z.number().positive(), undefined)

// * Solution proposed by BDFL https://github.com/colinhacks/zod/issues/361#issuecomment-807294331
export const lambdaArguments = <Schema extends ZodType>(parser: Schema) =>
  z
    .preprocess((_) => dropEmptyStrings(_), z.unknown())
    .pipe(z.object({ arguments: parser }))
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    .transform((_) => (_ as { arguments: z.infer<typeof parser> }).arguments)

// * Solution proposed by BDFL https://github.com/colinhacks/zod/issues/361#issuecomment-807294331
export const lambdaInput = <Schema extends ZodType>(parser: Schema) =>
  z
    .preprocess((_) => dropEmptyStrings(_), z.unknown())
    .pipe(z.object({ arguments: z.object({ input: parser }) }))
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    .transform((_) => (_ as { arguments: { input: z.infer<typeof parser> } }).arguments.input)

export const zodMomentParser = (
  fieldName: string,
  momentInputType: string = 'AWSDateTime',
  parserMethod: DateTimeParser = momentDateTimeParser
) =>
  z
    .union([z.string(), z.number()])
    .transform((_) => parserMethod(_))
    .refine((_) => _.isValid(), `${fieldName} is not a valid ${momentInputType}`)
