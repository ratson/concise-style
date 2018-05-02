import path from 'path'
import eslint from 'eslint'
import _ from 'lodash'

export function isEslintPlugin(pkgName) {
  return _.startsWith(pkgName, 'eslint-plugin-')
}

export function getEslintConfig(configFile) {
  const cliEngine = new eslint.CLIEngine({
    useEslintrc: false,
    configFile,
  })
  return cliEngine.getConfigForFile()
}

export function prettifyRule(ruleValue) {
  if (Array.isArray(ruleValue)) {
    const rule = [prettifyRule(ruleValue[0]), ..._.drop(ruleValue)]
    if (rule.length === 1) {
      return rule[0]
    }
    return rule
  }
  switch (ruleValue) {
    case 0:
      return 'off'
    case 1:
      return 'warn'
    case 2:
      return 'error'
    default:
  }
  return ruleValue
}
