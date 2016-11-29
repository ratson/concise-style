import path from 'path'

import chalk from 'chalk'
import newer from 'gulp-newer'
import through from 'through2'

import babel from 'gulp-babel'
import gulp from 'gulp'
import gutil from 'gulp-util'
import plumber from 'gulp-plumber'

function mapSrcToLib(file, enc, callback) {
  let srcEx
  let libFragment

  if (path.win32 === path) {
    srcEx = /(packages\\[^\\]+)\\src\\/
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
  gutil.log(`Compiling '${chalk.cyan(path.relative(__dirname, file.srcPath))}'...`)
  callback(null, file)
}

const dest = 'packages'
export function build() {
  return gulp.src('./packages/*/src/**/*.js')
    .pipe(plumber({
      errorHandler(err) {
        gutil.log(err.stack)
      },
    }))
    .pipe(through.obj(mapSrcToLib))
    .pipe(newer(dest))
    .pipe(through.obj(logCompilingFile))
    .pipe(babel())
    .pipe(gulp.dest(dest))
}

function watch() {
  gulp.watch('./packages/*/src/**/*.js', build)
}

export default watch
