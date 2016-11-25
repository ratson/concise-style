import {CLIEngine} from 'eslint'
import cli from 'eslint/lib/cli'
import log from 'eslint/lib/logging'

export const desc = 'Lint files'

export const builder = {
  fix: {
    default: false,
    type: 'boolean',
  },
}

function printResults(engine, results, format, outputFile) {
  let formatter

  try {
    formatter = engine.getFormatter(format)
  } catch (e) {
    log.error(e.message)
    return false
  }

  const output = formatter(results)

  if (output) {
    log.info(output)
  }
  return true
}

export function handler(argv) {
  const files = argv._.slice(1)
  const engine = new CLIEngine()
  const report = engine.executeOnFiles(files)
  if (argv.fix) {
    CLIEngine.outputFixes(report)
  }
  if (printResults(engine, report.results, 'stylish')) {
    process.exitCode = report.errorCount ? 1 : 0
  }
}
