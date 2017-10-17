'use strict'

const _ = require('lodash')

module.exports.isEslintPlugin = pkgName =>
  _.startsWith(pkgName, 'eslint-plugin-')
