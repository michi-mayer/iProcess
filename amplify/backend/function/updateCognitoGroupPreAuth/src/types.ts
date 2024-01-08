import { z } from 'zod'
import { NonEmptyString, arrayOf, parseRawJSON } from 'iprocess-shared'

import developerLoginEvent from './tests/event-dev-login.json'
import cloudIdpLoginEvent from './tests/event-cloudidp-login.json'

export type Event = typeof developerLoginEvent | typeof cloudIdpLoginEvent

export const RawJSONStringArraySchema = parseRawJSON.pipe(arrayOf(NonEmptyString))
export const UserAttributesSchema = z.object({ profile: RawJSONStringArraySchema }).passthrough()
