import type { CSSProperties } from 'react'
import type { QueryOptions as BaseQueryOptions } from '@tanstack/query-core'

declare module '*.svg' {
  const content: string
  export default content
}

declare module '@group-ui/group-ui-react/dist/react-component-lib/interfaces' {
  export interface StyleReactProps {
    class?: string
    className?: string
    style?: CSSProperties
  }
}

declare module '@tanstack/query-core' {
  export interface QueryOptions extends Omit<BaseQueryOptions, 'meta'> {
    meta?: {
      input: unknown
      errorMessage: string
    }
  }
}
