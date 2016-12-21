import _ from 'lodash'
import getRuleFinder from 'eslint-find-rules'
import airbnbReact from 'eslint-config-airbnb/rules/react'

import {writeJsFile} from './gen-concise-style'

export default () => {
  const xoReact = getRuleFinder(require.resolve('eslint-config-xo-react/space'))

  const config = {
    rules: Object.assign(
      xoReact.getCurrentRulesDetailed(),
      _.pick(airbnbReact.rules, ['react/jsx-closing-bracket-location']),
    ),
  }
  return writeJsFile('packages/eslint-config-concise-react/src/eslintrc.json', config)
}
