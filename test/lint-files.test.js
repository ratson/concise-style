import path from 'path'

import _ from 'lodash'
import test from 'ava'
import globby from 'globby'

import { lintFile } from './_utils'

const conciseConfigFile = require.resolve('../packages/eslint-config-concise')
const conciseEsnextConfigFile = require.resolve(
  '../packages/eslint-config-concise-esnext',
)
const conciseFlowConfigFile = require.resolve(
  '../packages/eslint-config-concise-flow',
)
const conciseReactConfigFile = require.resolve(
  '../packages/eslint-config-concise-react',
)

const lintConfigs = _.mapValues(
  {
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
    'concise-esnext': {
      config: {
        extends: [conciseConfigFile, conciseEsnextConfigFile],
      },
    },
    'concise-flow': {
      config: {
        extends: [
          conciseConfigFile,
          conciseEsnextConfigFile,
          conciseFlowConfigFile,
        ],
      },
    },
    'concise-react': {
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
    },
  },
  x => _.assign(x, { root: true }),
)

function lintConciseGood(t, configKey, filename) {
  const { results } = lintFile(
    require.resolve(filename),
    lintConfigs[configKey],
  )
  const { messages } = results[0]
  t.is(messages.length, 0)
}

lintConciseGood.title = (providedTitle, configKey, filename) => {
  const name = path.basename(filename, '.js')
  return `${providedTitle} [${configKey}] ${name}`.trim()
}

globby
  .sync(['./fixtures/concise/good-*.js', './fixtures/concise-*/good-*.js'], {
    cwd: __dirname,
  })
  .forEach(filename => {
    const configKey = path.basename(path.dirname(filename))
    test.skip(lintConciseGood, configKey, filename)
  })
