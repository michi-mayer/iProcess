import { QueryCache, QueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { NonEmptyString } from 'shared'

const QueryMetaSchema = z
  .object({
    input: z.object({}).passthrough().nullish(),
    errorMessage: NonEmptyString
  })
  .optional()

const DEFAULTS: z.infer<typeof QueryMetaSchema> = {
  errorMessage: 'An error occurred while fetching data',
  input: undefined
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Add default Options for Queries
    },
    mutations: {
      // Add default Options for Queries
    }
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      const { errorMessage, input } = QueryMetaSchema.parse(query.meta) ?? DEFAULTS
      console.error(errorMessage, { input, error })
    }
  })
})
