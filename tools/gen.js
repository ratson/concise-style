'use strict'

const _ = require('lodash')
const stringify = require('json-stringify-deterministic')

const airbnbReact = require('eslint-config-airbnb/rules/react')
const prettierReact = require('eslint-config-prettier/react')
const shopify = require('eslint-plugin-shopify/lib/config/all')
const xoReact = require('eslint-config-xo-react')

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
    extends: ['eslint:recommended'],
    globals: {},
    plugins,
    rules: Object.assign(
      _.pickBy(combinedRules, (v, k) => {
        if (
          [
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
