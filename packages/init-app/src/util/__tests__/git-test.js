// @flow
declare var jest: Function;
declare var describe: Function;
declare var it: Function;
declare var expect: Function;

import { getRepoName } from '../git.js';
import {RepoFileError } from '../error.js';


describe('Test util functions', () => {
  it('test getRepoName', () =>{

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
