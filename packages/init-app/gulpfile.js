// @flow
/*eslint-env node */
var gulp = require('gulp');
const gScript = require('./scripts/gulp.scripts.js');
//var gutil =require('gulp-util');
const utils = require('./scripts/utils.js');

gulp.task('lib', function() {
  return gScript.stdGulpTrans('src', 'lib');
});

gulp.task('flow', function() {
  return gScript.withFlowJSType('src', 'lib');
});

gulp.task('build', ['lib', 'flow'], function() {
  return gScript.stdGulpTrans('src/common', 'dst/common');
});

gulp.task('clean', function() {
  return utils.rmdir([
    'lib',
    'index.js',
    'index.js.flow',
    'index.js.map',
  ] );
});
