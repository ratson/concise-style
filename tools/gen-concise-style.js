import assert from 'assert'

import _ from 'lodash'
import getRuleFinder from 'eslint-find-rules'
import loadRules from 'eslint/lib/load-rules'
import rules from 'eslint/lib/rules'

import {parserOptions} from 'eslint-config-airbnb-base'
import google from 'eslint-config-google'
import standard from 'eslint-config-standard'
import xo from 'eslint-config-xo'

import {writeJsFile} from './utils'

const fixableRules = _.filter(Object.keys(loadRules()), (id) => {
  const r = rules.get(id)
  return r && !r.meta.deprecated && r.meta.fixable
})

function pickRules(rulesObj, keys) {
  keys.forEach((k) => {
    assert.notEqual(rulesObj[k], undefined, `rule "${k}" is missing`)
    assert(fixableRules.includes(k), `rule "${k}" is not fixable`)
  })
  return _.pick(rulesObj, keys)
}

export default () => {
  const airbnb = getRuleFinder(require.resolve('eslint-config-airbnb-base'))

  const config = {
    parserOptions,
    rules: Object.assign(
      pickRules(airbnb.getCurrentRulesDetailed(), fixableRules),
      pickRules(google.rules, ['space-before-function-paren']),
      pickRules(standard.rules, ['semi']),
      pickRules(xo.rules, ['object-curly-spacing']),
    ),
  }

  return writeJsFile('packages/eslint-config-concise-style/src/eslintrc.json', config)
}
