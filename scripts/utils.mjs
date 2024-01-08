import path from "node:path"
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import glob from 'glob'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const ROOT_DIRECTORY = `${__dirname}/..`
const LAMBDA_LAYER_DIRECTORY = `${ROOT_DIRECTORY}/amplify/backend/function/iProcessLambdaShared/opt/iprocess-shared`
const LAMBDA_LAYER_BUNDLED_PACKAGES = `${ROOT_DIRECTORY}/amplify/backend/function/iProcessLambdaShared/lib/nodejs`

export const getScriptsRootPath = () => __dirname
export const getAppRootPath = () => ROOT_DIRECTORY
export const getLambdaLayerPath = () => LAMBDA_LAYER_DIRECTORY
export const getLambdaPackagesPath = () => LAMBDA_LAYER_BUNDLED_PACKAGES

/**
 * @param { string } filePath
 * @returns { Record<string, any> }
 */
export const parseJSON = (filePath) => JSON.parse(readFileSync(filePath))

/**
 * @param { string } filePath
 * @returns { string }
 */
export const getFileName = (filePath) => filePath.split('/').slice(-1)[0]

/**
 * @param { { onlyTypeScript: boolean, includeLayers: boolean } }
 * @returns { string[] }
 */
export const getLambdaFunctionDirectories = ({ onlyTypeScript = false, includeLayers = true }) => {
  let lambdas = glob.sync(`${ROOT_DIRECTORY}/amplify/backend/function/*/src`)

  if (includeLayers) {
    lambdas = [getLambdaLayerPath(), ...lambdas]
  }

  return onlyTypeScript ? lambdas.filter((_) => isTypeScriptLambda(_)) : lambdas
}

/**
 * @param {string} lambdaDirectory 
 * @returns { boolean }
 */
const isTypeScriptLambda = (lambdaDirectory) => glob.sync(`${lambdaDirectory}/tsconfig.json`).length > 0
