import assert from 'assert'
import _ from 'lodash'
import { BuildConfig } from '../main'

export const outputPath = 'eslint-config-concise/eslintrc.json'

export const build = ({ configs, pkgs }: BuildConfig) => {
  const combinedRules = [
    'eslint-plugin-jsdoc',
    'eslint-plugin-unicorn',
    'eslint-config-jquery',
    'eslint-config-javascript',
    'eslint-config-simplifield',
    'eslint-plugin-github',
    'eslint:recommended',
    'eslint-config-standard',
    'eslint-config-videoamp-node',
    'eslint-config-react-app',
    'eslint-config-mysticatea',
    'plugin:shopify/esnext',
    'eslint-config-xo',
    'eslint-config-google',
    'eslint-config-airbnb-base',
  ]
    .map((k) => {
      assert(configs[k], k)
      return configs[k].rules
    })
    .concat(
      [
        [
          'eslint-config-mysticatea',
          [
            'no-unused-vars',
            'implicit-arrow-linebreak',
            'no-bitwise',
            'operator-linebreak',
            'semi-style',
            'strict',
          ],
        ],
        ['eslint-config-standard', ['no-mixed-operators', 'semi']],
        [
          'eslint-config-xo',
          [
            'no-async-promise-executor',
            'no-empty',
            'no-misleading-character-class',
            'require-atomic-updates',
          ],
        ],
        ['eslint:recommended', ['no-bitwise', 'function-paren-newline']],
      ].map(([k, rules]) => _.pick(configs[k as any].rules, rules))
    )
    .reduce((r, rules) => Object.assign(r, rules), {}) as any

  const { plugins } = pkgs.concise
  return {
    ..._.pick(configs['eslint-config-xo'], ['env']),
    parserOptions: _.omit(configs['eslint-plugin-ava'].parserOptions, [
      'sourceType',
    ]),
    plugins,
    rules: Object.assign(
      _.pickBy(combinedRules, (v, k) => {
        if (
          [
            'getter-return',
            'indent-legacy',
            'jsdoc/require-jsdoc',
            'no-underscore-dangle',
            'mysticatea/arrow-parens',
            'mysticatea/no-use-ignored-vars',
            'mysticatea/no-useless-rest-spread',
            'mysticatea/prefer-for-of',
            'node/no-extraneous-import',
            'node/no-extraneous-require',
            'node/no-unsupported-features',
            'promise/always-return',
            'promise/catch-or-return',
            'security/detect-non-literal-fs-filename',
            'security/detect-object-injection',
            'security/detect-possible-timing-attacks',
            'unicorn/custom-error-definition',
            'unicorn/filename-case',
            'unicorn/no-abusive-eslint-disable', // in favor of `eslint-comments/no-unlimited-disable`
            'node/shebang', // false-positive
            'unicorn/prevent-abbreviations',
            'unicorn/prefer-query-selector',
            'unicorn/prefer-event-key',
            'unicorn/prefer-flat-map',
          ].includes(k)
        ) {
          return false
        }
        const parts = _.split(k, '/')
        if (parts.length === 1) {
          return true
        }
        return plugins.includes(parts[0])
      }),
      _.mapValues(
        _.pick(combinedRules, [
          'indent',
          'operator-linebreak',
          'class-methods-use-this',
        ]),
        (v) => ['warn', ...(v as any).slice(1)]
      ),
      {
        'eslint-comments/no-unlimited-disable': 'warn',
        'max-len': [
          'error',
          {
            ...(_.last(combinedRules['max-len']) as object),
            code: 80,
            ignoreComments: true,
            tabWidth: 2,
          },
        ],
        'no-unused-vars': [
          'warn',
          {
            ...(_.last(combinedRules['no-unused-vars']) as object),
            args: 'after-used',
          },
        ],
        'no-param-reassign': _.cloneDeep(
          combinedRules['no-param-reassign']
        ).map((v: any, i: number) => {
          if (i === 1) {
            v.ignorePropertyModificationsFor.push('doc', 't')
            v.ignorePropertyModificationsFor.sort()
          }
          return v
        }),
        'unicorn/no-reduce': 'off',
        'unicorn/no-fn-reference-in-iterator': 'off',
      }
    ),
  }
}
