import _ from 'lodash'
import xoReact from 'eslint-config-xo-react'
import airbnbReact from 'eslint-config-airbnb/rules/react'

import {writeJsFile} from './gen-concise-style'

function prettifyRule(ruleValue) {
  if (Array.isArray(ruleValue)) {
    return [
      prettifyRule(ruleValue[0]),
      ..._.drop(ruleValue),
    ]
  }
  switch (ruleValue) {
    case 0:
      return 'off'
    case 2:
      return 'error'
    default:
  }
  return ruleValue
}

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
      ]),
    ),
  })
  return writeJsFile('packages/eslint-config-concise-react/src/eslintrc.json', config)
}
