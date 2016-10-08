/*eslint-env node */
var gulp = require('gulp');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var path = require('path');
const paths = require('../config/config.js').paths;
//var gutil =require('gulp-util');
const utils = require('./utils.js');

// ........functions .......
function withFlowJSType(src, dst) {
  var srcPath = [src + '/**/*.js',
    '!' + src + '/**/__tests__/**', '!' + src + '/**/__mocks__/**'];
  return gulp
    .src(srcPath)
    .pipe(rename({extname: '.js.flow'}))
    .pipe(gulp.dest(dst));
}

function stdGulpTrans(src, dst) {
  var sourceRoot = path.join(__dirname, src);
  var srcPath = [src + '/**/*.js',
    '!' + src + '/**/__tests__/**', '!' + src + '/**/__mocks__/**'];
  return gulp
    .src(srcPath)
    .pipe(sourcemaps.init())
    .pipe(babel(utils.readRC(paths.babelrc)) )
    .pipe(sourcemaps.write('.', {
      includeContent: true, sourceRoot: sourceRoot, debug:true,
    }))
    .pipe(gulp.dest(dst));
}

module.exports = {
  withFlowJSType: withFlowJSType,
  stdGulpTrans: stdGulpTrans,
};
