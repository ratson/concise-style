import {rules as errorsRules} from 'eslint-config-airbnb-base/rules/errors'
import {rules as styleRules} from 'eslint-config-airbnb-base/rules/style'

const {indent} = styleRules

module.exports = {
  extends: [
    'eslint-config-airbnb-base',
    'eslint-config-xo/esnext',
  ].map(require.resolve),
  plugins: [
    'filenames',
    'promise',
  ],
  rules: {
    'comma-dangle': errorsRules['comma-dangle'],
    'filenames/match-exported': 'error',
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        '**/*.spec.js',
        '**/*.test.js',
        '**/gulpfile.babel.js',
        '**/gulpfile.js',
        '**/test/*.js',
      ],
      optionalDependencies: false,
    }],
    'promise/param-names': 'error',
    'unicorn/filename-case': 'off',
    indent,
    semi: ['error', 'never'],
  },
}
