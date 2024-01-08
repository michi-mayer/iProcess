import { isDeleteResolverEvent } from 'iprocess-shared'
import { DeleteGroupingCustomMutationVariables, DeleteInput } from 'iprocess-shared/graphql/API.js'

export interface DeleteEvent extends DeleteGroupingCustomMutationVariables {
  put?: never
  delete: DeleteInput
}

export const isDeleteEvent = isDeleteResolverEvent<DeleteGroupingCustomMutationVariables, DeleteEvent>()
