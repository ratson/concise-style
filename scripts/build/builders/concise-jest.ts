import _ from 'lodash'
import { BuildConfig } from '../main'

export const outputPath = 'eslint-config-concise-jest/eslintrc.json'

export const build = ({ configs, pkgs }: BuildConfig) => {
  const { plugins } = pkgs['concise-jest']
  const combinedRules = ['eslint-plugin-jest']
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
    env: { jasmine: true, jest: true },
    plugins,
    rules: Object.assign(combinedRules)
  }
}
