import { MutateTemplatesMutationVariables } from 'iprocess-shared/graphql/API.js'

import { batchUpdateTemplates } from '../mapper.js'

export const updateTemplates = async ({ put: templates }: MutateTemplatesMutationVariables) =>
  await batchUpdateTemplates(templates)
