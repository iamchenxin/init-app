// @flow
declare var jest: Function;
declare var describe: Function;
declare var it: Function;
declare var xit: Function;
declare var expect: Function;
jest.mock('../../../config/base.js');
jest.mock('../rcfile.js');

import { getRepoName, getRepo, Git, parseGitLog } from '../git.js';
//const base = require('../../../config/base.js');
const rcFile = require('../rcfile.js');
const path = require('path');
// import { RepoFileError } from '../../utils/error.js';

describe('repofile.js', () => {
  describe('Class RepoCopy', () => {
    it('_copyDir', () => {
      
    });
  });

});
