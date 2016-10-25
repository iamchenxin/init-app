/* @flow
*/

import { Git } from '../component/git.js';
import { RepoCopy } from '../component/repofile.js';
import { requireConf } from '../component/confloader.js';
import { absolutePath } from '../utils/tools.js';
//const path = require('path');

import type { CopyConfig } from '../component/repofile.js';

type InitConfig = {
  repoName?: string,
  confPath?: string,
};

async function _exec(_appDir: string, cpConf: CopyConfig): Promise<string> {
  const destPath = absolutePath(_appDir);
  const git = new Git(cpConf.gitUrl);
  const repo = await git.getRepo();
  const cp = new RepoCopy(destPath, repo);
  cp.copy(cpConf);
  return destPath;
}

async function init(_appDir: string, conf: InitConfig): Promise<string> {
  if ( conf.repoName == null) { throw new Error('ee'); }
  const confFile = requireConf(conf.repoName); // if
  return _exec(_appDir, confFile.copy);
}

async function update(_appDir: string, conf: InitConfig): Promise<string> {
  if ( conf.repoName == null) { throw new Error('ee'); }
  const confFile = requireConf(conf.repoName); // if
  return _exec(_appDir, confFile.update);
}

export {
  init,
  update,
};
