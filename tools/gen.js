'use strict'

const assert = require('assert')

const _ = require('lodash')
const getRuleFinder = require('eslint-find-rules')
const loadRules = require('eslint/lib/load-rules')
const Rules = require('eslint/lib/rules')

const { parserOptions } = require('eslint-config-airbnb-base')
const airbnbReact = require('eslint-config-airbnb/rules/react')
const google = require('eslint-config-google')
const mysticatea = require('eslint-config-mysticatea/base')
const prettierReact = require('eslint-config-prettier/react')
const standard = require('eslint-config-standard')
const xo = require('eslint-config-xo')
const xoReact = require('eslint-config-xo-react')

const { prettifyRule, writeJsFile } = require('./utils')

const rules = new Rules()

const fixableRules = _.filter(Object.keys(loadRules()), id => {
  const r = rules.get(id)
  return r && !r.meta.deprecated && r.meta.fixable
})

function pickRules(rulesObj, keys) {
  keys.forEach(k => {
    // assert.notEqual(rulesObj[k], undefined, `rule "${k}" is missing`)
    assert(fixableRules.includes(k), `rule "${k}" is not fixable`)
  })
  return _.pick(rulesObj, keys)
}

function buildFixableRules() {
  const airbnbRuleFinder = getRuleFinder(
    require.resolve('eslint-config-airbnb-base')
  )
  return Object.assign(
    pickRules(airbnbRuleFinder.getCurrentRulesDetailed(), fixableRules),
    pickRules(google.rules, ['space-before-function-paren']),
    pickRules(standard.rules, ['semi']),
    pickRules(xo.rules, ['arrow-parens']),
    {
      'comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'ignore',
        },
      ],
    }
  )
}

function buildConciseConfig() {
  return {
    env: {},
    // parserOptions,
    extends: ['eslint:recommended', 'plugin:node/recommended'],
    globals: {},
    plugins: [
      'eslint-comments',
      'html',
      'markdown',
      'mysticatea',
      'node',
      'promise',
    ],
    rules: Object.assign(
      buildFixableRules(),
      _.pick(mysticatea.rules, [
        'eslint-comments/no-unlimited-disable',
        'mysticatea/no-instanceof-array',
        'mysticatea/no-instanceof-wrapper',
      ]),
      {
        'node/no-unpublished-require': 'off',
        'node/no-unsupported-features': 'off',
        'promise/param-names': 'error',
        // false-positive
        'node/shebang': 'off',
      }
    ),
  }
}

function genConcise() {
  return writeJsFile(
    'packages/eslint-config-concise/eslintrc.json',
    buildConciseConfig()
  )
}

function genConciseReact() {
  const config = Object.assign({}, xoReact, {
    rules: Object.assign(
      {},
      airbnbReact.rules,
      _.mapValues(xoReact.rules, prettifyRule),
      _.pick(airbnbReact.rules, [
        'react/jsx-boolean-value',
        'react/jsx-closing-bracket-location',
        'react/jsx-indent-props',
        'react/jsx-indent',
        'react/jsx-space-before-closing',
        'react/jsx-tag-spacing',
      ]),
      _.pick(prettierReact.rules, ['react/jsx-wrap-multilines']),
      {
        'react/jsx-filename-extension': 'off',
      }
    ),
  })
  return writeJsFile(
    'packages/eslint-config-concise-react/eslintrc.json',
    config
  )
}

function genConciseStyle() {
  const config = {
    parserOptions,
    rules: buildFixableRules(),
  }
  return writeJsFile(
    'packages/eslint-config-concise-style/eslintrc.json',
    config
  )
}

async function printRule() {
  /* eslint-disable no-console */
  const rule = _.last(process.argv.slice(2))
  console.log(rule)
  _.forEach([mysticatea, xo, standard, google, buildConciseConfig()], config =>
    console.log(_.get(config, ['rules', rule]))
  )
  /* eslint-enable no-console */
}

module.exports = {
  genConcise,
  genConciseReact,
  genConciseStyle,
  printRule,
}
