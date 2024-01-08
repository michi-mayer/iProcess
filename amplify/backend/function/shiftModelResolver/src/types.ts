import {
  isCreateResolverEvent,
  isDeleteResolverEvent,
  isDuplicateResolverEvent,
  isUpdateResolverEvent,
  LambdaArguments,
  NoID,
  WithID
} from 'iprocess-shared'
import { DeleteInput, MutateShiftModelMutationVariables, ShiftModelInput } from 'iprocess-shared/graphql/API.js'

export type InputEvent = LambdaArguments<MutateShiftModelMutationVariables>

export interface CreateEvent extends MutateShiftModelMutationVariables {
  put: ShiftModelInput & NoID
}
export interface UpdateEvent extends MutateShiftModelMutationVariables {
  put: ShiftModelInput & WithID
}
export interface DeleteEvent extends MutateShiftModelMutationVariables {
  put?: never
  delete: DeleteInput
}
export interface DuplicateEvent extends MutateShiftModelMutationVariables {
  put?: never
  duplicate: DeleteInput
}

export const isCreateEvent = isCreateResolverEvent<MutateShiftModelMutationVariables, CreateEvent>()

export const isUpdateEvent = isUpdateResolverEvent<MutateShiftModelMutationVariables, UpdateEvent>()

export const isDeleteEvent = isDeleteResolverEvent<MutateShiftModelMutationVariables, DeleteEvent>()

export const isDuplicateEvent = isDuplicateResolverEvent<MutateShiftModelMutationVariables, DuplicateEvent>()
