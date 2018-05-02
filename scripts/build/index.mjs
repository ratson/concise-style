import Bluebird from 'bluebird'
import esmeta from 'esmeta'
import fs from 'fs/promises'
import globby from 'globby'
import stringify from 'json-stringify-deterministic'
import Path from 'path'
import prettier from 'prettier'
import exit from 'promise-exit'
import loadConfigs from './load-configs'
import collectPackagesInfo from './pkgs-info'

const importMeta = esmeta(import.meta)

function writeJsFile(filePath, config) {
  const source = prettier.format(stringify(config), { parser: 'json' })
  return fs.writeFile(importMeta.dirnameJoin('../..', filePath), source, 'utf8')
}

async function main() {
  const configs = await loadConfigs()
  const pkgs = await collectPackagesInfo()

  await Bluebird.map(
    globby('*.mjs', {
      cwd: importMeta.dirnameJoin('builders'),
      absolute: true,
    }),
    async builderPath => {
      const { build, outputPath } = await import(builderPath)
      const config = await build(configs, pkgs)
      await writeJsFile(Path.join('packages', outputPath), config)
    },
  )
}

exit(main)
