import chalk from 'chalk'
import updateNotifier from 'update-notifier'
import yargs from 'yargs'

import pkg from '../package.json'

export default () => {
  updateNotifier({pkg}).notify()

  if (process.argv.length === 2) {
    process.argv.splice(2, 0, 'lint')
  }

  const parser = yargs
    .usage(`${chalk.bold('Usage:')} $0 <command> ${chalk.blue('[options]')}`)
    .commandDir('commands')
    .help('h')
    .version()
    .alias('h', 'help')
    .recommendCommands()
  const opts = parser.parse(process.argv)

  if (opts._.length === 0) {
    parser.showHelp()
  }
}
