#!/usr/bin/env node
import _ from 'lodash'
import findUp from 'find-up'
import hasFlag from 'has-flag'
import makeDebug from 'debug'
import parseGitignore from 'parse-gitignore'
import readPkgUp from 'read-pkg-up'
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
  const cli = meow(`
Usage

  $ csc [<file|glob> ...]

Options

  --fix           Automagically fix issues
  --quiet         Show only errors and no warnings

Examples

  $ csc
  `, {
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

  const {pkg} = readPkgUp.sync()
  const input = cli.input
  const opts = Object.assign({
    env: _.get(pkg, 'xo.env', []),
    extends: [
      require.resolve('eslint-config-concise'),
    ],
  }, cli.flags)

  const deps = Object.assign({}, _.get(pkg, 'dependencies'), _.get(pkg, 'devDependencies'))
  if (deps.mocha) {
    opts.env.push('mocha')
  }
  if (deps.react) {
    opts.extends.push(require.resolve('eslint-config-xo-react/space'))
  }

  const gitignoreFile = findUp.sync('.gitignore')
  if (gitignoreFile && !opts.ignore) {
    opts.ignore = parseGitignore(gitignoreFile).map((x) => `**/${x}`)
    debug('Ignore patterns', opts.ignore)
  }

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
