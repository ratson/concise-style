import xoReact from 'eslint-config-xo-react'
import _ from 'lodash'

export const outputPath = 'eslint-config-concise-react/eslintrc.json'

export const build = (configs, pkgs) => {
  const { plugins } = pkgs['concise-react']
  const combinedRules = [
    'eslint-config-react-app',
    'eslint-plugin-shopify',
    'eslint-config-canonical/react',
    'eslint-config-xo-react',
    'eslint-config-airbnb',
  ]
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
  return Object.assign({}, xoReact, {
    plugins,
    rules: Object.assign(
      _.omit(combinedRules, [
        'jsx-a11y/href-no-hash',
        'react/button-has-type',
        'react/destructuring-assignment',
        'react/jsx-curly-spacing',
        'react/jsx-filename-extension',
        'react/jsx-wrap-multilines',
        'react/prop-types',
      ]),
      _.pick(configs['eslint-config-universe'].rules, [
        'react/jsx-one-expression-per-line',
      ]),
      _.pick(configs['eslint-config-react-tools'].rules, [
        'class-methods-use-this',
        'jsx-a11y/anchor-is-valid',
      ]),
    ),
  })
}
