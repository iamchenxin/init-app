/*eslint-env node */
var gulp = require('gulp');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var path = require('path');
//var gutil =require('gulp-util');

// ........functions .......
function outputFlowJS(src, dst) {
  var srcPath = [src + '/**/*.js',
    '!' + src + '/**/__tests__/**', '!' + src + '/**/__mocks__/**'];
  return gulp
    .src(srcPath)
    .pipe(rename({extname: '.js.flow'}))
    .pipe(gulp.dest(dst));
}

// compile Javascript with babel. output sourcemaps
// The babelrc need to be exist, Because babel-node!
// Seems there is no convenice way to pass config to babel-node.
function compileJS(src, dst, babelJson) {
  // process.cwd() will be the exec path.
  // __dirname will be this file(gulp.scripts.js)'s path.
  // path.resolve to allow `src` be relative or absolute.
  var sourceRoot = path.resolve(process.cwd(), src);
  var srcPath = [src + '/**/*.js',
    '!' + src + '/**/__tests__/**', '!' + src + '/**/__mocks__/**'];
  return gulp
    .src(srcPath)
    .pipe(sourcemaps.init())
    .pipe(babel( babelJson ) )
    .pipe(sourcemaps.write('.', {
      includeContent: true, sourceRoot: sourceRoot, debug:true,
    }))
    .pipe(gulp.dest(dst));
}

function test(v) {
  console.log('hello ! ' + v);
}

module.exports = {
  outputFlowJS: outputFlowJS,
  compileJS: compileJS,
  test: test,
};
