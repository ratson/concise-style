import {rules as errorsRules} from 'eslint-config-airbnb-base/rules/errors'
import {rules as styleRules} from 'eslint-config-airbnb-base/rules/style'

const {indent} = styleRules

module.exports = {
  extends: [
    'airbnb-base',
    'xo/esnext',
  ],
  plugins: ['filenames'],
  rules: {
    'comma-dangle': errorsRules['comma-dangle'],
    'filenames/match-exported': 'error',
    'semi': ['error', 'never'],
    'xo/filename-case': 'off',
    indent,
  },
}
