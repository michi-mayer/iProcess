import { isCreateResolverEvent, NoID } from 'iprocess-shared'
import { CreateGroupingCustomMutationVariables, LambdaGroupingInput } from 'iprocess-shared/graphql/API.js'

export interface CreateEvent extends CreateGroupingCustomMutationVariables {
  put: LambdaGroupingInput & NoID
  delete?: never
}

export const isCreateEvent = isCreateResolverEvent<CreateGroupingCustomMutationVariables, CreateEvent>()
