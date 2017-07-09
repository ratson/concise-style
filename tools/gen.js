'use strict'

const _ = require('lodash')
const stringify = require('json-stringify-deterministic')

const eslintRecommended = require('eslint/conf/eslint-recommended')
const shopify = require('eslint-plugin-shopify/lib/config/all')
const xoReact = require('eslint-config-xo-react')
const canonicalReact = require('eslint-config-canonical/react')

const { getEslintConfig, prettifyRule, writeJsFile } = require('./utils')

function loadEslintConfigs() {
  const configs = [
    'eslint-config-airbnb-base',
    'eslint-config-airbnb',
    'eslint-config-canonical',
    'eslint-config-google',
    'eslint-config-mysticatea',
    'eslint-config-prettier',
    'eslint-config-standard',
    'eslint-config-xo-react',
    'eslint-config-xo',
  ].reduce((r, configFile) => {
    const config = getEslintConfig(configFile)
    return Object.assign(r, {
      [configFile]: config,
    })
  }, {})
  configs['eslint-config-canonical-react'] = canonicalReact
  configs['eslint-recommended'] = eslintRecommended
  configs['eslint-plugin-shopify'] = shopify
  return _.mapValues(configs, config =>
    Object.assign(config, {
      rules: _.mapValues(config.rules, prettifyRule),
    })
  )
}

function buildConciseConfig() {
  const configs = loadEslintConfigs()
  const combinedRules = [
    'eslint-recommended',
    'eslint-config-standard',
    'eslint-config-canonical',
    'eslint-config-mysticatea',
    'eslint-plugin-shopify',
    'eslint-config-xo',
    'eslint-config-google',
    'eslint-config-airbnb-base',
  ]
    .map(k => configs[k].rules)
    .concat(
      [['eslint-config-standard', ['semi']]].map(([k, rules]) =>
        _.pick(configs[k].rules, rules)
      )
    )
    .reduce((r, rules) => Object.assign(r, rules), {})
  const plugins = [
    'eslint-comments',
    'html',
    'markdown',
    'mysticatea',
    'node',
    'promise',
  ]
  return {
    parserOptions: {
      ecmaVersion: 8,
    },
    env: {
      es6: true,
      node: true,
    },
    plugins,
    rules: Object.assign(
      _.pickBy(combinedRules, (v, k) => {
        if (
          [
            'getter-return',
            'indent-legacy',
            'mysticatea/arrow-parens',
            'mysticatea/no-use-ignored-vars',
            // false-positive
            'node/shebang',
          ].includes(k)
        ) {
          return false
        }
        const parts = _.split(k, '/')
        if (parts.length === 1) {
          return true
        }
        return plugins.includes(parts[0])
      }),
      {
        'comma-dangle': [
          'error',
          Object.assign(_.last(combinedRules['comma-dangle']), {
            functions: 'ignore',
          }),
        ],
        'max-len': [
          'error',
          Object.assign(_.last(combinedRules['max-len']), {
            code: 80,
            tabWidth: 2,
          }),
        ],
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
  const configs = loadEslintConfigs()
  const plugins = ['jsx-a11y', 'react']
  const combinedRules = [
    'eslint-plugin-shopify',
    'eslint-config-canonical-react',
    'eslint-config-xo-react',
    'eslint-config-airbnb',
  ]
    .map(configKey =>
      _.pickBy(configs[configKey].rules, (v, k) => {
        const parts = _.split(k, '/')
        if (parts.length === 1) {
          return false
        }
        return plugins.includes(parts[0])
      })
    )
    .reduce((r, rules) => Object.assign(r, rules), {})
  const config = Object.assign({}, xoReact, {
    plugins,
    rules: _.omit(combinedRules, [
      'jsx-a11y/href-no-hash',
      'react/jsx-filename-extension',
      'react/jsx-wrap-multilines',
    ]),
  })
  return writeJsFile(
    'packages/eslint-config-concise-react/eslintrc.json',
    config
  )
}

async function genConciseStyle() {
  // TODO
}

async function printRule() {
  const configs = loadEslintConfigs()
  /* eslint-disable no-console */
  const rule = _.last(process.argv.slice(2))
  const named = _.mapValues(
    Object.assign({}, configs, {
      concise: buildConciseConfig(),
    }),
    (v, k) => Object.assign(v, { name: k })
  )
  const grouped = _.groupBy(_.values(named), config =>
    stringify(_.get(config, ['rules', rule]))
  )
  _.forEach(grouped, (config, ruleValue) => {
    console.log(rule, '=', ruleValue)
    console.log(_.map(config, 'name'))
    console.log()
  })
  /* eslint-enable no-console */
}

module.exports = {
  genConcise,
  genConciseReact,
  genConciseStyle,
  printRule,
}
