import { Metrics, MetricUnits } from '@aws-lambda-powertools/metrics'

export const metrics = new Metrics({ namespace: 'iProcess-app', serviceName: 'calculateOEE' })

export const increaseErrorCountMetric = () => metrics.addMetric('error', MetricUnits.Count, 1)
