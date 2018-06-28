import _ from 'lodash'

export const outputPath = 'eslint-config-concise/eslintrc.json'

export const build = (configs, pkgs) => {
  const combinedRules = [
    'eslint-config-jquery',
    'eslint-config-javascript',
    'eslint-config-simplifield',
    'eslint-config-simplifield/backend',
    'eslint/recommended',
    'eslint-config-standard',
    'eslint-config-canonical',
    'eslint-config-videoamp-node',
    'eslint-config-react-app',
    'eslint-config-mysticatea',
    'eslint-plugin-shopify',
    'eslint-config-xo',
    'eslint-config-google',
    'eslint-config-airbnb-base',
  ]
    .map(k => configs[k].rules)
    .concat(
      [
        [
          'eslint-config-mysticatea',
          [
            'no-unused-vars',
            'implicit-arrow-linebreak',
            'operator-linebreak',
            'semi-style',
          ],
        ],
        ['eslint-config-standard', ['no-mixed-operators', 'semi']],
        ['eslint-config-xo', ['arrow-parens', 'no-empty']],
        ['eslint/recommended', ['no-bitwise', 'function-paren-newline']],
      ].map(([k, rules]) => _.pick(configs[k].rules, rules)),
    )
    .reduce((r, rules) => Object.assign(r, rules), {})
  const { plugins } = pkgs.concise
  return {
    parserOptions: {
      ecmaVersion: 2018,
    },
    env: configs['eslint-config-xo'].env,
    plugins,
    rules: Object.assign(
      _.pickBy(combinedRules, (v, k) => {
        if (
          [
            'getter-return',
            'indent-legacy',
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
      {
        'eslint-comments/no-unlimited-disable': 'warn',
        'max-len': [
          'error',
          {
            ..._.last(combinedRules['max-len']),
            code: 80,
            ignoreComments: true,
            tabWidth: 2,
          },
        ],
        'no-param-reassign': _.cloneDeep(
          combinedRules['no-param-reassign'],
        ).map((v, i) => {
          if (i === 1) {
            v.ignorePropertyModificationsFor.push('doc', 't')
            v.ignorePropertyModificationsFor.sort()
          }
          return v
        }),
        'no-unused-vars': ['warn', ...combinedRules['no-unused-vars'].slice(1)],
      },
    ),
  }
}
