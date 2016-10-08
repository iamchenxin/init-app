// @flow
/*eslint-env node */
var gulp = require('gulp');
const gScript = require('./scripts/gulp.scripts.js');
//var gutil =require('gulp-util');
const utils = require('./scripts/utils.js');

gulp.task('build', function() {
  return gScript.stdGulpTrans('src', 'lib');
});

gulp.task('clean', function() {
  return utils.rmdir([
    'lib',
  ] );
});
