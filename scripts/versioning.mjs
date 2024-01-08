#!/usr/bin/env zx
/**
 * * Create the next app version, which follows the format <year>.<week number>.<number of features>.<number of fixes>
 * 
 * 
 * ? Parameters:
 * ?  - current-version [required]: The app's current version 
 * ?  - source [optional]: Which remote to point to. If not passed, it defaults to 'origin'
 * ?  - dry-run [optional]: useful for testing. Runs all the generation steps without pushing the changes
 * 
 * ? Example:
 * ?  zx versioning.mjs --current-version 0.1.0
 * ?  zx versioning.mjs --current-version 0.1.0 --dry-run
 * ?  zx versioning.mjs --current-version 0.1.0 --source int
 * 
 * ? Example (with 'npm' target):
 * ?  npm run set-version
 * ?  npm run set-version --dry-run # (for testing purposes)
 */

import { $, echo, question, os, argv } from 'zx'
import moment from 'moment'
import { z } from 'zod'

$.verbose = false // ? Set to 'true' for debugging purposes

const main = async () => {
  const { currentVersion, commitId, source, dryRun } = commandLineParameters()
  echo`Current version is ${currentVersion}. Commit ID is ${commitId}`

  const nextVersion = await getNextVersion()
  const branchName = await $`git rev-parse --abbrev-ref ${commitId}`
  echo`Next version is ${nextVersion}. Adding new git tag and pushing the changes to '${source} ${branchName}'`

  echo`Updating package.json ⏳`
  await updatePackage(currentVersion, nextVersion)

  if (!dryRun) {
    echo`Amending last commit`
    await commitPackageChanges()
  }

  echo`Tagging ${commitId} commit`
  await createGitTag(nextVersion, commitId)

  echo`Please run 'git commit --amend'`

  if (dryRun) {
    echo`Please run 'git tag -d v${nextVersion}' and reset 'package.json' version to remove the recently-added tag'`
  } else {
    echo`To push the changes, please run 'git push ${source} --tags && git push ${source} ${branchName} --force'`
  }
}

const commandLineParameters = () => {
  if ($.verbose) echo`Command line arguments are: ${JSON.stringify(argv)}`

  return z.object({
    'current-version': z.string().min(1),
    'dry-run': z.boolean().optional(),
    source: z.string().min(1).optional()
  }).transform((_) => ({
    currentVersion: _['current-version'],
    dryRun: _['dry-run'] || false,
    source: _.source || 'origin',
    commitId: 'HEAD',
  })).parse(argv)
}

const getNextVersion = async () => {
  const now = moment.utc()
  const weekLabel = now.isoWeek()
  const yearLabel = now.format('YY')
  const numberOfFeatures = await question('How many features did we finished in this version? ')
  const numberOfFixes = await question('How many fixes did we finished in this version? ')

  return `${yearLabel}.${weekLabel}.${numberOfFeatures}-${numberOfFixes}`
}

const updatePackage = async (currentVersion, nextVersion) => {
  if (os.platform() === 'darwin') { // ? MacOS requires an additional empty argument
    await $`sed -i '' 's/"version": "${currentVersion}"/"version": "${nextVersion}"/g' package.json`
  } else {
    await $`sed -i 's/"version": "${currentVersion}"/"version": "${nextVersion}"/g' package.json`
  }
}

const commitPackageChanges = async () =>
  await $`git add ./package.json`

const createGitTag = async (nextVersion, commitId) =>
  await $`git tag -a v${nextVersion} ${commitId} -m 'v${nextVersion}'`

await main()
