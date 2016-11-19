import fs from 'fs'
import path from 'path'

import _ from 'lodash'
import eslint from 'eslint'
import tempWrite from 'temp-write'
import test from 'ava'

import config from '../src'

function runEslint(str, conf) {
  const linter = new eslint.CLIEngine({
    useEslintrc: false,
    configFile: tempWrite.sync(JSON.stringify(conf)),
    cwd: path.join(__dirname, 'fixtures'),
  })

  return linter.executeOnText(str).results[0].messages
}

test(t => {
  t.true(_.isPlainObject(config))

  const errors = runEslint(fs.readFileSync(path.join(__dirname, 'fixtures/good.js'), 'utf8'), config)
  t.is(errors.length, 0, JSON.stringify(errors))
})
