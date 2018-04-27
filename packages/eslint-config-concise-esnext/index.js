'use strict'

const config = require('./eslintrc.json')

module.exports = Object.assign({}, config, {
  parser: require.resolve('babel-eslint'),
})
