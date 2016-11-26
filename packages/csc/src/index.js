import chalk from 'chalk'
import updateNotifier from 'update-notifier'
import yargs from 'yargs'
import yargsParser from 'yargs-parser'

import pkg from '../package.json'

export default () => {
  updateNotifier({pkg}).notify()

  const args = process.argv
  const parsed = yargsParser(args)
  if (parsed._.length === 2 && !parsed.help) {
    args.splice(2, 0, 'lint')
  }
  const parser = yargs
    .usage(`${chalk.bold('Usage:')} $0 <command> ${chalk.blue('[options]')}`)
    .commandDir('commands')
    .help('h')
    .version()
    .alias('h', 'help')
    .recommendCommands()
  const opts = parser.parse(args)

  if (opts._.length === 0) {
    parser.showHelp()
  }
}
