import { DisruptionResponse } from 'types'
import { DisruptionResponseSchema } from 'zodSchemas'
import { GetTemplateByIDQuery, GetTemplateByIDQueryVariables } from 'API'
import { getTemplateByID } from 'graphql/queriesCustom'
import { call } from 'services/client'
import { OTHER_DISRUPTIONS_TEMPLATE_ID } from 'shared'

export const updateDisruptionWithTemplateData = async (input: unknown) => {
  const inputCheck = DisruptionResponseSchema.safeParse(input)

  if (!inputCheck.success) {
    console.error(inputCheck.error)
    return input as DisruptionResponse
  }

  const item = inputCheck.data

  if (item.templateId === OTHER_DISRUPTIONS_TEMPLATE_ID) {
    return item
  }

  const response = await call<GetTemplateByIDQuery, GetTemplateByIDQueryVariables>(getTemplateByID, {
    id: item.templateId
  })

  const template = response.data?.getDisruption
  const itemWithTemplateDataCheck = DisruptionResponseSchema.safeParse({
    ...item,
    team: template?.team,
    originatorTeam: template?.originatorTeam,
    description: template?.description,
    disLocation: template?.disLocation,
    disLocationSpecification: template?.disLocationSpecification,
    disLocationType: template?.disLocationType
  })

  if (!itemWithTemplateDataCheck.success) {
    console.error(itemWithTemplateDataCheck.error)
    return item
  }

  return itemWithTemplateDataCheck.data
}

export const isUserAllowedToSeeGrouping = (
  allowedDepartments: string[] | null | undefined,
  userSubDepartment: string | undefined,
  showAllGroupings: boolean = false
) => {
  if (showAllGroupings) return true
  if (userSubDepartment === undefined) return false
  if (!allowedDepartments || allowedDepartments.length === 0) return false
  return allowedDepartments.includes(getDepartment(userSubDepartment))
}

export const getDepartment = (userSubDepartment: string) => {
  if (!userSubDepartment) {
    return ''
  }
  const pattern = /^[Kk]-(.{3})|^.{3}/
  const match = userSubDepartment.match(pattern)
  return match?.[0] ?? ''
}
