/* eslint-disable dot-notation */
import _ from 'lodash'
import readPkgUp from 'read-pkg-up'

const config = {
  env: {},
  extends: [
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
  rules: {
    'eslint-comments/no-unlimited-disable': 'error',
    'node/no-unpublished-require': 'off',
    'node/no-unsupported-features': 'off',
    'promise/param-names': 'error',
  },
}

const {pkg} = readPkgUp.sync()
const deps = _.reduce(_.pick(pkg, ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']), (r, o) => Object.assign(r, o), {})

if (deps['babel-plugin-dev-expression']) {
  config.globals['__DEV__'] = true
}

module.exports = config
