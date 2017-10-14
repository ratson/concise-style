'use strict'

const _ = require('lodash')
const readPkgUp = require('read-pkg-up')

const loadRules = require('eslint/lib/load-rules')
const Rules = require('eslint/lib/rules')

const { getEslintConfig, prettifyRule } = require('../utils')

const loadDeprecatedRules = () => {
  const rules = new Rules()
  return Object.keys(loadRules()).filter(id => {
    const r = rules.get(id)
    return r && r.meta.deprecated
  })
}

module.exports = async () => {
  const { pkg: { devDependencies } } = await readPkgUp(__dirname)
  const configs = Object.keys(devDependencies)
    .filter(
      dep =>
        _.startsWith(dep, 'eslint-plugin-') &&
        !['eslint-plugin-local'].includes(dep)
    )
    .reduce(
      (acc, configName) =>
        Object.assign(acc, {
          // eslint-disable-next-line max-len
          // eslint-disable-next-line global-require,security/detect-non-literal-require
          [configName]: _.get(require(configName), 'configs.recommended'),
        }),
      {}
    )

  Object.keys(devDependencies)
    .filter(
      dep =>
        _.startsWith(dep, 'eslint-config-') &&
        ![
          'eslint-config-anvilabs',
          'eslint-config-get-off-my-lawn',
          'eslint-config-logux',
          'eslint-config-majestic',
        ].includes(dep)
    )
    .concat([
      'eslint-config-anvilabs/jest',
      'eslint-config-canonical/jest',
      'eslint-config-canonical/react',
      'eslint-config-umbrellio/jest',
      ['eslint-plugin-shopify', 'eslint-plugin-shopify/lib/config/all'],
      ['eslint/recommended', 'eslint/conf/eslint-recommended'],
      ['readable-code', 'readable-code/.eslintrc.yml'],
      [
        'eslint-config-simplifield/backend',
        'eslint-config-simplifield/lib/backend',
      ],
    ])
    .map(x => (Array.isArray(x) ? x : [x, x]))
    .reduce(
      (acc, [configName, configFile]) =>
        Object.assign(acc, {
          [configName]: getEslintConfig(require.resolve(configFile)),
        }),
      configs
    )

  const deprecatedRules = loadDeprecatedRules()

  return _.mapValues(_.omitBy(configs, _.isUndefined), config =>
    Object.assign(config, {
      rules: _.omit(_.mapValues(config.rules, prettifyRule), deprecatedRules),
    })
  )
}

module.exports.loadDeprecatedRules = loadDeprecatedRules
