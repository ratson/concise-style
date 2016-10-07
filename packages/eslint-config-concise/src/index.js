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
    'promise/param-names': 'error',
    'semi': ['error', 'never'],
    'xo/filename-case': 'off',
    indent,
  },
}
