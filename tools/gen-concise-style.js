'use strict'

const assert = require('assert')

const _ = require('lodash')
const getRuleFinder = require('eslint-find-rules')
const loadRules = require('eslint/lib/load-rules')
const rules = require('eslint/lib/rules')

const { parserOptions } = require('eslint-config-airbnb-base')
const google = require('eslint-config-google')
const standard = require('eslint-config-standard')
const xo = require('eslint-config-xo')

const { writeJsFile } = require('./utils')

const fixableRules = _.filter(Object.keys(loadRules()), id => {
  const r = rules.get(id)
  return r && !r.meta.deprecated && r.meta.fixable
})

function pickRules(rulesObj, keys) {
  keys.forEach(k => {
    assert.notEqual(rulesObj[k], undefined, `rule "${k}" is missing`)
    assert(fixableRules.includes(k), `rule "${k}" is not fixable`)
  })
  return _.pick(rulesObj, keys)
}

module.exports = () => {
  const airbnb = getRuleFinder(require.resolve('eslint-config-airbnb-base'))

  const config = {
    parserOptions,
    rules: Object.assign(
      pickRules(airbnb.getCurrentRulesDetailed(), fixableRules),
      pickRules(google.rules, ['space-before-function-paren']),
      pickRules(standard.rules, ['semi']),
      pickRules(xo.rules, ['object-curly-spacing'])
    ),
  }

  return writeJsFile(
    'packages/eslint-config-concise-style/src/eslintrc.json',
    config
  )
}
