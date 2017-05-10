'use strict'

const path = require('path')

const chalk = require('chalk')
const through = require('through2')

const babel = require('gulp-babel')
const filter = require('gulp-filter')
const gulp = require('gulp')
const gutil = require('gulp-util')
const newer = require('gulp-newer')
const plumber = require('gulp-plumber')

const genConcise = require('./tools/gen-concise')
const genConciseReact = require('./tools/gen-concise-react')
const genConciseStyle = require('./tools/gen-concise-style')

function mapSrcToLib(file, enc, callback) {
  let srcEx
  let libFragment

  if (path.win32 === path) {
    srcEx = /(packxages\\[^\\]+)\\src\\/
    libFragment = '$1\\lib\\'
  } else {
    srcEx = new RegExp('(packages/[^/]+)/src/')
    libFragment = '$1/lib/'
  }

  /* eslint-disable no-param-reassign */
  file.srcPath = file.path
  file.path = file.path.replace(srcEx, libFragment)
  /* eslint-enable no-param-reassign */
  callback(null, file)
}

function logCompilingFile(file, enc, callback) {
  gutil.log(
    `Compiling '${chalk.cyan(path.relative(__dirname, file.srcPath))}'...`
  )
  callback(null, file)
}

const dest = 'packages'
function buildSrc() {
  const jsFilter = filter('**/*.js', { restore: true })

  return gulp
    .src(['./packages/*/src/**/*.js', './packages/*/src/**/*.json'])
    .pipe(
      plumber({
        errorHandler(err) {
          gutil.log(err.stack)
        },
      })
    )
    .pipe(through.obj(mapSrcToLib))
    .pipe(newer(dest))
    .pipe(through.obj(logCompilingFile))
    .pipe(jsFilter)
    .pipe(babel())
    .pipe(jsFilter.restore)
    .pipe(gulp.dest(dest))
}
exports.buildSrc = buildSrc

gulp.task(
  'buildConfig',
  gulp.parallel(genConcise, genConciseStyle, genConciseReact)
)

gulp.task('build', gulp.series('buildConfig', buildSrc))

function watch() {
  gulp.watch('./packages/*/src/**/*.js', ['build'])
}

exports.default = watch
