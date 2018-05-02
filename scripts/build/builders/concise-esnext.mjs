import _ from 'lodash'

export const outputPath = 'eslint-config-concise-esnext/eslintrc.json'

export const build = (configs, pkgs) => {
  const { plugins } = pkgs['concise-esnext']
  return {
    parserOptions: {
      ecmaFeatures: {
        globalReturn: true,
      },
      sourceType: 'module',
    },
    plugins,
    rules: Object.assign(
      {
        'babel/object-curly-spacing': ['error', 'always'],
      },
      _.pick(configs['eslint/recommended'].rules, [
        'strict',
        'object-curly-spacing',
      ]),
    ),
  }
}
