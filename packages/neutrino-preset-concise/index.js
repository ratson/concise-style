'use strict'

const lint = require('@neutrinojs/eslint')
const { merge: eslintMerge } = require('eslint/lib/config/config-ops')

module.exports = (neutrino, { eslint = {}, ...opts } = {}) => {
  neutrino.use(lint, {
    ...opts,
    eslint: {
      ...eslint,
      baseConfig: eslintMerge(
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
