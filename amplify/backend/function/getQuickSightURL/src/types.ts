import { z } from 'zod'
import { NonEmptyString, lambdaInput, parse } from 'iprocess-shared'
import { GetQuickSightURLInput } from 'iprocess-shared/graphql/API.js'

const GetQuickSightURLInputSchema = parse<GetQuickSightURLInput>().with({ initialDashboardId: NonEmptyString })

export const EventSchema = lambdaInput(GetQuickSightURLInputSchema)

export type Event = z.infer<typeof EventSchema>
