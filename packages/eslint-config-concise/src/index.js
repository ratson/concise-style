/* eslint-disable dot-notation */
import _ from 'lodash'
import readPkgUp from 'read-pkg-up'

import eslintrc from './eslintrc.json'

const config = {
  env: {},
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    require.resolve('eslint-config-concise-style'),
  ],
  globals: {},
  plugins: [
    'eslint-comments',
    'html',
    'markdown',
    'node',
    'promise',
  ],
  rules: eslintrc.rules,
}

const {pkg} = readPkgUp.sync()
const deps = _.reduce(_.pick(pkg, ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']), (r, o) => Object.assign(r, o), {})

if (deps['babel-plugin-dev-expression']) {
  config.globals['__DEV__'] = true
}

module.exports = config
