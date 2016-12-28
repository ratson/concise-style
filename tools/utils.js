import path from 'path'

import _ from 'lodash'
import fs from 'mz/fs'
import stringify from 'json-stringify-pretty-compact'

export function prettifyRule(ruleValue) {
  if (Array.isArray(ruleValue)) {
    return [
      prettifyRule(ruleValue[0]),
      ..._.drop(ruleValue),
    ]
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

export function writeJsFile(filePath, config) {
  return fs.writeFile(path.join(__dirname, '..', filePath), `${stringify(config)}\n`, 'utf8')
}
