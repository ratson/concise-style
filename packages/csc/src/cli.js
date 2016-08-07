#!/usr/bin/env node
import makeDebug from 'debug'
import hasFlag from 'has-flag'
import resolveCwd from 'resolve-cwd'

import formatterPretty from 'eslint-formatter-pretty'
import meow from 'meow'
import updateNotifier from 'update-notifier'
import xo from 'xo'

const debug = makeDebug('csc')
const localCLI = resolveCwd('csc/lib/cli')

function log(opts, report) {
  const reporter = opts.reporter ? xo.getFormatter(opts.reporter) : formatterPretty

  process.stdout.write(reporter(report.results))
  process.exit(report.errorCount === 0 ? 0 : 1)
}

if (!hasFlag('no-local') && localCLI && localCLI !== __filename) {
  debug('Using local install of CSC.')
  require(localCLI)
} else {
  const cli = meow({
  }, {
    string: [
      '-',
    ],
    boolean: [
      'compact',
      'fix',
      'init',
      'open',
      'stdin',
    ],
  })

  updateNotifier({pkg: cli.pkg}).notify()

  const input = cli.input
  const opts = Object.assign({
    extends: [
      require.resolve('eslint-config-concise'),
    ],
  }, cli.flags)

  // `xo -` => `xo --stdin`
  if (input[0] === '-') {
    opts.stdin = true
    input.shift()
  }

  xo.lintFiles(input, opts).then((report) => {
    if (opts.fix) {
      xo.outputFixes(report)
    }

    log(opts, report)
  })
}
