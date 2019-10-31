import _ from 'lodash'
import { BuildConfig } from '../main'

export const outputPath = 'eslint-config-concise-flow/eslintrc.json'

export const build = ({ configs, pkgs }: BuildConfig) => {
  const { plugins } = pkgs['concise-flow']
  const combinedRules = ['eslint-plugin-flowtype']
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
    parser: 'babel-eslint',
    plugins,
    rules: Object.assign(
      combinedRules,
      _.pick(configs['eslint-config-standard'].rules, ['spaced-comment'])
    )
  }
}
