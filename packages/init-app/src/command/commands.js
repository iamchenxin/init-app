/* @flow
*/

//import { Git } from '../component/git.js';
import { repoCopy } from '../component/repofile.js';
import { requireConf } from '../component/confloader.js';
import { absolutePath, mustbe, mustNot } from '../utils/tools.js';
import { spawn } from '../utils/child-process.js';
import { pro } from 'flow-dynamic';
const fs = require('fs');
//const path = require('path');

import type { RepoConfig } from '../component/repofile.js';

type InitConfig = {
  repoName?: string,
  confPath?: string,
  npminstall?: boolean,
};

async function _exec(_appPath: string, cpConf: RepoConfig,
confName: string): Promise<string> {
  const destPath = absolutePath(_appPath);
  await repoCopy(destPath, cpConf, confName);
  return destPath;
}

async function _npmInstall(_appPath: string): Promise<number> {
  return await spawn('npm', ['install'], {cwd: _appPath});
}

async function init(_appPath: string, conf: InitConfig): Promise<string> {
  mustbe(false, fs.existsSync(_appPath), new Error('the path already exist, ' +
  'please choose an other app name'));
  const repoName = pro.isString(conf.repoName, 'Command init: Must have a Repo Name');
  const confFile = requireConf(repoName); // if
  const rt = await _exec(_appPath, confFile.copy, repoName);
  if ( conf.npminstall ) {
    _npmInstall(_appPath);
  }
  return rt;
}

async function update(_appPath: string, conf: InitConfig): Promise<string> {
  if ( conf.repoName == null) { throw new Error('ee'); }
  const repoName = pro.isString(conf.repoName, 'Command init: Must have a Repo Name');
  const confFile = requireConf(repoName); // if
  const rt = await _exec(_appPath, confFile.update, repoName);
  if ( conf.npminstall ) {
    _npmInstall(_appPath);
  }
  return rt;
}

export {
  init,
  update,
};
