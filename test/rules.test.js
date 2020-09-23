import test from 'ava'

import { buildLinter } from './_utils'

const conciseConfigFile = require.resolve('../packages/eslint-config-concise')

test('unused vars', (t) => {
  const linter = buildLinter(conciseConfigFile)
  const { messages } = linter.executeOnText(
    "'use strict'\n\nconst a = 1\n",
  ).results[0]
  t.is(messages[0].ruleId, 'no-unused-vars')
})

test('unused vars in function args', (t) => {
  const linter = buildLinter(conciseConfigFile)
  const { messages } = linter.executeOnText(
    "'use strict'\n\nmodule.exports = (a, b) => b\n",
  ).results[0]
  t.deepEqual(messages, [])
})

test('unused vars try catch err', (t) => {
  const linter = buildLinter(conciseConfigFile, {
    config: {
      rules: {
        'no-empty': 'off',
      },
    },
  })
  const { messages } = linter.executeOnText(`'use strict'

try {
  // ...
} catch (_err) {}
`).results[0]
  t.is(messages[0].ruleId, 'unicorn/prefer-optional-catch-binding')
})
