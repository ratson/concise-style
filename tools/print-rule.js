'use strict'

const _ = require('lodash')
const stringify = require('json-stringify-deterministic')

const { buildConciseConfig, loadEslintConfigs } = require('./gen')

async function main() {
  const configs = loadEslintConfigs()
  /* eslint-disable no-console */
  const rule = _.last(process.argv.slice(2))
  const named = _.mapValues(
    Object.assign({}, configs, {
      concise: buildConciseConfig(),
    }),
    (v, k) => Object.assign(v, { name: k }),
  )
  const grouped = _.groupBy(_.values(named), config =>
    stringify(_.get(config, ['rules', rule])),
  )
  _.forEach(grouped, (config, ruleValue) => {
    console.log(rule, '=', ruleValue)
    console.log(_.map(config, 'name'))
    console.log()
  })
  /* eslint-enable no-console */
}

if (require.main === module) {
  main()
}
