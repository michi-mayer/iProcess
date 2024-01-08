#!/usr/bin/env zx
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * * Creates a pull request. Restrictions:
 * * - It only works in the DEV AWS account
 *
 * ? Example:
 * ?   zx create-pull-request.mjs
 */

import { readFileSync } from 'node:fs'
import { CodeCommitClient, CreatePullRequestCommand } from '@aws-sdk/client-codecommit'
import { $, echo, question } from 'zx'

$.verbose = false // ? Set to 'true' for debugging purposes

const GET_TICKET_REGEX = /VDD-\d+/g
const PR_AUTHOR_REGEX = /\/([^/]+)$/
const MICROSOFT_TEAMS_ENDPOINT =
  'https://mwea.webhook.office.com/webhookb2/b8c941ec-0fd2-4be6-91a9-4674b119860c@b8d7ad48-53f4-4c29-a71c-0717f0d3a5d0/IncomingWebhook/3a600755458241aa869b56f5ddb6b5ec/88f23086-33da-4c2f-bda3-3ce4f78393ce'

/**
 * @param { string } input
 * @returns { string }
 * */
const getTicketLink = (input) => {
  const matches = [...input.matchAll(GET_TICKET_REGEX)]
  const ticketNumber = matches?.[0]?.[0]

  return ticketNumber
    ? `[Link to the user story](https://issues.maibornwolff.de/browse/${ticketNumber})`
    : `User story not found`
}

const getAuthorInfo = async (authorArn) => {
  const id = authorArn.match(PR_AUTHOR_REGEX)[1]
  const nameResponse = await $`git config user.name`
  const emailResponse = await $`git config user.email`

  return { id, name: nameResponse.stdout.trim(), email: emailResponse.stdout.trim() }
}

/**
 * @param { import('@aws-sdk/client-codecommit').CreatePullRequestCommandOutput['pullRequest'] } pullRequest
 * @param { string } ticketLink
 * @param { string } openAppLink
 * @param { string } amplifyLink
 * */
async function sendPRtoTeams(pullRequest, ticketLink, openAppLink, amplifyLink) {
  const prID = pullRequest?.pullRequestId
  const author = await getAuthorInfo(pullRequest.authorArn)

  echo`Your name on git is ${author.name}, and your Teams user is ${author.email}`

  await fetch(MICROSOFT_TEAMS_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
      '@type': 'MessageCard',
      '@context': 'http://schema.org/extensions',
      themeColor: '0076D7',
      summary: `Pull Request Created`,
      sections: [
        {
          activityTitle: `Pull Request Created`,
          facts: [
            {
              name: 'Created by',
              value: `${author.name} (AWS user is ${author.id}, Teams user is ${author.email})`
            },
            {
              name: 'Creation date',
              value: `${pullRequest?.creationDate}`
            }
          ],
          markdown: true
        }
      ],
      potentialAction: [
        {
          '@type': 'OpenUri',
          name: 'Check PR',
          targets: [
            {
              os: 'default',
              uri: `https://eu-west-1.console.aws.amazon.com/codesuite/codecommit/repositories/iProcess/pull-requests/${prID}/details?region=eu-west-1`
            }
          ]
        },
        {
          '@type': 'OpenUri',
          name: 'JIRA ticket',
          targets: [
            {
              os: 'default',
              uri: ticketLink
            }
          ]
        },
        {
          '@type': 'OpenUri',
          name: 'Open the app',
          targets: [
            {
              os: 'default',
              uri: openAppLink
            }
          ]
        },
        {
          '@type': 'OpenUri',
          name: 'Check the latest build',
          targets: [
            {
              os: 'default',
              uri: amplifyLink
            }
          ]
        }
      ]
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })

  echo`Post in Teams Created`
}

const getBranchInfo = async () => {
  const response = await $`git symbolic-ref --short HEAD`
  const sourceBranch = response.stdout.trim()

  const amplifySourceBranch = sourceBranch.replaceAll('/', '-').toLowerCase()
  const ticketLink = getTicketLink(sourceBranch)

  return { sourceBranch, amplifySourceBranch, ticketLink }
}

const main = async () => {
  const client = new CodeCommitClient()

  echo`This script will only create PRs on DEV, not on INT, STAGING, or PROD`
  const { sourceBranch, amplifySourceBranch, ticketLink } = await getBranchInfo()

  const destinationResponse = await question('Please enter a destination branch [develop]: ')
  const destination = destinationResponse.trim().length > 0 ? destinationResponse : 'develop'

  const descriptionResponse = await question('Please add a description: ')
  const description = descriptionResponse.trim().length > 0 ? descriptionResponse : 'To be added'

  const isWIPResponse = await question('Is the PR Work In Progress (WIP)? (yes/no) [y]: ')
  const isWIPText = isWIPResponse.trim().toLowerCase()
  const isWIP = isWIPText.length > 0 ? isWIPText === 'y' : true
  const wipPrefix = isWIP ? 'WIP:' : ''

  const title = `${wipPrefix} ${sourceBranch} ➡️ ${destination}`
  echo`Title of the PR is: ⬇️`
  echo`${title}`

  const proceedResponse = await question('Do you want to proceed? (yes/no) [y]: ')
  const proceedText = proceedResponse.trim().toLowerCase()
  const shouldProceed = proceedText.length > 0 ? proceedText === 'y' : true

  const openAppLink = `https://${amplifySourceBranch}.ds585c653i06u.amplifyapp.com/`
  const amplifyLink = `https://eu-west-1.console.aws.amazon.com/amplify/home?region=eu-west-1#/ds585c653i06u/${amplifySourceBranch}/`

  if (shouldProceed) {
    echo`OK, it will proceed 🫡`

    const readmeResponse = readFileSync('docs/docs/definition-of-done.md', 'utf8')
    const readme = readmeResponse.toString()

    const fullDescription = `
- ${ticketLink}
- [Open the app with the latest changes](${openAppLink})
- [Check the latest build](${amplifyLink})

## Description
${description}
  
${readme}
    `

    const response = await client.send(
      new CreatePullRequestCommand({
        title,
        description: fullDescription,
        targets: [{ repositoryName: 'iProcess', sourceReference: sourceBranch, destinationReference: destination }]
      })
    )

    await sendPRtoTeams(response.pullRequest, ticketLink, openAppLink, amplifyLink)
    echo`Successfully created PR ${sourceBranch} => ${destination}`
  } else {
    echo`Exiting...`
  }
}

await main()
