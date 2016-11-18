/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs'
import path from 'path'

import _ from 'lodash'
import serializeJs from 'serialize-js'
import getRuleFinder from 'eslint-find-rules'
import rules from 'eslint/lib/rules'
import loadRules from 'eslint/lib/load-rules'

import {parserOptions} from 'eslint-config-airbnb-base'

const airbnb = getRuleFinder(require.resolve('eslint-config-airbnb-base'))

const fixableRules = _.filter(Object.keys(loadRules()), id => {
  const r = rules.get(id)
  return r && !r.meta.deprecated && r.meta.fixable
})

const config = {
  parserOptions,
  rules: Object.assign(
    _.pick(airbnb.getCurrentRulesDetailed(), fixableRules),
    {
      semi: ['error', 'never'],
    },
  ),
}

fs.writeFileSync(path.join(__dirname, '../lib/index.js'), `'use strict';

module.exports = ${serializeJs(config)};
`, 'utf8')
