import {
  LambdaArguments,
  WithID,
  NoID,
  isCreateResolverEvent,
  isDeleteResolverEvent,
  isUpdateResolverEvent
} from 'iprocess-shared'
import { DeleteInput, MeasureReportInput, MutateMeasureReportMutationVariables } from 'iprocess-shared/graphql/API.js'

export type InputEvent = LambdaArguments<MutateMeasureReportMutationVariables>

export interface CreateEvent extends MutateMeasureReportMutationVariables {
  put: MeasureReportInput & NoID
  delete?: never
}

export interface UpdateEvent extends MutateMeasureReportMutationVariables {
  put: MeasureReportInput & WithID
  delete?: never
}

export interface DeleteEvent extends MutateMeasureReportMutationVariables {
  put?: never
  delete: DeleteInput
}

export const isCreateEvent = isCreateResolverEvent<MutateMeasureReportMutationVariables, CreateEvent>()

export const isUpdateEvent = isUpdateResolverEvent<MutateMeasureReportMutationVariables, UpdateEvent>()

export const isDeleteEvent = isDeleteResolverEvent<MutateMeasureReportMutationVariables, DeleteEvent>()
