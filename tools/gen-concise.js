import _ from 'lodash'
import mysticatea from 'eslint-config-mysticatea/base'

import {writeJsFile} from './utils'

export default () => {
  const config = {
    rules: {
      ..._.pick(mysticatea.rules, [
        'eslint-comments/no-unlimited-disable',
        'mysticatea/no-instanceof-array',
        'mysticatea/no-instanceof-wrapper',
      ]),
      'node/no-unpublished-require': 'off',
      'node/no-unsupported-features': 'off',
      'promise/param-names': 'error',
      // false-positive
      'node/shebang': 'off',
    },
  }
  return writeJsFile('packages/eslint-config-concise/src/eslintrc.json', config)
}
