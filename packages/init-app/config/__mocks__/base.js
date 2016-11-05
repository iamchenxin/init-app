'use strict';

const real_base = require.requireActual('../base.js');

const base_mock = real_base.test_mock.base;

// copy pre defined mock to paths.
real_base.paths.testDir = base_mock.testDir;
real_base.paths.rcDir = base_mock.rcDir;
real_base.paths.rcFile = base_mock.rcFile;

module.exports = real_base;
