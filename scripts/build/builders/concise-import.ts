import _ from 'lodash'
import { BuildConfig } from '../main'

export const outputPath = 'eslint-config-concise-import/eslintrc.json'

export const build = ({ configs, pkgs }: BuildConfig) => {
  const { plugins } = pkgs['concise-import']
  const combinedRules = ['eslint-config-airbnb-base']
    .map(configKey => configs[configKey].rules)
    .map(rules =>
      _.pickBy(rules, (v, k) => {
        const parts = _.split(k, '/')
        if (parts.length === 1) {
          return false
        }
        return plugins.includes(parts[0])
      })
    )
    .reduce((r, rules) => Object.assign(r, rules), {})
  return {
    plugins,
    rules: {
      ...combinedRules,
      // ..._.pick(configs['eslint-config-canonical'].rules, [
      //   'import/no-extraneous-dependencies',
      //   'import/prefer-default-export'
      // ]),
      'import/extensions': [
        'error',
        'always',
        { js: 'never', jsx: 'never', mjs: 'never' }
      ],
      'import/no-cycle': ['error', { maxDepth: 1 }],
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index'
          ],
          'newlines-between': 'ignore'
        }
      ]
    }
  }
}
