import { isUpdateResolverEvent, WithID } from 'iprocess-shared'
import { UpdateGroupingCustomMutationVariables, LambdaGroupingInput } from 'iprocess-shared/graphql/API.js'

export interface UpdateEvent extends UpdateGroupingCustomMutationVariables {
  put: LambdaGroupingInput & WithID
  delete?: never
}

export const isUpdateEvent = isUpdateResolverEvent<UpdateGroupingCustomMutationVariables, UpdateEvent>()
