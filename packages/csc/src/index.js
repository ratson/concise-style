import chalk from 'chalk'
import yargs from 'yargs'

const parser = yargs
  .usage(`${chalk.bold('Usage:')} csc <command> ${chalk.blue('[options]')}`)
  .commandDir('commands')
  .config()
  .help()
const opts = parser.argv

export default () => {
  if (opts._.length === 0) {
    parser.showHelp()
  }
}
