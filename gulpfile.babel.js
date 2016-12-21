import path from 'path'

import chalk from 'chalk'
import through from 'through2'

import babel from 'gulp-babel'
import filter from 'gulp-filter'
import gulp from 'gulp'
import gutil from 'gulp-util'
import newer from 'gulp-newer'
import plumber from 'gulp-plumber'

import genConciseReact from './tools/gen-concise-react'
import genConciseStyle from './tools/gen-concise-style'

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
export function buildSrc() {
  const jsFilter = filter('**/*.js', {restore: true})

  return gulp.src([
    './packages/*/src/**/*.js',
    './packages/*/src/**/*.json',
  ])
    .pipe(plumber({
      errorHandler(err) {
        gutil.log(err.stack)
      },
    }))
    .pipe(through.obj(mapSrcToLib))
    .pipe(newer(dest))
    .pipe(through.obj(logCompilingFile))
    .pipe(jsFilter)
    .pipe(babel())
    .pipe(jsFilter.restore)
    .pipe(gulp.dest(dest))
}

gulp.task('buildConfig', gulp.parallel(genConciseStyle, genConciseReact))

gulp.task('build', gulp.series('buildConfig', buildSrc))

function watch() {
  gulp.watch('./packages/*/src/**/*.js', ['build'])
}

export default watch
