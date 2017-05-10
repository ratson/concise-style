'use strict'

const _ = require('lodash')
const xoReact = require('eslint-config-xo-react')
const airbnbReact = require('eslint-config-airbnb/rules/react')

const { prettifyRule, writeJsFile } = require('./utils')

module.exports = () => {
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
      ])
    ),
  })
  return writeJsFile(
    'packages/eslint-config-concise-react/src/eslintrc.json',
    config
  )
}
