#!/usr/bin/env zx
/**
 * * Checks JS dependencies
 * 
 * ? Example:
 * ?  zx check-dependency-versions.mjs
 */

import fs from "node:fs"
import path from "node:path"

import { $ } from 'zx'
import { parse } from 'csv-parse/sync'

import { getScriptsRootPath, getAppRootPath, getLambdaFunctionDirectories } from "./utils.mjs"

$.verbose = false

const dependenciesFilePath = './assets/dependencies.csv'
const packageWithVersionRegex = /([\d/@A-Za-z-]+)@([\d.a-z-]+)/g

const main = async () => {
  const dependencies = loadDependencies(dependenciesFilePath)
  const lambdas = getLambdaFunctionDirectories()
  lambdas.push(getAppRootPath())

  await Promise.allSettled(lambdas.map(async (_) => await checkPackageDependencies(_, dependencies)))
}

/**
 * 
 * @param {string} dependenciesPath 
 * @returns { { [library: string]: string } }
 */
const loadDependencies = (dependenciesPath) => {
  const fullPath = path.resolve(getScriptsRootPath(), dependenciesPath)
  const fileContent = fs.readFileSync(fullPath, { encoding: 'utf8' })
  const dependencies = parse(fileContent, { columns: true, delimiter: ',', skipEmptyLines: true })
  const result = {}

  for (const { library, version } of dependencies) {
    result[library] = version
  }

  return result
}

/**
 * 
 * @param {string} relativeDirectoryPath 
 * @param { { [library: string]: string } } dependencies 
 * @returns { PromiseLike<void> }
 */
const checkPackageDependencies = async (relativeDirectoryPath, dependencies) => {
  console.log() // ? Adds a new line in the console

  const commandResult = await $`cd ${relativeDirectoryPath} && npm ls --omit dev --depth=0 && cd -`
  // trim, split by newlines, and drop the 1st line (our package@version) and last (current folder)
  const rawPackageList = commandResult.stdout.trim().split('\n').slice(1, -1)

  for (const line of rawPackageList) {
    if (line.trim().length > 0) {
      const matches = [...line.matchAll(packageWithVersionRegex)]

      if (matches.length === 1) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_1, library, version, ..._2] = matches[0]
        const normalizedLibraryName = library.replaceAll('/', '-').replaceAll('@', '')
        const expectedVersion = dependencies[normalizedLibraryName]

        if (!expectedVersion || (expectedVersion !== version)) {
          const packagePath = `${relativeDirectoryPath}package.json`
          const message = [
            `Library version for ${normalizedLibraryName}:${version} in ${packagePath}`,
            `differs from the expected one (${expectedVersion})`
          ].join(' ')

          throw new Error(message)
        }
      } else {
        console.warn(`Discarding line ${line} for regex ${packageWithVersionRegex}: ${matches}`)
      }
    }
  }
}

await main()
