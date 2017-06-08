'use strict'

const { exec } = require('child_process')

const _ = require('lodash')
const inquirer = require('inquirer')

const desc = 'Run config initialization wizard'

function getPeerDependencies(pkg) {
  switch (pkg) {
    case 'eslint-config-concise':
      return [
        'eslint',
        'eslint-plugin-eslint-comments',
        'eslint-plugin-html',
        'eslint-plugin-markdown',
        'eslint-plugin-node',
        'eslint-plugin-promise',
      ]
    case 'eslint-config-concise-esnext':
      return getPeerDependencies('eslint-config-concise').concat([
        'eslint-plugin-babel',
      ])
    case 'eslint-config-concise-react':
      return ['eslint', 'eslint-plugin-react']
    case 'eslint-config-control-freak':
      return getPeerDependencies('eslint-config-concise').concat([
        'eslint-plugin-filenames',
        'eslint-plugin-import',
      ])
    default:
  }
  return []
}

function handler() {
  const ui = new inquirer.ui.BottomBar()
  inquirer
    .prompt([
      {
        type: 'checkbox',
        name: 'packages',
        message: 'Which packages do you want to install?',
        default: ['eslint-config-concise'],
        choices: [
          'csc',
          'eslint-config-concise',
          'eslint-config-concise-react',
          'eslint-config-concise-style',
          'eslint-config-control-freak',
        ],
      },
    ])
    .then(answers => {
      const installPackages = _.uniq(
        _.flatMap(answers.packages, pkg => getPeerDependencies(pkg)).concat(
          answers.packages
        )
      )
      const installCmd = installPackages.reduce(
        (r, pkg) => `${r} ${pkg}`,
        'npm install --color always -D '
      )
      const child = exec(installCmd)
      child.stdout.pipe(ui.log)
      child.stderr.pipe(process.stderr)
    })
}

module.exports = {
  desc,
  handler,
}
