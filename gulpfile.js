'use strict'

const gulp = require('gulp-v4')

const {
  genConcise,
  genConciseReact,
  genConciseStyle,
  printRule,
} = require('./tools/gen')

gulp.task(
  'buildConfig',
  gulp.parallel(genConcise, genConciseReact, genConciseStyle)
)

gulp.task('build', gulp.series('buildConfig'))

function watch() {
  gulp.watch('./packages/*/src/**/*.js', ['build'])
}

exports.printRule = printRule
exports.default = watch
