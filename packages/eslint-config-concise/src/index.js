/* eslint-disable dot-notation */
import _ from 'lodash'
import readPkgUp from 'read-pkg-up'

const config = {
  env: {},
  extends: [
    'eslint-config-airbnb-base',
    'eslint-config-xo/esnext',
    'eslint-config-concise-style',
  ].map(require.resolve),
  globals: {},
  plugins: [
    'filenames',
    'promise',
  ],
  rules: {
    'filenames/match-exported': 'error',
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        '**/*.spec.js',
        '**/*.test.js',
        '**/gulpfile.babel.js',
        '**/gulpfile.js',
        '**/test/*.js',
      ],
      optionalDependencies: false,
    }],
    'promise/param-names': 'error',
    'unicorn/filename-case': 'off',
  },
}

const {pkg} = readPkgUp.sync()
const deps = _.reduce(_.pick(pkg, ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']), (r, o) => Object.assign(r, o), {})

if (deps['babel-plugin-dev-expression']) {
  config.globals['__DEV__'] = true
}

module.exports = config
