'use strict'

const Path = require('path')

const _ = require('lodash')
const globby = require('globby')

const { isEslintPlugin } = require('./utils')

const collectEslintPluginNames = pkg =>
  Object.keys(_.get(pkg, 'dependencies', {}))
    .filter(isEslintPlugin)
    .map(x => x.replace('eslint-plugin-', ''))

module.exports = async () =>
  _.reduce(
    await globby('packages/eslint-config-*', {
      cwd: Path.join(__dirname, '../..'),
      absolute: true,
    }),
    (acc, p) => {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line global-require,security/detect-non-literal-require
      const pkg = require(Path.join(p, 'package.json'))
      const key = pkg.name.replace('eslint-config-', '')
      acc[key] = {
        pkg,
        plugins: collectEslintPluginNames(pkg),
      }
      return acc
    },
    {}
  )
