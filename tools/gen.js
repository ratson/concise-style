'use strict'

const _ = require('lodash')

const loadRules = require('eslint/lib/load-rules')
const Rules = require('eslint/lib/rules')
const eslintRecommended = require('eslint/conf/eslint-recommended')
const shopify = require('eslint-plugin-shopify/lib/config/all')
const ava = require('eslint-plugin-ava')
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
    'eslint-config-ebay',
    'eslint-config-fbjs',
    'eslint-config-google',
    'eslint-config-javascript',
    'eslint-config-jquery',
    'eslint-config-mysticatea',
    'eslint-config-prettier',
    'eslint-config-react-app',
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

  configs['readable-code'] = getEslintConfig(
    require.resolve('readable-code/.eslintrc.yml'),
  )
  configs['eslint-config-canonical-react'] = canonicalReact
  configs['eslint-recommended'] = eslintRecommended
  configs['eslint-plugin-shopify'] = shopify
  configs['eslint-plugin-security'] = security.configs.recommended
  configs['eslint-config-simplifield-backend'] = simplifieldBackend
  configs['eslint-plugin-ava'] = ava.configs.recommended
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

function buildConciseConfig(configs = loadEslintConfigs()) {
  const combinedRules = [
    'eslint-config-jquery',
    'eslint-config-javascript',
    'eslint-config-simplifield',
    'eslint-config-simplifield-backend',
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
        ['eslint-recommended', ['no-bitwise']],
        ['eslint-config-standard', ['no-mixed-operators', 'semi']],
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
            'mysticatea/prefer-for-of',
            'node/no-extraneous-import',
            'node/no-extraneous-require',
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
      }),
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
      ]),
    ),
  }
  return writeJsFile(
    'packages/eslint-config-concise-esnext/eslintrc.json',
    config,
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
      }),
    )
    .reduce((r, rules) => Object.assign(r, rules), {})
  const config = {
    plugins,
    rules: Object.assign(
      combinedRules,
      _.pick(configs['eslint-config-canonical'].rules, [
        'import/no-extraneous-dependencies',
      ]),
    ),
  }
  return writeJsFile(
    'packages/eslint-config-concise-import/eslintrc.json',
    config,
  )
}

function genConciseReact(configs = loadEslintConfigs()) {
  const plugins = ['jsx-a11y', 'react']
  const combinedRules = [
    'eslint-config-react-app',
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
      'react/prop-types',
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

function main() {
  [
    genConcise,
    genConciseAva,
    genConciseEsnext,
    genConciseImport,
    genConciseReact,
  ].forEach(f => f())
}

if (require.main === module) {
  main()
}
