import _ from 'lodash'
import xoReact from 'eslint-config-xo-react'
import airbnbReact from 'eslint-config-airbnb/rules/react'

import {prettifyRule, writeJsFile} from './utils'

export default () => {
  const config = Object.assign({}, xoReact, {
    rules: Object.assign(
      {},
      airbnbReact.rules,
      _.mapValues(xoReact.rules, prettifyRule),
      _.pick(airbnbReact.rules, [
        'react/jsx-boolean-value',
        'react/jsx-closing-bracket-location',
        'react/jsx-indent-props',
        'react/jsx-indent',
        'react/jsx-space-before-closing',
      ]),
    ),
  })
  return writeJsFile('packages/eslint-config-concise-react/src/eslintrc.json', config)
}
