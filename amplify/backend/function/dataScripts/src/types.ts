import { z } from 'zod'

import { defaultOf, lambdaArguments, NonEmptyString } from 'iprocess-shared'

const DEFAULT_PERSIST_TO_DB = true

export const EventSchema = lambdaArguments(
  z.object({ workflow: NonEmptyString, persistToDB: defaultOf(z.boolean(), DEFAULT_PERSIST_TO_DB) })
)

export type Event = NonNullable<z.infer<typeof EventSchema>>
