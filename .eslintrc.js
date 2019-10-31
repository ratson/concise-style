'use strict'

module.exports = {
  extends: [
    require.resolve('./packages/eslint-config-concise'),
    require.resolve('./packages/eslint-config-concise-esnext'),
  ],
  rules: {
    "strict": "off"
  }
}
