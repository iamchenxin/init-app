'use strict';
const base = require.requireMock('../../../config/base.js');
const path = require.requireActual('path');

module.exports = {
  cacheDir: path.resolve(base.paths.rcDir, 'cache'),
  extRepoConfs: path.resolve(base.paths.rcDir, 'repoconfs'),
};
