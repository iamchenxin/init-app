// @flow
/*eslint-env node */
var gulp = require('gulp');
const initScripts = require('init-scripts');

const gScript = initScripts.gulpscripts;
//var gutil =require('gulp-util');
const webpackscripts = initScripts.webpackscripts;
const base = require('./config/base.js');
const ports = base.ports;

gulp.task('sler', function() {
  gScript.test(' 你好 ');
  console.log(__dirname);
  console.log('\n\n paths:\n');
  console.dir(base.paths);
});

const webpackhot = require('./config/webpack.hot.js');
console.dir(initScripts);
const HotCompiler = new webpackscripts.WebCompiler(webpackhot);

gulp.task('hot', () => {
  return HotCompiler.HotServer(ports.web, 8080);
});
