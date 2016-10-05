module.exports = {
  extends: [
    'airbnb-base',
    'xo-space/esnext',
  ],
  plugins: ['filenames'],
  rules: {
    'babel/arrow-parens': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'filenames/match-exported': 'error',
    'semi': ['error', 'never'],
    'xo/filename-case': 'off',
  },
}
