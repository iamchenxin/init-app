/* @flow
**/
import type { RepoFile } from './repofile.js';
import type { RcFile } from './rcfile.js';
const fs = require('fs');
const path = require('path');
import { warn, mustNot } from '../utils/tools.js';

function _getConfsMap(absPath: string): Map<string, string> {
  let files = [];
  if ( fs.existsSync(absPath) ) {
    if ( fs.statSync(absPath).isDirectory() ) {
      files = fs.readdirSync(absPath);
    } else {
      throw new Error(`${absPath} should be Dir`);
    }
  }

  const confMap: Map<string, string> = new Map();
  const jsFiles = files
  .filter( file => (path.extname(file) == '.js') );

  for (const jsfile of jsFiles) {
    confMap.set(path.basename(jsfile, '.js'), path.resolve(absPath, jsfile));
  }
  return confMap;
}

let _confs: Map<string, string>|null = null;

function getConfs(rcFile: RcFile) {
  if ( _confs == null ) {
    const extConfs = _getConfsMap(rcFile.extRepoConfs);
    const innerConfs = _getConfsMap(path.resolve(__dirname, '../repoconfs'));

    for (const [key, v] of innerConfs.entries()) {
      if ( extConfs.has(key) ) {
        warn(`Duplicate Repofile(${key}) in extRepoConfs`);
      }
      extConfs.set(key, v);
    }
    _confs = extConfs;
  }
  return _confs;
}

function getConfNames(rcFile: RcFile): Array<string> {
  const confs = getConfs(rcFile);
  return Array.from(confs.keys());
}

function requireConf(repoName: string, rcFile: RcFile): RepoFile {
  const confs = getConfs(rcFile);
  const confPath = confs.get(repoName);
  mustNot(null, confPath, `${repoName} get: ${String(confPath)}`);
  // $FlowFixMe Flow do not allow dynamic require
  const mod:any = require(confPath);
  return mod;
}

function loadConf(confPath: string): RepoFile {
  mustNot(null, confPath);
  // $FlowFixMe Flow do not allow dynamic require
  const mod:any = require(confPath);
  return mod;
}

export {
  requireConf,
  getConfNames,
  loadConf,
};
