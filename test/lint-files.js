import path from 'path'

import test from 'ava'
import globby from 'globby'

import { lintFile } from './_utils'

const conciseConfigFile = require.resolve('../packages/eslint-config-concise')
const conciseEsnextConfigFile = require.resolve(
  '../packages/eslint-config-concise-esnext'
)
const conciseReactConfigFile = require.resolve(
  '../packages/eslint-config-concise-react'
)

const lintConfigs = {
  concise: {
    configFile: conciseConfigFile,
  },
  'concise-ava': {
    config: {
      extends: [
        conciseConfigFile,
        conciseEsnextConfigFile,
        require.resolve('../packages/eslint-config-concise-ava'),
      ],
      rules: {
        'ava/no-ignored-test-files': 'off',
      },
    },
  },
}

function lintConciseGood(t, configKey, filename) {
  const { results } = lintFile(
    require.resolve(filename),
    lintConfigs[configKey]
  )
  const { messages } = results[0]
  t.true(messages.length === 0)
}

lintConciseGood.title = (providedTitle, configKey, filename) => {
  const name = path.basename(filename, '.js')
  return `${providedTitle} [${configKey}] ${name}`.trim()
}

globby
  .sync(['./fixtures/concise/good-*.js', './fixtures/concise-ava/good-*.js'], {
    cwd: __dirname,
  })
  .forEach(filename => {
    const configKey = path.basename(path.dirname(filename))
    test(lintConciseGood, configKey, filename)
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
