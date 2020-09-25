'use strict'

const config = require('./eslintrc.json')

module.exports = {
  ...config,
  parser: require.resolve('@typescript-eslint/parser'),
}
