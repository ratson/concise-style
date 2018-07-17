'use strict'

const lint = require('@neutrinojs/eslint')

module.exports = (neutrino, opts = {}) => {
  neutrino.use(
    lint,
    lint.merge(
      {
        eslint: {
          baseConfig: {
            extends: [
              require.resolve('eslint-config-concise'),
              require.resolve('eslint-config-concise-esnext'),
              require.resolve('eslint-config-concise-react'),
            ],
          },
        },
      },
      opts,
    ),
  )
}
