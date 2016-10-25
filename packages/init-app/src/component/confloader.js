/* @flow
**/
import type { RepoFile } from './repofile.js';
const rcFile = require('./rcfile.js');
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

function getConfs() {
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

function getConfNames(): Array<string> {
  const confs = getConfs();
  return Array.from(confs.keys());
}

function requireConf(repoName: string): RepoFile {
  const confs = getConfs();
  const confPath = confs.get(repoName);
  mustNot(confPath, null);
  // $FlowFixMe Flow do not allow dynamic require
  const mod:any = require(confPath);
  return mod;
}

function loadConf(confPath: string): RepoFile {
  mustNot(confPath, null);
  // $FlowFixMe Flow do not allow dynamic require
  const mod:any = require(confPath);
  return mod;
}

export {
  requireConf,
  getConfNames,
  loadConf,
};
