import _ from 'lodash'
import xoReact from 'eslint-config-xo-react'
import airbnbReact from 'eslint-config-airbnb/rules/react'

import {writeJsFile} from './gen-concise-style'

export default () => {
  const config = Object.assign({}, xoReact, {
    rules: Object.assign(
      {},
      airbnbReact.rules,
      xoReact.rules,
      _.pick(airbnbReact.rules, [
        'react/jsx-closing-bracket-location',
        'react/jsx-indent-props',
        'react/jsx-indent',
      ]),
    ),
  })
  return writeJsFile('packages/eslint-config-concise-react/src/eslintrc.json', config)
}
