import _ from 'lodash'

export const outputPath = 'eslint-config-concise-import/eslintrc.json'

export const build = (configs, pkgs) => {
  const { plugins } = pkgs['concise-import']
  const combinedRules = ['eslint-config-airbnb-base']
    .map(configKey =>
      _.pickBy(configs[configKey].rules, (v, k) => {
        const parts = _.split(k, '/')
        if (parts.length === 1) {
          return false
        }
        return plugins.includes(parts[0])
      }),
    )
    .reduce((r, rules) => Object.assign(r, rules), {})
  return {
    plugins,
    rules: {
      ...combinedRules,
      ..._.pick(configs['eslint-config-canonical'].rules, [
        'import/no-extraneous-dependencies',
        'import/prefer-default-export',
      ]),
      'import/extensions': [
        'error',
        'always',
        { js: 'never', jsx: 'never', mjs: 'never' },
      ],
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'ignore',
        },
      ],
    },
  }
}
