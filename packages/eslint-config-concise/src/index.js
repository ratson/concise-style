import fs from 'fs'
import path from 'path'

import yaml from 'js-yaml'

const filePath = path.resolve(__dirname, '../eslintrc.yml')
let config

try {
  config = yaml.safeLoad(fs.readFileSync(filePath, 'utf8')) || {}
} catch (err) {
  console.error(`Error reading YAML file: ${filePath}`)
  err.message = `Cannot read config file: ${filePath} \nError: ${err.message}`
  throw err
}

module.exports = config
