#!/usr/bin/env node
/* eslint-disable import/no-dynamic-require */

'use strict'

const hasFlag = require('has-flag')
const resolveCwd = require('resolve-cwd')

const localCLI = resolveCwd('csc/lib/cli')
if (!hasFlag('no-local') && localCLI && localCLI !== __filename) {
  require(localCLI)
} else {
  require('.').default()
}
