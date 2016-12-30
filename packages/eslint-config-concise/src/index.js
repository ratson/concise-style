/* eslint-disable dot-notation */
import _ from 'lodash'
import readPkgUp from 'read-pkg-up'

import eslintrc from './eslintrc.json'

const config = {
  ...eslintrc,
  extends: [
    ...eslintrc.extends,
    require.resolve('eslint-config-concise-style'),
  ],
}

const {pkg} = readPkgUp.sync()
const deps = _.reduce(_.pick(pkg, ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']), (r, o) => Object.assign(r, o), {})

if (deps['babel-plugin-dev-expression']) {
  _.set(config, ['globals', '__DEV__'], true)
}

module.exports = config
