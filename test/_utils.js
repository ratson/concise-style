import eslint from 'eslint'

function buildLinter(configFile) {
  return new eslint.CLIEngine({
    useEslintrc: false,
    configFile,
  })
}

export function lintFile(file, { configFile }) {
  return buildLinter(configFile).executeOnFiles([file])
}
