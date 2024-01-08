import { AttributeType as AWSAttributeType } from '@aws-sdk/client-cognito-identity-provider'
import { z } from 'zod'

import { CognitoAttributes, NonEmptyString } from 'iprocess-shared'

export type AttributeType = AWSAttributeType & { Name?: CognitoAttributes }

export const eventSchema = z
  .object({
    arguments: z.object({
      input: z.object({
        attributes: z.array(NonEmptyString).transform((_) => _ as CognitoAttributes[])
      })
    })
  })
  .transform((_) => _.arguments.input)
