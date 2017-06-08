'use strict'

module.exports = {
  parser: require.resolve('babel-eslint'),
  plugins: ['babel'],
  rules: {
    'object-curly-spacing': 'off',
    'babel/object-curly-spacing': ['error', 'always'],
  },
}
