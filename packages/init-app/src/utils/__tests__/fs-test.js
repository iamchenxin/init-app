// @flow
declare var jest: Function;
declare var describe: Function;
declare var it: Function;
declare var expect: Function;
declare var beforeAll: Function;

jest.mock('../fs.js');
jest.mock('../../../config/base.js');
const { fs, FS, _fsRecorder } = require('../fs.js');
const unmockfs = require.requireActual('../fs.js');
const base = require('../../../config/base.js');
const path = require('path');
import { format } from '../tools.js';

import { RepoFileError } from '../error.js';

const testDir = base.test_mock.base.testDir;
const thisTestDir = path.resolve(testDir, 'fs-test');

describe('Test tools.js', () => {
  beforeAll( () => {
  });

  describe('mkdirR', () => {

    it('hahah', () => {
//      fs.mkdirR = unmockfs.fs.mkdirR;

      fs.mkdirR('/home/iamchenxin/tmp/mkdt/hah');
      console.log(format(_fsRecorder.cmdList));
      console.log(format(_fsRecorder.argsTocmd));
    });
  });
});
