/* @flow
*/

import { Git } from '../component/git.js';
import { RepoCopy } from '../component/repofile.js';
import { requireConf } from '../component/confloader.js';
import { absolutePath } from '../utils/tools.js';
import { spawn } from '../utils/child-process.js';
//const path = require('path');

import type { CopyConfig } from '../component/repofile.js';

type InitConfig = {
  repoName?: string,
  confPath?: string,
  npminstall?: boolean,
};

async function _exec(_appPath: string, cpConf: CopyConfig): Promise<string> {
  const destPath = absolutePath(_appPath);
  const git = new Git(cpConf.gitUrl);
  const repo = await git.getRepo();
  const cp = new RepoCopy(destPath, repo);
  await cp.copy(cpConf);
  return destPath;
}

async function _npmInstall(_appPath: string): Promise<number> {
  return await spawn('npm', ['install'], {cwd: _appPath});
}

async function init(_appPath: string, conf: InitConfig): Promise<string> {
  if ( conf.repoName == null) { throw new Error('ee'); }
  const confFile = requireConf(conf.repoName); // if
  const rt = await _exec(_appPath, confFile.copy);
  if ( conf.npminstall ) {
    _npmInstall(_appPath);
  }
  return rt;
}

async function update(_appPath: string, conf: InitConfig): Promise<string> {
  if ( conf.repoName == null) { throw new Error('ee'); }
  const confFile = requireConf(conf.repoName); // if
  const rt = await _exec(_appPath, confFile.update);
  if ( conf.npminstall ) {
    _npmInstall(_appPath);
  }
  return rt;
}

export {
  init,
  update,
};
