import { Tracer } from '@aws-lambda-powertools/tracer'

import { fromEnvironment } from 'iprocess-shared'

export const tracer = new Tracer({
  enabled: fromEnvironment('POWERTOOLS_TRACE_ENABLED', () => 'false').toLowerCase() === 'true',
  serviceName: 'calculateOEE'
})
