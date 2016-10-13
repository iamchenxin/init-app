// @flow
/*eslint-env node */
const gulp = require('gulp');
const base = require('./config/base.js');
const scripts = require('init-scripts');
const hotConfig = require('./config/webpack.hot.js');
const { utils } = scripts;

gulp.task('lib', function() {
  const babelJson = utils.readRC(base.paths.babelrc);
  return scripts.gulpscripts.compileJS('src', 'lib', babelJson);
});

gulp.task('clean', function() {
  return utils.rmdir([
    'lib',
    'index.js',
    'index.js.flow',
    'index.js.map',
  ] );
});

gulp.task('hot', () => {
  const compiler = new scripts.webpackscripts.WebCompiler(hotConfig);
  return compiler.HotServer(base.ports.web);
});
