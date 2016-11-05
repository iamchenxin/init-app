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


describe('Test util functions', () => {
  it('test getRepoName', () => {

    expectName('https://github.com/iamchenxin/flow-dynamic.git')
    .toEqual('flow-dynamic');

    expectName('git://github.com/iamchenxin/flow-dynamic')
    .toEqual('flow-dynamic');

    expectName('/github.com/iamchenxin/flow-dynamic')
    .toEqual('flow-dynamic');


    function expectName(url, name) {
      return expect( getRepoName(url) );
    }
  });
});

describe('Git', () => {
  // it('aaa', () => {
  //   const git = new Git(
  //     'https://github.com/iamchenxin/ww.git',
  //   );
  //   const repoP = git.getRepo({tagOrBr: 'v0.0.1'});
  //   repoP.then( path => {
  //     return git._getHistoryFile('5161ba2e3', 'README.md');
  //   }).then( rt => console.log(rt) );
  // });
  xit('bbb', () => {
    return getRepo('https://github.com/iamchenxin/ww.git', {tag: 'v0.0.1'})
    .then( gitlocal => {
      return gitlocal._getHistoryFile('5161ba2e3', 'README.md');
    }).then( rt => console.log(rt) );
  });
  describe('_checkoutTagBr', () => {
    const cache = rcFile.cacheDir;
    const repoName = 'ww';
    const repoPath = path.resolve(cache, repoName);
    const url = 'https://github.com/iamchenxin/ww.git';
    const git: Git = new Git(url, repoName, repoPath, cache);
    it('after checkout, git.commit should be available', () => {
      return git._checkoutTagBr('master').then( rt => {
        // $FlowFixMe: let jest check
        expect(git.commit.length).toBeGreaterThan(0);
      });
    });
  });
  describe('parseGitLog', () => {
    const logMsg = 'commit ce8930b1ab25c586e606ae461b9c14a90742bbe5\n' +
    'Author: iamchenxin <iamchenxin@gmail.com>\n' +
    'Date:   Fri Nov 4 11:10:14 2016 -0600\n\n' +
    '    Make mustbe and mustNot accept errMsg:string|Error\n';
    it('parse message string to object', () => {
      const gitlog = parseGitLog(logMsg);
      expect(gitlog).toEqual({
        commit: 'ce8930b1ab25c586e606ae461b9c14a90742bbe5',
        Author: 'iamchenxin',
        Date: 'Fri Nov 4 11:10:14 2016 -0600',
        message: 'Make mustbe and mustNot accept errMsg:string|Error',
      });
    });
  });
});
