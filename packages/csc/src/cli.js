#!/usr/bin/env node
/* eslint-disable import/no-dynamic-require */
import hasFlag from 'has-flag'
import resolveCwd from 'resolve-cwd'

const localCLI = resolveCwd('csc/lib/cli')
if (!hasFlag('no-local') && localCLI && localCLI !== __filename) {
  require(localCLI)
} else {
  require('.').default()
}
