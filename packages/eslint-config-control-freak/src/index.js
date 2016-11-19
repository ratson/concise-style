module.exports = {
  extends: [
    'eslint-config-airbnb-base',
    'eslint-config-xo/esnext',
    'eslint-config-concise',
  ].map(require.resolve),
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
  },
}
