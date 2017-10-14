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
    .concat([
      'eslint-config-canonical/react',
      ['eslint-plugin-shopify', 'eslint-plugin-shopify/lib/config/all'],
      ['eslint-recommended', 'eslint/conf/eslint-recommended'],
      ['readable-code', 'readable-code/.eslintrc.yml'],
      [
        'eslint-config-simplifield/backend',
        'eslint-config-simplifield/lib/backend',
      ],
    ])
    .map(x => (Array.isArray(x) ? x : [x, x]))
    .reduce(
      (r, [configName, configFile]) =>
        Object.assign(r, {
          [configName]: getEslintConfig(require.resolve(configFile)),
        }),
      {}
    )
  return configs
}
