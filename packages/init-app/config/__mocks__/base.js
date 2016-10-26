'use strict';

const real_base = require.requireActual('../base.js');
const path = require.requireActual('path');

const appRoot = real_base.paths.appRoot;

const testDir = path.resolve(appRoot, 'tpjest');

function toTestDir(relativePath) {
  return path.resolve(testDir, relativePath);
}

// add and modify some fields
real_base.paths.testDir = testDir;
real_base.paths.rcDir = toTestDir('./.init-app');
real_base.paths.rcFile = toTestDir('./.init-app/iapprc.js');

module.exports = real_base;
