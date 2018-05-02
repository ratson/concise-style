import Bluebird from 'bluebird'
import globby from 'globby'
import _ from 'lodash'
import Path from 'path'
import { isEslintPlugin } from './utils'
import esmeta from 'esmeta'

export const collectEslintPluginNames = pkg =>
  Object.keys(_.get(pkg, 'dependencies', {}))
    .filter(isEslintPlugin)
    .map(x => x.replace('eslint-plugin-', ''))

const importMeta = esmeta(import.meta)

export default async () =>
  Bluebird.reduce(
    globby('packages/eslint-config-*', {
      cwd: importMeta.dirnameJoin('../..'),
      absolute: true,
      onlyFiles: false,
    }),
    async (acc, p) => {
      const { default: pkg } = await import(Path.join(p, 'package.json'))
      const key = pkg.name.replace('eslint-config-', '')
      acc[key] = {
        pkg,
        plugins: collectEslintPluginNames(pkg),
      }
      return acc
    },
    {},
  )
