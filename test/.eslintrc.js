'use strict'

module.exports = {
  extends: [
    require.resolve('../packages/eslint-config-concise-browser'),
    require.resolve('../packages/eslint-config-concise-esnext'),
    require.resolve('../packages/eslint-config-concise-react')
  ]
}
