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

function lintConciseGood(t, name) {
  const { results } = lintFile(require.resolve(`./fixtures/concise/${name}`), {
    configFile: conciseConfigFile,
  })
  const { messages } = results[0]
  t.true(messages.length === 0)
}

lintConciseGood.title = (providedTitle, name) =>
  `${providedTitle} [concise] ${name}`.trim()

globby
  .sync(['./fixtures/concise/good-*.js'], { cwd: __dirname })
  .map(p => path.basename(p, '.js'))
  .forEach(name => {
    test(lintConciseGood, name)
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
