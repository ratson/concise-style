import fs from 'fs'

import _ from 'lodash'
import eslint from 'eslint'
import tempWrite from 'temp-write'
import test from 'ava'

import conf from '../src'

function runEslint(str, conf) {
  const linter = new eslint.CLIEngine({
    useEslintrc: false,
    configFile: tempWrite.sync(JSON.stringify(conf)),
    cwd: `${process.cwd()}/fixtures`,
  })

  return linter.executeOnText(str).results[0].messages
}

test('main', (t) => {
  t.true(_.isPlainObject(conf))

  const errors = runEslint(fs.readFileSync('fixtures/good.js', 'utf8'), conf)
  t.is(errors.length, 0, JSON.stringify(errors))
})
