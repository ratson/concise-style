'use strict'

const gulp = require('gulp-v4')

const {
  genConcise,
  genConciseEsnext,
  genConciseImport,
  genConciseReact,
  genConciseStyle,
  printRule,
} = require('./tools/gen')

gulp.task(
  'buildConfig',
  gulp.parallel(
    () => genConcise(),
    () => genConciseEsnext(),
    () => genConciseImport(),
    () => genConciseReact(),
    () => genConciseStyle()
  )
)

gulp.task('build', gulp.series('buildConfig'))

function watch() {
  gulp.watch('./packages/*/src/**/*.js', ['build'])
}

module.exports.printRule = printRule
module.exports.default = watch
