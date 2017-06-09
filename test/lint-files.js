import test from 'ava'

import { lintFile } from './_utils'

const conciseConfigFile = require.resolve('../packages/eslint-config-concise')

test('good-style', t => {
  const { results } = lintFile(
    require.resolve('./fixtures/concise/good-style'),
    {
      configFile: conciseConfigFile,
    }
  )

  t.deepEqual(results[0].messages, [])
})
