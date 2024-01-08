#!/usr/bin/env zx
/**
 * * Bootstraps a Python environment
 * 
 * ? Example:
 * ?  zx python-environment.mjs
 */

import { $, chalk } from 'zx'

$.verbose = false

const MINIMUM_PYTHON_VERSION = { major: 3, minor: 8, patch: 0 }

const main = async () => {
  await checkRequirements()

  console.log('Starting to set up your new Python environment')
  await setupPythonEnvironment('dynamodb/requirements.txt')
  await tearDownPythonEnvironment({ warnOnly: true })
}

const setupPythonEnvironment = async (requirementsFilePath) => {
  await $`cd scripts && python -m venv .venv && source .venv/bin/activate && pip install -r ${requirementsFilePath}`
  
  const workingDirectory = (await $`pwd`).stdout.trim()
  console.log(`Please run ${chalk.bgCyan(`source ${workingDirectory}/scripts/.venv/bin/activate`)}`)
  console.log('This command will enable your brand-new Python environment')

  await $`cd ..`
}

const tearDownPythonEnvironment = async ({ warnOnly = false }) => {
  if (warnOnly) {
    console.warn('To teardown the setup Python version, run "deactivate"')
  } else {
    await $`deactivate`
  }
}

const versionToString = ({ major, minor, patch }) => `${major}.${minor}.${patch}`

const checkRequirements = async () => {
  const pythonVersion = await getPythonVersion()

  console.log(`The minimum required Python version is ${versionToString(MINIMUM_PYTHON_VERSION)}`)
  console.log(`Your current Python version is ${versionToString(pythonVersion)}`)

  const isPythonOK = pythonVersion.major >= MINIMUM_PYTHON_VERSION.major &&
    pythonVersion.minor >= MINIMUM_PYTHON_VERSION.minor &&
    pythonVersion.patch >= pythonVersion.patch

  return isPythonOK
}

const getPythonVersion = async () => {
  const pythonVersion = (await $`python3 -c "import platform; print(platform.python_version())"`).stdout.trim().split('.')
  return { major: pythonVersion[0], minor: pythonVersion[1], patch: pythonVersion[2] }
}

await main()
