'use strict'

const path = require('path')

const { CLIEngine } = require('eslint')
const _ = require('lodash')
const fs = require('mz/fs')
const prettier = require('prettier')
const stringify = require('json-stringify-deterministic')

module.exports.getEslintConfig = function getEslintConfig(configFile) {
  const cliEngine = new CLIEngine({
    useEslintrc: false,
    configFile,
  })
  return cliEngine.getConfigForFile()
}

module.exports.prettifyRule = function prettifyRule(ruleValue) {
  if (Array.isArray(ruleValue)) {
    const rule = [prettifyRule(ruleValue[0]), ..._.drop(ruleValue)]
    if (rule.length === 1) {
      return rule[0]
    }
    return rule
  }
  switch (ruleValue) {
    case 0:
      return 'off'
    case 2:
      return 'error'
    default:
  }
  return ruleValue
}

module.exports.writeJsFile = function writeJsFile(filePath, config) {
  const source = prettier.format(stringify(config), { parser: 'json' })
  return fs.writeFile(
    path.join(__dirname, '..', filePath),
    `${source}\n`,
    'utf8',
  )
}
