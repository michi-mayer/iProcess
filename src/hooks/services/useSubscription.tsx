import { useEffect } from 'react'
import { subscribe } from 'services/client'

/**
 *
 * @param subscription GraphQL subscription
 * @param forwardCallbackUpdate Callback to get payload and do something. E.g. (payload) => do something with payload
 * @param variables Filter we want to apply to get the subscription. If it's undefined, the subscription won't be enabled
 * Carefully design your filter taking into account the following considerations:
 *
 * @remarks
 *
 * @see {@link https://docs.aws.amazon.com/appsync/latest/devguide/aws-appsync-real-time-data.html#argument-null-value-has-meaning Nullable variables have a different meaning than undefined ones}
 * @see {@link https://aws.amazon.com/blogs/mobile/announcing-server-side-filters-for-real-time-graphql-subscriptions-with-aws-amplify/#:~:text=Set%20up%20server%2Dside%20GraphQL%20subscription%20filters A 'filter' attribute can be used to enable server-side filtering}
 *
 */
const useSubscription = <
  SubscriptionType extends object,
  Variables extends object,
  ServerSideFilter extends object | unknown = unknown
>(
  subscription: string,
  forwardCallbackUpdate: (payload: SubscriptionType) => void,
  variables: (Variables & { filter?: ServerSideFilter }) | undefined
) => {
  useEffect(() => {
    if (variables) {
      const connection = subscribe<SubscriptionType, Variables>(subscription, variables).subscribe(
        ({ provider, value }) => {
          console.debug('[useSubscription]:', { value, provider })

          if (value.errors) {
            console.error(`Error in GraphQL response from ${subscription}`, value.errors)
          }

          forwardCallbackUpdate(value.data as SubscriptionType)
        },
        (error: unknown) => {
          if (error instanceof Error && error?.message) {
            console.error(`Check the key property: the current value is ${subscription}`, error)
          } else {
            console.error('[useSubscription]', error)
          }
        }
      )

      return () => void connection.unsubscribe()
    }
  }, [subscription, variables, forwardCallbackUpdate])
}

export default useSubscription
