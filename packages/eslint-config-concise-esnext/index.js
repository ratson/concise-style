'use strict'

module.exports = {
  parser: require.resolve('babel-eslint'),
  plugins: ['babel'],
  rules: {
    strict: 'off',
    'object-curly-spacing': 'off',
    'babel/object-curly-spacing': ['error', 'always'],
  },
}
