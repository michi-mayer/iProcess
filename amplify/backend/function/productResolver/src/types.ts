import {
  isCreateResolverEvent,
  isDeleteResolverEvent,
  isUpdateResolverEvent,
  LambdaArguments,
  NoID,
  WithID
} from 'iprocess-shared'
import { DeleteInput, MutateProductMutationVariables, ProductInput } from 'iprocess-shared/graphql/API.js'

export type InputEvent = LambdaArguments<MutateProductMutationVariables>

export interface CreateEvent extends MutateProductMutationVariables {
  put: ProductInput & NoID
}
export interface UpdateEvent extends MutateProductMutationVariables {
  put: ProductInput & WithID
}
export interface DeleteEvent extends MutateProductMutationVariables {
  put?: never
  delete: DeleteInput
}

export const isCreateEvent = isCreateResolverEvent<MutateProductMutationVariables, CreateEvent>()

export const isUpdateEvent = isUpdateResolverEvent<MutateProductMutationVariables, UpdateEvent>()

export const isDeleteEvent = isDeleteResolverEvent<MutateProductMutationVariables, DeleteEvent>()
