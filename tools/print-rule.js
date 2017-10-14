'use strict'

const _ = require('lodash')
const stringify = require('json-stringify-deterministic')
const yargs = require('yargs')

const { buildConciseConfig } = require('./gen')
const loadConfigs = require('./gen/load-configs')

const conciseImportConfig = require('../packages/eslint-config-concise-import')
const conciseReactConfig = require('../packages/eslint-config-concise-react')

/* eslint-disable no-console */
function printParserOptions(named) {
  const grouped = _.groupBy(_.values(named), config =>
    stringify(_.get(config, ['parserOptions']))
  )
  _.forEach(grouped, (config, parserOptions) => {
    console.log(parserOptions)
    console.log(_.map(config, 'name'))
    console.log()
  })
}

function printEnv(named) {
  const grouped = _.groupBy(_.values(named), config =>
    stringify(_.get(config, ['env']))
  )
  _.forEach(grouped, (config, env) => {
    console.log(env)
    console.log(_.map(config, 'name'))
    console.log()
  })
}

async function main() {
  const { argv } = yargs
    .help('h')
    .alias('h', 'help')
    .recommendCommands()
  const configs = await loadConfigs()
  const { env, parserOptions, rule } = argv

  const named = _.mapValues(
    Object.assign({}, configs, {
      concise: buildConciseConfig(configs),
      'concise-import': conciseImportConfig,
      'concise-react': conciseReactConfig,
    }),
    (v, k) => Object.assign(v, { name: k })
  )
  if (parserOptions) {
    printParserOptions(named)
    return
  }
  if (env) {
    printEnv(named)
    return
  }

  const grouped = _.groupBy(_.values(named), config =>
    stringify(_.get(config, ['rules', rule]))
  )
  _.forEach(grouped, (config, ruleValue) => {
    console.log(rule, '=', ruleValue)
    console.log(_.map(config, 'name'))
    console.log()
  })
}
/* eslint-enable no-console */

if (require.main === module) {
  main()
}
