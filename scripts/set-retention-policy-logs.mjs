import {
  CloudWatchLogsClient,
  DescribeLogGroupsCommand,
  PutRetentionPolicyCommand
} from '@aws-sdk/client-cloudwatch-logs'
import { echo } from 'zx'

const client = new CloudWatchLogsClient()

/**
 *
 * @param { 'develop' | 'stag' | 'int'} environment
 */
const getAllLambdaLogGroups = async (environment = 'develop') => {
  const result = []
  let nextToken

  do {
    const { logGroups, nextToken: responseNextToken } = await client.send(
      new DescribeLogGroupsCommand({
        logGroupNamePrefix: '/aws/lambda',
        nextToken
      })
    )
    const amplifyLambdaLogGroups = (logGroups || []).filter(({ logGroupName }) => logGroupName.endsWith(environment))
    result.push(...amplifyLambdaLogGroups)

    nextToken = responseNextToken
  } while (nextToken)

  return result
}

const main = async (retentionInDays = 7) => {
  const lambdaLogGroups = await getAllLambdaLogGroups()

  for (const { logGroupName, retentionInDays: presetRetentionInDays } of lambdaLogGroups) {
    if (presetRetentionInDays) {
      echo`Log retention policy for lambda ${logGroupName} is already set to ${presetRetentionInDays} days`
      continue
    }

    echo`Settting log retention policy for lambda ${logGroupName} to ${retentionInDays} days`
    await client.send(new PutRetentionPolicyCommand({ logGroupName, retentionInDays }))
  }

  echo`✨ Done ✨`
}

await main()
