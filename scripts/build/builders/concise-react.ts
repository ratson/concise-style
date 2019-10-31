// @ts-ignore
import xoReact from 'eslint-config-xo-react'
import _ from 'lodash'
import { BuildConfig } from '../main'

export const outputPath = 'eslint-config-concise-react/eslintrc.json'

export const build = ({ configs, pkgs }: BuildConfig) => {
  const { plugins } = pkgs['concise-react']
  const combinedRules = [
    'eslint-config-react-app',
    'plugin:shopify/esnext',
    'eslint-config-canonical/react',
    'eslint-config-xo-react',
    'eslint-config-airbnb'
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
    ...xoReact,
    plugins,
    rules: Object.assign(
      _.omit(combinedRules, [
        'jsx-a11y/href-no-hash',
        'react/button-has-type',
        'react/destructuring-assignment',
        'react/jsx-filename-extension',
        'react/jsx-wrap-multilines',
        'react/prop-types',
        // invalid rules
        'react/default-props-match-prop-types ',
        'react/react/jsx-closing-tag-location',
        'react/react/no-redundant-should-component-update'
      ]),
      _.pick(configs['eslint-config-universe'].rules, [
        'react/jsx-one-expression-per-line'
      ]),
      _.pick(configs['eslint-config-readable'].rules, [
        'react/jsx-curly-spacing',
        'react/no-unsafe',
        'react/no-unused-state'
      ]),
      _.pick(configs['eslint-config-react-tools'].rules, [
        'class-methods-use-this',
        'jsx-a11y/anchor-is-valid'
      ]),
      _.mapValues(_.pick(combinedRules, ['react/jsx-indent']), v => [
        'warn',
        ...(v as any).slice(1)
      ]),
      { 'react-hooks/rules-of-hooks': 'error' }
    )
  }
}
