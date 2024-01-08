import {
  isCreateResolverEvent,
  isDeleteResolverEvent,
  isUpdateResolverEvent,
  LambdaArguments,
  NoID,
  WithID
} from 'iprocess-shared'
import { DeleteInput, MutateUnitMutationVariables, UnitInput } from 'iprocess-shared/graphql/API.js'

export type InputEvent = LambdaArguments<MutateUnitMutationVariables>

export interface CreateEvent extends MutateUnitMutationVariables {
  put: UnitInput & NoID
  delete?: never
}

export interface UpdateEvent extends MutateUnitMutationVariables {
  put: UnitInput & WithID
  delete?: never
}

export interface DeleteEvent extends MutateUnitMutationVariables {
  put?: never
  delete: DeleteInput
}

export const isCreateEvent = isCreateResolverEvent<MutateUnitMutationVariables, CreateEvent>()

export const isUpdateEvent = isUpdateResolverEvent<MutateUnitMutationVariables, UpdateEvent>()

export const isDeleteEvent = isDeleteResolverEvent<MutateUnitMutationVariables, DeleteEvent>()
