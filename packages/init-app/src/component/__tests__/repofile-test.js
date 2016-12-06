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
import { clean_ver, _mergeDep } from '../repofile.js';

describe('repofile.js', () => {
  describe('Class RepoCopy', () => {
    it('_copyDir', () => {

    });
    it('clean_ver', () => {
      const rt = clean_ver('^0.0.2');
      console.log(rt);
      const rt2 = clean_ver('github:gulpjs/gulp#4.0');
      expect(rt2).toEqual('github:gulpjs/gulp#4.0');
    });
  });
  describe('AppTool', () => {

  //  const tool = new AppTool('/tmp/dst', 'ts', 'nod', ({}: any));
    const dep1 = {
      'flow-dynamic': '0.0.14',
      'fs-extra': '^1.0.0',
      'semver': '^5.3.0',
      'yargs': '^6.5.0',
    };
    const dep_o = {
      'flow-dynamic': '0.0.11',
      'fs-extra': '^0.5.0',
      'semver': '^3.3.0',
      'yargs': '^5.5.0',
    };
    const devDep1 = {
      'babel-cli': '^6.18.0',
      'babel-core': '^6.18.2',
      'flow-bin': '^0.36.0',
      'gulp': 'github:gulpjs/gulp#4.0',
      'gulp-babel': '^6.1.2',
      'gulp-rename': '^1.2.2',
      'gulp-sourcemaps': '^1.9.1',
      'init-preset-node': '^6.8.5',
      'init-scripts': '^0.0.2',
      'jest': '^17.0.3',
    };
    const devDep1_o = {
      'babel-cli': '^6.18.0',
      'babel-core': '^6.18.0',
      'flow-bin': '^0.33.0',
      'gulp': 'github:gulpjs/gulp#4.0',
      'gulp-babel': '^5.1.2',
      'gulp-rename': '^1.2.2',
      'gulp-sourcemaps': '^1.9.1',
      'init-preset-node': '^6.3.5',
      'init-scripts': '^0.0.2',
    };
    it('_mergeDep', () => {
      const rt = _mergeDep([devDep1_o,devDep1_o,devDep1],['babel-cli']);
      console.dir(rt);
    });
  });
});
