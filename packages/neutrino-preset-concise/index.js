'use strict'

const lint = require('@neutrinojs/eslint')
const { merge } = require('lodash')

module.exports = (neutrino, { eslint = {}, ...opts } = {}) => {
  neutrino.use(lint, {
    ...opts,
    eslint: {
      ...eslint,
      baseConfig: merge(
        {
          extends: [
            require.resolve('eslint-config-concise'),
            require.resolve('eslint-config-concise-esnext'),
            require.resolve('eslint-config-concise-react'),
          ],
        },
        eslint.baseConfig || {},
      ),
    },
  })
}
