'use strict'

const { rules } = require('eslint-config-airbnb-base/rules/imports')

const noExtraneousDependenciesOptions = rules['import/no-extraneous-dependencies'][1]
noExtraneousDependenciesOptions.devDependencies.push('**/*.spec.js')
noExtraneousDependenciesOptions.optionalDependencies = true

module.exports = {
  extends: [
    'eslint-config-airbnb-base',
    'eslint-config-xo/esnext',
    'eslint-config-concise',
  ].map(require.resolve),
  plugins: ['filenames', 'promise'],
  rules: {
    'filenames/match-exported': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      noExtraneousDependenciesOptions,
    ],
  },
}
