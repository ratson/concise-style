import chalk from 'chalk'
import updateNotifier from 'update-notifier'
import yargs from 'yargs'

import pkg from '../package.json'

export default () => {
  updateNotifier({pkg}).notify()

  const parser = yargs
    .usage(`${chalk.bold('Usage:')} csc <command> ${chalk.blue('[options]')}`)
    .commandDir('commands')
    .help()
  const opts = parser.argv

  if (opts._.length === 0) {
    parser.showHelp()
  }
}
