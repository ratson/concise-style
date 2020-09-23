import Bluebird from 'bluebird'
import { CLIEngine, Linter } from 'eslint'
import glob from 'fast-glob'
import fse from 'fs-extra'
// @ts-ignore
import stringify from 'json-stringify-deterministic'
import _ from 'lodash'
import path from 'path'
import prettier from 'prettier'
import readPkg, { PackageJson } from 'read-pkg'

type PackagesInfo = {
  [k: string]: {
    pkg: PackageJson
    plugins: Array<string>
  }
}

type Configs = {
  [k: string]: Linter.Config<Linter.RulesRecord>
}

export type BuildConfig = {
  configs: Configs
  pkgs: PackagesInfo
}

const rootDir = path.join(__dirname, '../..')

const isEslintPlugin = (pkgName: string) =>
  _.startsWith(pkgName, 'eslint-plugin-')

const prettifyRule = (ruleValue: any): any => {
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

const collectEslintPluginNames = (pkg: PackageJson) =>
  _.keys(pkg.dependencies)
    .filter(isEslintPlugin)
    .map(x => x.replace('eslint-plugin-', ''))

export const collectPackagesInfo = () =>
  Bluebird.reduce(
    glob('packages/eslint-config-*', {
      cwd: rootDir,
      absolute: true,
      onlyFiles: false
    }),
    async (acc, p) => {
      const pkg = await readPkg({ cwd: p })
      const key = pkg.name.replace('eslint-config-', '')
      acc[key] = {
        pkg,
        plugins: collectEslintPluginNames(pkg)
      }
      return acc
    },
    {} as PackagesInfo
  )

export const loadDeprecatedRules = () => {
  const cli = new CLIEngine({})
  const rules = cli.getRules()
  return Array.from(rules.keys()).filter(k => {
    const r = rules.get(k)
    return _.get(r, 'meta.deprecated', false)
  })
}

export const loadConfigs = async () => {
  const deprecatedRules = loadDeprecatedRules()
  const { devDependencies } = await readPkg({ cwd: rootDir })

  const pluginConfigs = await Bluebird.reduce(
    _.keys(devDependencies).filter(
      dep => isEslintPlugin(dep) && !['eslint-plugin-local'].includes(dep)
    ),
    async (acc, configName) => {
      const recommendedConfig = _.get(
        await import(configName),
        'default.configs.recommended'
      )
      return {
        ...acc,
        [configName]: recommendedConfig
      }
    },
    {} as Configs
  )

  const configs = _.keys(devDependencies)
    .filter(
      dep =>
        _.startsWith(dep, 'eslint-config-') &&
        ![
          '@anvilabs/eslint-config',
          'eslint-config-get-off-my-lawn',
          'eslint-config-logux',
          'eslint-config-majestic',
          'eslint-config-canonical',
        ].includes(dep)
    )
    .concat([
      '@anvilabs/eslint-config/jest',
      'eslint-config-canonical/jest',
      'eslint-config-canonical/react',
      'eslint-config-umbrellio/jest',
      'plugin:shopify/esnext',
      'eslint:recommended',
      'eslint-config-simplifield'
    ])
    .reduce((acc, configName) => {
      const cli = new CLIEngine({
        useEslintrc: false,
        baseConfig: { extends: configName }
      })
      return {
        ...acc,
        [configName]: cli.getConfigForFile(path.join(rootDir, '.eslintrc.js'))
      } as Configs
    }, pluginConfigs)

  return _.mapValues(_.omitBy(configs, _.isUndefined), config => {
    const rules = _.omit(
      _.mapValues(config.rules, prettifyRule),
      deprecatedRules
    )

    return {
      ...config,
      rules
    }
  })
}

const writeJsFile = (filePath: string, config: any) => {
  const source = prettier.format(stringify(config), { parser: 'json' })
  return fse.writeFile(path.join(rootDir, filePath), source, 'utf8')
}

export default async () => {
  const configs = await loadConfigs()
  const pkgs = await collectPackagesInfo()

  await Bluebird.map(
    glob('*.ts', {
      cwd: path.join(__dirname, 'builders'),
      absolute: true
    }),
    async builderPath => {
      const { build, outputPath } = await import(builderPath)
      const config = await build({ configs, pkgs })
      await writeJsFile(path.join('packages', outputPath), config)
    }
  )
}
