#!/usr/bin/env node
'use strict'

const execa = require('execa')
const yargs = require('yargs')
const exit = require('promise-exit')

const lint = require('.')

async function main() {
  const { argv } = yargs
    .usage('$0 [files..]', 'lint files', {
      fix: {
        desc: 'Automatically fix format and lint problems',
        default: false,
      },
      git: {
        desc: 'run git add for changed files',
        default: false,
      },
    })
    .help()
  const { fix, files } = argv

  let results
  try {
    results = await lint({ fix, files })
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }

  if (fix) {
    const changedFiles = results
      .filter(({ hasChanged }) => hasChanged)
      .map(({ filePath }) => filePath)
    await execa('git', ['add', ...changedFiles])
  }
}

exit(main)
