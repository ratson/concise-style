import Bluebird from 'bluebird'
import loadRules from 'eslint/lib/load-rules'
import Rules from 'eslint/lib/rules'
import esmeta from 'esmeta'
import _ from 'lodash'
import fp from 'lodash/fp'
import pkg from '../../package.json'
import { getEslintConfig, isEslintPlugin, prettifyRule } from './utils'

const importMeta = esmeta(import.meta)

export const loadDeprecatedRules = () => {
  const rules = new Rules()
  return Object.keys(loadRules()).filter(ruleId => {
    const r = rules.get(ruleId)
    return r && r.meta.deprecated
  })
}

export default async () => {
  const { devDependencies } = pkg

  const configs = await Bluebird.reduce(
    Object.keys(devDependencies).filter(
      dep => isEslintPlugin(dep) && !['eslint-plugin-local'].includes(dep),
    ),
    async (acc, configName) => {
      const recommendedConfig = fp.get(
        'default.configs.recommended',
        await import(configName),
      )
      return {
        ...acc,
        [configName]: recommendedConfig,
      }
    },
    {},
  )

  Object.keys(devDependencies)
    .filter(
      dep =>
        _.startsWith(dep, 'eslint-config-') &&
        ![
          '@anvilabs/eslint-config',
          'eslint-config-get-off-my-lawn',
          'eslint-config-logux',
          'eslint-config-majestic',
        ].includes(dep),
    )
    .concat([
      '@anvilabs/eslint-config/jest',
      'eslint-config-canonical/jest',
      'eslint-config-canonical/react',
      'eslint-config-umbrellio/jest',
      ['eslint-plugin-shopify', 'eslint-plugin-shopify/lib/config/esnext'],
      ['eslint/recommended', 'eslint/conf/eslint-recommended'],
      [
        'eslint-config-simplifield/backend',
        'eslint-config-simplifield/lib/backend',
      ],
    ])
    .map(x => (Array.isArray(x) ? x : [x, x]))
    .reduce(
      (acc, [configName, configFile]) =>
        Object.assign(acc, {
          [configName]: getEslintConfig(importMeta.resolve(configFile)),
        }),
      configs,
    )

  const deprecatedRules = loadDeprecatedRules()

  return _.mapValues(_.omitBy(configs, fp.isUndefined), config => {
    const rules = _.omit(
      _.mapValues(config.rules, prettifyRule),
      deprecatedRules,
    )
    return {
      ...config,
      rules,
    }
  })
}
