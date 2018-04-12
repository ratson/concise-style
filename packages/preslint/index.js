'use strict'

const fse = require('fs-extra')
const format = require('prettier-eslint')
const Bluebird = require('bluebird')
const { CLIEngine } = require('eslint')

module.exports = async ({ fix = false, files } = {}) => {
  const cli = new CLIEngine({
    fix,
  })
  const formatter = cli.getFormatter()

  return Bluebird.map(files, async filePath => {
    const text = await fse.readFile(filePath, 'utf8')
    const formatted = format({
      text,
      filePath,
    })
    const hasChanged = text !== formatted
    const writeFilePromise =
      hasChanged && fix ? fse.writeFile(filePath, formatted) : Promise.resolve()

    const textToLint = fix ? formatted : text
    const report = cli.executeOnText(textToLint, filePath)
    const output = formatter(report.results)
    await writeFilePromise
    if (report.errorCount > 0) {
      throw new Error(output)
    }

    return {
      filePath,
      hasChanged:
        hasChanged ||
        report.fixableErrorCount > 0 ||
        report.fixableWarningCount > 0,
      report,
    }
  })
}
