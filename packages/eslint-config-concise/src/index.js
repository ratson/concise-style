import fs from 'fs'
import path from 'path'

import yaml from 'js-yaml'

const filePath = path.resolve(__dirname, '../eslintrc.yml')
let config

try {
  config = yaml.safeLoad(fs.readFileSync(filePath, 'utf8')) || {}
} catch (e) {
  console.error(`Error reading YAML file: ${filePath}`)
  e.message = `Cannot read config file: ${filePath} \nError: ${e.message}`
  throw e
}

module.exports = config
