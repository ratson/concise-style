'use strict'

const _ = require('lodash')

const loadRules = require('eslint/lib/load-rules')
const Rules = require('eslint/lib/rules')
const ava = require('eslint-plugin-ava')
const xoReact = require('eslint-config-xo-react')
const security = require('eslint-plugin-security')
const flowtype = require('eslint-plugin-flowtype')
const unicorn = require('eslint-plugin-unicorn')
const jest = require('eslint-plugin-jest')

const { prettifyRule, writeJsFile } = require('../utils')

const loadConfigs = require('./load-configs')

async function loadEslintConfigs() {
  const configs = await loadConfigs()

  configs['eslint-plugin-security'] = security.configs.recommended
  configs['eslint-plugin-ava'] = ava.configs.recommended
  configs['eslint-plugin-flowtype'] = flowtype.configs.recommended
  configs['eslint-plugin-unicorn'] = unicorn.configs.recommended
  configs['eslint-plugin-jest'] = jest.configs.recommended

  const rules = new Rules()
  const deprecatedRules = _.filter(Object.keys(loadRules()), id => {
    const r = rules.get(id)
    return r && r.meta.deprecated
  })
  return _.mapValues(configs, config =>
    Object.assign(config, {
      rules: _.omit(_.mapValues(config.rules, prettifyRule), deprecatedRules),
    })
  )
}

function buildConciseConfig(configs = loadEslintConfigs()) {
  const combinedRules = [
    'eslint-config-jquery',
    'eslint-config-javascript',
    'eslint-config-simplifield',
    'eslint-config-simplifield/backend',
    'eslint-recommended',
    'eslint-config-standard',
    'eslint-config-canonical',
    'eslint-config-videoamp-node',
    'eslint-config-react-app',
    'eslint-config-mysticatea',
    'eslint-plugin-shopify',
    'eslint-config-xo',
    'eslint-config-google',
    'eslint-config-airbnb-base',
  ]
    .map(k => configs[k].rules)
    .concat(
      [
        ['eslint-config-mysticatea', ['comma-dangle', 'semi-style']],
        ['eslint-config-standard', ['no-mixed-operators', 'semi']],
        ['eslint-config-xo', ['arrow-parens']],
        ['eslint-recommended', ['no-bitwise', 'function-paren-newline']],
      ].map(([k, rules]) => _.pick(configs[k].rules, rules))
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
    env: configs['eslint-config-xo'].env,
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
            'mysticatea/no-useless-rest-spread',
            'mysticatea/prefer-for-of',
            'node/no-extraneous-import',
            'node/no-extraneous-require',
            'promise/always-return',
            'promise/catch-or-return',
            'security/detect-non-literal-fs-filename',
            'security/detect-object-injection',
            'security/detect-possible-timing-attacks',
            'unicorn/filename-case',
            'unicorn/no-abusive-eslint-disable', // in favor of `eslint-comments/no-unlimited-disable`
            'node/shebang', // false-positive
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
        'no-param-reassign': combinedRules['no-param-reassign'].map((v, i) => {
          if (i === 1) {
            v.ignorePropertyModificationsFor.push('t')
            v.ignorePropertyModificationsFor.sort()
          }
          return v
        }),
      }
    ),
  }
}

function genConcise(configs) {
  return writeJsFile(
    'packages/eslint-config-concise/eslintrc.json',
    buildConciseConfig(configs)
  )
}

function genConciseAva(configs = loadEslintConfigs()) {
  const plugins = ['ava']
  const combinedRules = [
    'eslint-config-canonical',
    'eslint-plugin-shopify',
    'eslint-plugin-ava',
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
  const config = Object.assign({}, configs['eslint-plugin-ava'], {
    plugins,
    rules: combinedRules,
  })
  return writeJsFile('packages/eslint-config-concise-ava/eslintrc.json', config)
}

function genConciseEsnext(configs = loadEslintConfigs()) {
  const plugins = ['babel']
  const config = {
    parserOptions: configs['eslint-config-standard'].parserOptions,
    plugins,
    rules: Object.assign(
      {
        'babel/object-curly-spacing': ['error', 'always'],
      },
      _.pick(configs['eslint-recommended'].rules, [
        'strict',
        'object-curly-spacing',
      ])
    ),
  }
  return writeJsFile(
    'packages/eslint-config-concise-esnext/eslintrc.json',
    config
  )
}

function genConciseFlow(configs = loadEslintConfigs()) {
  const plugins = ['flowtype']
  const combinedRules = ['eslint-plugin-flowtype']
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
  const config = {
    plugins,
    rules: Object.assign(combinedRules),
  }
  return writeJsFile(
    'packages/eslint-config-concise-flow/eslintrc.json',
    config
  )
}

function genConciseJest(configs = loadEslintConfigs()) {
  const plugins = ['jest']
  const combinedRules = ['eslint-plugin-jest']
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
  const config = {
    env: { jasmine: true, jest: true },
    plugins,
    rules: Object.assign(combinedRules),
  }
  return writeJsFile(
    'packages/eslint-config-concise-jest/eslintrc.json',
    config
  )
}

function genConciseImport(configs = loadEslintConfigs()) {
  const plugins = ['import']
  const combinedRules = ['eslint-config-airbnb-base']
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
  const config = {
    plugins,
    rules: Object.assign(
      combinedRules,
      _.pick(configs['eslint-config-canonical'].rules, [
        'import/no-extraneous-dependencies',
      ])
    ),
  }
  return writeJsFile(
    'packages/eslint-config-concise-import/eslintrc.json',
    config
  )
}

function genConciseReact(configs = loadEslintConfigs()) {
  const plugins = ['jsx-a11y', 'react']
  const combinedRules = [
    'eslint-config-react-app',
    'eslint-plugin-shopify',
    'eslint-config-canonical/react',
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
      'react/jsx-curly-spacing',
      'react/jsx-filename-extension',
      'react/jsx-wrap-multilines',
      'react/prop-types',
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

module.exports = {
  loadEslintConfigs,
  buildConciseConfig,
  genConcise,
  genConciseAva,
  genConciseEsnext,
  genConciseImport,
  genConciseReact,
  genConciseStyle,
}

async function main() {
  const configs = await loadEslintConfigs()
  return Promise.all(
    [
      genConcise,
      genConciseAva,
      genConciseEsnext,
      genConciseFlow,
      genConciseImport,
      genConciseJest,
      genConciseReact,
    ].map(f => f(configs))
  )
}

if (require.main === module) {
  main()
}
