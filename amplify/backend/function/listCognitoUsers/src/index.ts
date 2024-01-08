// Lambda layer
import { CognitoAttributes, OutputEventItem, lambdaHandlerBuilder } from 'iprocess-shared'

// Local modules
import { AttributeType, eventSchema } from './types.js'
import { listUserAttributes } from './mapper.js'

export const handler = lambdaHandlerBuilder('listCognitoUsers', async (inputEvent) => {
  const { attributes: attributesToGet } = eventSchema.parse(inputEvent)
  const allUserAttributes = await listUserAttributes()

  return allUserAttributes.map((_) => filterAttributes(_, attributesToGet))
})

const filterAttributes = (userAttributes: AttributeType[], attributesToGet: CognitoAttributes[]) => {
  const result = {} as OutputEventItem

  for (const attribute of attributesToGet) {
    const maybeUserAttribute = userAttributes.find((_) => _.Name === attribute)
    // eslint-disable-next-line unicorn/no-null
    result[attribute] = maybeUserAttribute?.Value ?? null
  }

  return result
}
