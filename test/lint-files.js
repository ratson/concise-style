import test from 'ava'

import { lintFile } from './_utils'

const conciseConfigFile = require.resolve('../packages/eslint-config-concise')
const conciseEsnextConfigFile = require.resolve(
  '../packages/eslint-config-concise-esnext'
)
const conciseReactConfigFile = require.resolve(
  '../packages/eslint-config-concise-react'
)

test('[concise] good-style', t => {
  const { results } = lintFile(
    require.resolve('./fixtures/concise/good-style'),
    {
      configFile: conciseConfigFile,
    }
  )
  const { messages } = results[0]
  t.true(messages.length === 0)
})

test('[concise-esnext] good-style', t => {
  const { results } = lintFile(
    require.resolve('./fixtures/concise-esnext/good-style'),
    {
      config: {
        extends: [conciseConfigFile, conciseEsnextConfigFile],
      },
    }
  )
  const { messages } = results[0]
  t.true(messages.length === 0)
})

test('[concise-react] good-style', t => {
  const { results } = lintFile(
    require.resolve('./fixtures/concise-react/good-style'),
    {
      config: {
        env: {
          browser: true,
        },
        extends: [
          conciseConfigFile,
          conciseEsnextConfigFile,
          conciseReactConfigFile,
        ],
      },
    }
  )
  const { messages } = results[0]
  t.true(messages.length === 0)
})
