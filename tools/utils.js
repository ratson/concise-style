'use strict'

const path = require('path')

const _ = require('lodash')
const fs = require('mz/fs')
const stringify = require('json-stringify-pretty-compact')

exports.prettifyRule = function prettifyRule(ruleValue) {
  if (Array.isArray(ruleValue)) {
    return [prettifyRule(ruleValue[0]), ..._.drop(ruleValue)]
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

exports.writeJsFile = function writeJsFile(filePath, config) {
  return fs.writeFile(
    path.join(__dirname, '..', filePath),
    `${stringify(config)}\n`,
    'utf8'
  )
}