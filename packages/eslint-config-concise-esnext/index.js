'use strict'

const config = require('./eslintrc.json')

module.exports = Object.assign(
  {
    parser: require.resolve('babel-eslint'),
  },
  config
)
