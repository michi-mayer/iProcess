import { useQuery } from '@tanstack/react-query'
import { Disruption } from 'types'
import { GetTemplateByIDQuery, GetTemplateByIDQueryVariables } from 'API'
import { getTemplateByID } from 'graphql/queriesCustom'
import { call } from 'services/client'
import { NonEmptyString, OTHER_DISRUPTIONS_TEMPLATE_ID } from 'shared'

const mapGetDisruptionQuery = (template: GetTemplateByIDQuery['getDisruption']): Omit<Disruption, 'isSolved'> => ({
  id: template?.id ?? undefined,
  description: template?.description ?? undefined,
  disLocation: template?.disLocation ?? '',
  disLocationSpecification: template?.disLocationSpecification ?? '',
  disLocationType: template?.disLocationType ?? undefined,
  cycleStationId: NonEmptyString.parse(template?.cycleStationId)
})

export const listCategoriesByTemplate = async (id: string | undefined) => {
  const parsedId = NonEmptyString.parse(id)
  const response = await call<GetTemplateByIDQuery, GetTemplateByIDQueryVariables>(getTemplateByID, {
    id: parsedId
  })

  return mapGetDisruptionQuery(response.data?.getDisruption)
}

interface Props {
  id: string | undefined
}

const useQueryCategoriesByTemplate = ({ id }: Props) => {
  return useQuery({
    queryKey: ['FetchCategoriesByDescription', { id }],
    queryFn: () => listCategoriesByTemplate(id),
    enabled: Boolean(id) && id !== OTHER_DISRUPTIONS_TEMPLATE_ID,
    meta: {
      input: { id },
      errorMessage: 'Error listCategoriesByTemplate with template ID:'
    }
  })
}

export default useQueryCategoriesByTemplate
