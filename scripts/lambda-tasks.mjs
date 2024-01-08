#!/usr/bin/env zx
/**
 * * A script that groups all AWS Lambda Function' tasks:
 * 
 * * - Install dependencies
 * * - Check TypeScript types and ESLint rules
 * * - Transpile TypeScript files to JavaScript
 * * - Remove transpiled JavaScript files (from Lambda Functions using TypeScript)
 * 
 * ! Beware that:
 * ! - Only one task is ran at a time
 * ! - It forbids from transpiling and removing the transpiled JS files at the same time
 * ! - All Lambda Functions must have 'build', 'build:before', and 'build:after' targets
 * 
 * * Parameters:
 * *  - setup: Removes all transpiled .js files, and installs development dependencies
 * *  - build: Transpiles all .ts files to .js files
 * *  - postbuild: Only installs production dependencies
 *
 * ? Example:
 * ?  zx lambda-tasks.mjs
 * ?  zx lambda-tasks.mjs --setup
 * ?  zx lambda-tasks.mjs --build
 * ?  zx lambda-tasks.mjs --postbuild
 * !  zx lambda-tasks.mjs --setup --build # this command fails!
 */

import { $, argv } from 'zx'

import { getLambdaFunctionDirectories, getLambdaPackagesPath } from "./utils.mjs"

$.verbose = process.env.DEBUG || false

const main = async () => {
  const { isSetup, isBuild, isPostBuild, operation } = getParameters()
  const lambdas = getLambdaFunctionDirectories({ onlyTypeScript: true, includeLayers: true })
  const bundledPackages = getLambdaPackagesPath()

  console.log(`✨ Starting ${operation} ✨`)

  if (lambdas.length > 0) {
    switch (true) {
      case [isSetup, isBuild, isPostBuild].filter(Boolean).length > 1:
        throw new Error('Cannot handle more than one option at a time')

      case isSetup:
        for (const _ of lambdas) await setup(_)

        break

      case isBuild:
        for (const _ of lambdas) await build(_)
        break

      case isPostBuild:
        for (const _ of lambdas) await postbuild(_)
        await installBundled(bundledPackages) // * required because it didn't generate JS files for the Layer until now
        break

      default:
        console.warn('Please select an option: --setup; --build; --postbuild')
    }
  } else {
    console.warn('Found 0 lambdas')
  }

  console.log(`Finished ${operation} 😁`)
}

const installBundled = async (path) => await $`cd ${path} && npm run build && cd - `

const build = async (path) => await $`cd ${path} && npm run build && cd -`

const setup = async (path) => await $`cd ${path} && npm run build:before && cd -`

const postbuild = async (path) => await $`cd ${path} && npm run build:after && cd -`

/**
 * 
 * @returns { 
 *  { 
 *    isSetup: boolean,
 *    isBuild: boolean,
 *    isPostBuild: boolean,
 *    operation: string
 *  }
 * }
 */
const getParameters = () => {
  if ($.verbose === true) console.log('Command line arguments are:', { argv })

  const isSetup = argv.setup === true
  const isBuild = argv.build === true
  const isPostBuild = argv.postbuild === true
  const operation = isSetup ? 'setup' : (isBuild ? 'build' : (isPostBuild ? 'postbuild' : 'NONE'))

  return { isBuild, isPostBuild, isSetup, operation }
}

await main()
