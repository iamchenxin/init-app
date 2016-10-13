// @flow
/*eslint-env node */
const gulp = require('gulp');
const { ports} = require('./config/base.js');
const scripts = require('init-scripts');
const hotConfig = require('./config/webpack.hot.js');

gulp.task('hot', () => {
  const compiler = new scripts.webpackscripts.WebCompiler(hotConfig);
  return compiler.HotServer(ports.web);
});
