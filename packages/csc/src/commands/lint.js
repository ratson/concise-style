import {CLIEngine} from 'eslint'
import log from 'eslint/lib/logging'

import detailedFormatter from 'eslint-detailed-reporter/lib/detailed'
import friendlyFormatter from 'eslint-friendly-formatter'
import prettyFormatter from 'eslint-formatter-pretty'

export const desc = 'Lint files'

export const builder = {
  fix: {
    default: false,
    type: 'boolean',
  },
  format: {
    default: 'pretty',
    choices: [
      'friendly',
      'html-detailed',
      'pretty',
      // eslint built-in formatter
      'checkstyle',
      'codeframe',
      'compact',
      'html',
      'jslint-xml',
      'json',
      'junit',
      'stylish',
      'table',
      'tap',
      'unix',
      'visualstudio',
    ],
  },
}

function getFormatter(format, engine) {
  switch (format) {
    case 'html-detailed':
      return detailedFormatter
    case 'pretty':
      return prettyFormatter
    case 'friendly':
      return friendlyFormatter
    default:
      try {
        return engine.getFormatter(format)
      } catch (err) {
      }
  }
  return friendlyFormatter
}

export function handler(argv) {
  const files = argv._.slice(1)
  if (files.length === 0) {
    files.push('.')
  }

  const engine = new CLIEngine()
  const report = engine.executeOnFiles(files)
  if (argv.fix) {
    CLIEngine.outputFixes(report)
  }
  const output = getFormatter(argv.format, engine)(report.results)
  if (output) {
    log.info(output)
  }
  process.exitCode = report.errorCount ? 1 : 0
}
