'use strict'

const _ = require('lodash')
const readPkgUp = require('read-pkg-up')

const { getEslintConfig } = require('../utils')

module.exports = async () => {
  const { pkg: { devDependencies } } = await readPkgUp(__dirname)
  const configs = Object.keys(devDependencies)
    .filter(
      dep =>
        _.startsWith(dep, 'eslint-config-') &&
        ![
          'eslint-config-anvilabs',
          'eslint-config-logux',
          'eslint-config-majestic',
        ].includes(dep)
    )
    .reduce((r, configFile) => {
      const config = getEslintConfig(configFile)
      return Object.assign(r, {
        [configFile]: config,
      })
    }, {})
  return configs
}
