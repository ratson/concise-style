import eslint from 'eslint'
import tempWrite from 'temp-write'

function buildLinter(configFile) {
  return new eslint.CLIEngine({
    useEslintrc: false,
    configFile,
  })
}

export function lintFile(file, { config, configFile }) {
  const filename = configFile || tempWrite.sync(JSON.stringify(config))
  return buildLinter(filename).executeOnFiles([file])
}
