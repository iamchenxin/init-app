// @flow
declare var jest: Function;
declare var describe: Function;
declare var it: Function;
declare var expect: Function;
jest.mock('../../../config/base.js');
jest.mock('../rcfile.js');

import { getRepoName, getRepo } from '../git.js';
//const base = require('../../../config/base.js');
//const rcFile = require('../rcfile.js');
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

describe('Test ~~', () => {
  // it('aaa', () => {
  //   const git = new Git(
  //     'https://github.com/iamchenxin/ww.git',
  //   );
  //   const repoP = git.getRepo({tagOrBr: 'v0.0.1'});
  //   repoP.then( path => {
  //     return git._getHistoryFile('5161ba2e3', 'README.md');
  //   }).then( rt => console.log(rt) );
  // });
  it('bbb', () => {
    return getRepo('https://github.com/iamchenxin/ww.git', {tag: 'v0.0.1'})
    .then( gitlocal => {
      return gitlocal._getHistoryFile('5161ba2e3', 'README.md');
    }).then( rt => console.log(rt) );
  });
});
