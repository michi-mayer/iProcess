#!/usr/bin/env zx
/**
 * * Updates shared code in src/ and 'iprocess-shared' Lambda layer
 * 
 * ? Example:
 * ?  zx update-shared-code.mjs
 */

import { $, echo } from 'zx'
import shell from 'shelljs'

import { getLambdaLayerPath } from './utils.mjs'

$.verbose = false // ? Set to 'true' for debugging purposes

const lambdaLayerPath = getLambdaLayerPath()

const main = async () => {

  echo`Removing shared folder from Lambda layer`
  await removeSharedModules()

  echo`Copying shared modules to the Lambda Layer`
  await copySharedModules()

  echo`Lambda layer directory is ${lambdaLayerPath}`

  echo`Renaming API imports to point iprocess-shared GraphQL module`
  await renameAPIImports()

  echo`All done 👑`
}

const copySharedModules = async () =>
  await $`rsync -av --exclude='*test*' src/shared/ ${lambdaLayerPath}/shared/`

const removeSharedModules = async () => await $`rm -rf ${lambdaLayerPath}/shared/`


// * It's recommended to update the SED regex by checking that it works in https://sed.js.org/
const renameAPIImports = () => {
  shell.sed('-i', 'from .\+API.\+', 'from "../graphql/API.js"', `${lambdaLayerPath}/shared/*.ts`)
  shell.sed('-i', 'from .\(\./.\+\).', 'from "$1.js"', `${lambdaLayerPath}/shared/*.ts`)
}

await main()

