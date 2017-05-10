'use strict'

const _ = require('lodash')
const mysticatea = require('eslint-config-mysticatea/base')

const { writeJsFile } = require('./utils')

module.exports = () => {
  const config = {
    env: {},
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
      ..._.pick(mysticatea.rules, [
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
  return writeJsFile('packages/eslint-config-concise/src/eslintrc.json', config)
}
