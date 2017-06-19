import test from 'ava'

import { lintFile } from './_utils'

const conciseConfigFile = require.resolve('../packages/eslint-config-concise')
const conciseEsnextConfigFile = require.resolve('../packages/eslint-config-concise-esnext')

test('[concise] good-style', t => {
  const { results } = lintFile(
    require.resolve('./fixtures/concise/good-style'),
    {
      configFile: conciseConfigFile,
    }
  )
  t.deepEqual(results[0].messages, [])
})

test.skip('[concise-esnext] good-style', t => {
  const { results } = lintFile(
    require.resolve('./fixtures/concise-esnext/good-style'),
    {
      config: {
        extends: [
            conciseConfigFile,
            conciseEsnextConfigFile,
        ],
      },
    }
  )
  t.deepEqual(results[0].messages, [])
})
