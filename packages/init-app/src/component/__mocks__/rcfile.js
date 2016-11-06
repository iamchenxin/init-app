'use strict';
const base = require.requireMock('../../../config/base.js');
const rc_mock = base.test_mock.rcfile;
module.exports = {
  cacheDir: rc_mock.cacheDir,
  extRepoConfs: rc_mock.extRepoConfs,
};
