'use strict'

module.exports = {
  env: {
    brower: true,
  },
  extends: [
    require.resolve('../packages/eslint-config-concise-esnext'),
    require.resolve('../packages/eslint-config-concise-react'),
  ],
}
