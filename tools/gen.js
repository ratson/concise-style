'use strict'

const _ = require('lodash')
const stringify = require('json-stringify-deterministic')

const loadRules = require('eslint/lib/load-rules')
const Rules = require('eslint/lib/rules')
const eslintRecommended = require('eslint/conf/eslint-recommended')
const shopify = require('eslint-plugin-shopify/lib/config/all')
const xoReact = require('eslint-config-xo-react')
const canonicalReact = require('eslint-config-canonical/react')
const security = require('eslint-plugin-security')
const simplifieldBackend = require('eslint-config-simplifield/lib/backend')
const unicorn = require('eslint-plugin-unicorn')

const { getEslintConfig, prettifyRule, writeJsFile } = require('./utils')

function loadEslintConfigs() {
  const configs = [
    'eslint-config-airbnb-base',
    'eslint-config-airbnb',
    'eslint-config-canonical',
    'eslint-config-google',
    'eslint-config-mysticatea',
    'eslint-config-prettier',
    'eslint-config-simplifield',
    'eslint-config-standard',
    'eslint-config-videoamp-node',
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
  configs['eslint-plugin-security'] = security.configs.recommended
  configs['eslint-config-simplifield-backend'] = simplifieldBackend
  configs['eslint-plugin-unicorn'] = unicorn.configs.recommended

  const rules = new Rules()
  const deprecatedRules = _.filter(Object.keys(loadRules()), id => {
    const r = rules.get(id)
    return r && r.meta.deprecated
  })
  return _.mapValues(configs, config =>
    Object.assign(config, {
      rules: _.omit(_.mapValues(config.rules, prettifyRule), deprecatedRules),
    }),
  )
}

function buildConciseConfig() {
  const configs = loadEslintConfigs()
  const combinedRules = [
    'eslint-config-simplifield',
    'eslint-config-simplifield-backend',
    'eslint-recommended',
    'eslint-config-standard',
    'eslint-config-canonical',
    'eslint-config-videoamp-node',
    'eslint-config-mysticatea',
    'eslint-plugin-shopify',
    'eslint-config-xo',
    'eslint-config-google',
    'eslint-config-airbnb-base',
  ]
    .map(k => configs[k].rules)
    .concat(
      [
        ['eslint-config-standard', ['semi']],
        ['eslint-config-xo', ['arrow-parens']],
      ].map(([k, rules]) => _.pick(configs[k].rules, rules)),
    )
    .reduce((r, rules) => Object.assign(r, rules), {})
  const plugins = [
    'eslint-comments',
    'html',
    'jsdoc',
    'markdown',
    'mysticatea',
    'node',
    'promise',
    'security',
    'unicorn',
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
            'no-underscore-dangle',
            'mysticatea/arrow-parens',
            'mysticatea/no-use-ignored-vars',
            'mysticatea/prefer-for-of',
            'node/no-extraneous-import',
            'node/no-extraneous-require',
            'security/detect-non-literal-fs-filename',
            'security/detect-object-injection',
            'security/detect-possible-timing-attacks',
            'unicorn/filename-case',
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
        'max-len': [
          'error',
          Object.assign(_.last(combinedRules['max-len']), {
            code: 80,
            tabWidth: 2,
          }),
        ],
      },
    ),
  }
}

function genConcise() {
  return writeJsFile(
    'packages/eslint-config-concise/eslintrc.json',
    buildConciseConfig(),
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
      }),
    )
    .reduce((r, rules) => Object.assign(r, rules), {})
  const config = Object.assign({}, xoReact, {
    plugins,
    rules: _.omit(combinedRules, [
      'jsx-a11y/href-no-hash',
      'react/jsx-curly-spacing',
      'react/jsx-filename-extension',
      'react/jsx-wrap-multilines',
    ]),
  })
  return writeJsFile(
    'packages/eslint-config-concise-react/eslintrc.json',
    config,
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
    (v, k) => Object.assign(v, { name: k }),
  )
  const grouped = _.groupBy(_.values(named), config =>
    stringify(_.get(config, ['rules', rule])),
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
