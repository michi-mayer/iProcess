#!/usr/bin/env zx
/**
 * * Generates a CDF data model that can be visualized with the NoSQL Workbench tool from AWS
 * 
 * ? Parameters:
 * ?  - filepath (optional) - if not passed, a new file will be created in $HOME/Documents.
 * ?                          It must use the JSON file extension (.json)
 * 
 * ? Example:
 * ?  zx generate-nosql-workbench-model.mjs --filepath model.json
 */
import { writeFileSync } from 'node:fs'

import { $, argv, echo } from 'zx'
import glob from 'glob'

import { getAppRootPath, parseJSON, getFileName } from './utils.mjs'

const FILES_TO_IGNORE = ['CustomResources.json', 'ConnectionStack.json', 'FunctionDirectiveStack.json']

const main = async () => {
  const { filePath } = getParameters()
  const validFilePath = getValidFilePath(filePath)

  const dataModel = buildDataModel()
  saveDataModel(dataModel, validFilePath)

  echo`File saved to ${validFilePath}`
}

const getParameters = () => {
  const filePath = argv?.filepath || ''

  return {
    filePath: filePath.includes('.json') ? filePath : undefined
  }
}

const getValidFilePath = (filePath) => {
  if (filePath) {
    return filePath
  } else {
    const dateTime = (new Date()).toISOString()
    return `${process.env.HOME}/Documents/data-model-${dateTime}.json`
  }
}

const buildDataModel = () => {
  const result = {
    "AWSTemplateFormatVersion": "2010-09-09",
    "Resources": {}
  }

  const tableDefinitionPaths = getTableDefinitionPaths()

  for (const definitionFilePath of tableDefinitionPaths) {
    const { Resources: table } = parseJSON(definitionFilePath)
    const { tableName, tableKey } = getTableProperties(table, definitionFilePath)

    const GlobalSecondaryIndexes = prepareIndexes(table[tableKey].Properties.GlobalSecondaryIndexes || [])

    result.Resources[tableName] = {
      Type: "AWS::DynamoDB::Table",
      Properties: {
        BillingMode: "PAY_PER_REQUEST",
        TableName: tableName,
        KeySchema: table[tableKey].Properties.KeySchema,
        AttributeDefinitions: table[tableKey].Properties.AttributeDefinitions,
        GlobalSecondaryIndexes
      }
    }
  }

  return result
}

const getTableDefinitionPaths = () => {
  const allDefinitions = glob.sync(`${getAppRootPath()}/amplify/backend/api/erfassungsapp/build/stacks/*.json`)

  return allDefinitions.filter((filePath) => !FILES_TO_IGNORE.includes(getFileName(filePath)))
}

const getTableProperties = (resources, fileName) => {
  const tableKey = Object.keys(resources).find((_) => _.includes('Table'))

  if (!tableKey) {
    throw new Error(`Cannot find a Table key in Resources file ${fileName}`)
  }

  return { tableKey, tableName: tableKey?.replace('Table', '') }
}

const saveDataModel = (dataModel, validFilePath) => {
  writeFileSync(validFilePath, JSON.stringify(dataModel, null, 4), (error) => {
    if (error) {
      throw error
    }

    console.log(`JSON data is saved to ${validFilePath}`)
  })
}

const prepareIndexes = (indexList) => {
  const result = []

  for (const { IndexName, KeySchema, Projection } of indexList) {
    result.push({ IndexName, KeySchema, Projection })
  }

  return result
}

await main()
