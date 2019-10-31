import _ from 'lodash'
import { BuildConfig } from '../main'

export const outputPath = 'eslint-config-concise-ava/eslintrc.json'

export const build = ({ configs, pkgs }: BuildConfig) => {
  const { plugins } = pkgs['concise-ava']
  const combinedRules = [
    'eslint-config-canonical',
    'plugin:shopify/esnext',
    'eslint-plugin-ava'
  ]
    .map(configKey =>
      _.pickBy(configs[configKey].rules, (v, k) => {
        const parts = _.split(k, '/')
        if (parts.length === 1) {
          return false
        }
        return plugins.includes(parts[0])
      })
    )
    .reduce((r, rules) => Object.assign(r, rules), {})
  return {
    ...configs['eslint-plugin-ava'],
    plugins,
    rules: combinedRules
  }
}
